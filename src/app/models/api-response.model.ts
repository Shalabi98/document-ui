export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // Current page index
  first: boolean;
  last: boolean;
  empty: boolean;
}
