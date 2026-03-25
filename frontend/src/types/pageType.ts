export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;        // หน้าปัจจุบัน (0-based)
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements: number;
}