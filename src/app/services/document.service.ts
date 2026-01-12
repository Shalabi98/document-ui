import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Document } from '../models/document.model';
import { environment } from 'src/environments/environment';
import { Page } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService implements OnDestroy {
  private apiUrl = environment.apiUrl;
  private eventSource: EventSource | null = null;

  // // State Management
  private documentsSubject = new BehaviorSubject<Document[]>([]);
  // 2. Public Observable (Components subscribe to this)
  public documents$ = this.documentsSubject.asObservable();

  // NEW: Holds the total count of items (for calculating pages)
  private totalItemsSubject = new BehaviorSubject<number>(0);
  public totalItems$ = this.totalItemsSubject.asObservable();

  constructor(private http: HttpClient, private zone: NgZone) {
    this.loadDocuments(0, 10);
    this.connectToStream();
  }

  // Fetches paginated data from Spring Boot.
  public loadDocuments(page: number, size: number) {
    const params = {
      page: page.toString(),
      size: size.toString(),
      sort: 'createdAt,desc',
    };

    this.http.get<Page<Document>>(this.apiUrl, { params }).subscribe({
      next: (response) => {
        this.documentsSubject.next(response.content);
        this.totalItemsSubject.next(response.totalElements);
      },
      error: (err) => console.error('Failed to load documents', err),
    });
  }

  /*
   Manages SSE (Server-Sent Events) connection.
   Handles Zone entry to ensure UI updates trigger change detection.
   */
  private connectToStream(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }

    this.eventSource = new EventSource(`${this.apiUrl}/stream`);

    this.eventSource.addEventListener('new-document', (event: MessageEvent) => {
      const newDoc: Document = JSON.parse(event.data);

      // Re-enter Angular Zone to update UI immediately
      this.zone.run(() => {
        const currentDocs = this.documentsSubject.value;
        // Prepend new item (Real-time feel)
        this.documentsSubject.next([newDoc, ...currentDocs]);
        // Increment total count locally so pagination reflects reality
        this.totalItemsSubject.next(this.totalItemsSubject.value + 1);
      });
    });

    this.eventSource.onerror = (error) => {
      console.warn('SSE connection lost...', error);
      this.eventSource?.close();
    };
  }

  // Cleanup to prevent memory leaks
  ngOnDestroy(): void {
    this.eventSource?.close();
  }
}
