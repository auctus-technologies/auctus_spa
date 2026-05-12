// Common Types - Shared across the application

export interface ApiError {
  error: string;
  detail?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface SortParams {
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface FilterParams {
  department?: string;
  status?: string;
  role?: string;
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: RequestStatus;
  error: string | null;
}
