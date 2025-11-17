/**
 * Shared Types Module
 * 
 * This module contains type definitions shared between frontend, backend, and tests.
 * It serves as the single source of truth for API response formats and common data structures.
 */

// ==================== API Response Types ====================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    pageNumber?: number;
    pageSize?: number;
    itemCount?: number;
    pageCount?: number;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
  };
}

export interface LoginResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  accessToken: string;
  refreshToken: string;
  userTokenExpiration: string;
  refreshTokenExpiration: string;
}

// ==================== Pagination Types ====================

export interface PaginationParams {
  page?: number;
  take?: number;
  order?: 'ASC' | 'DESC';
  orderBy?: string;
}

export interface PageMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PagedResponse<T> {
  data: T[];
  meta: PageMeta;
}
