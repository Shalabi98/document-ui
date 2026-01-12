import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit, OnDestroy {
  // Data state
  documents: Document[] = [];
  selectedDoc: Document | null = null;

  // Pagination state
  totalItems = 0;
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;

  // Filter state
  filterRuc = '';
  filterDate = '';
  filterFlag = true;

  // Subscription Management
  private subs: Subscription = new Subscription();

  constructor(
    private documentService: DocumentService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Group subscriptions so we can destroy them all at once
    this.subs.add(
      this.documentService.documents$.subscribe((data) => {
        this.documents = data;
      })
    );
    this.subs.add(
      this.documentService.totalItems$.subscribe((total) => {
        this.totalItems = total;
        this.calculateTotalPages();
      })
    );
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.currentPage = newPage;
      this.documentService.loadDocuments(this.currentPage, this.pageSize);
    }
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize) || 1;
  }

  selectDocument(doc: Document): void {
    this.selectedDoc = doc;
  }

  // Client side filtering using Issuer RUC and Document Data
  get filteredDocuments(): Document[] {
    if (!this.filterRuc && !this.filterDate) {
      return this.documents;
    }

    return this.documents.filter((doc) => {
      const matchRuc = this.filterRuc
        ? doc.issuerRuc.includes(this.filterRuc)
        : true;

      const matchDate = this.filterDate
        ? doc.documentDate === this.filterDate
        : true;

      return matchRuc && matchDate;
    });
  }

  clearFilters(): void {
    this.filterRuc = '';
    this.filterDate = '';
  }

  // Security: Sanitize Base64 images to prevent XSS
  getSafeUrl(base64String: string): SafeUrl {
    // Robust check for prefix
    const hasPrefix = base64String.startsWith('data:image');
    const url = hasPrefix
      ? base64String
      : `data:image/jpeg;base64,${base64String}`;

    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  // Prevent memory leaks
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
