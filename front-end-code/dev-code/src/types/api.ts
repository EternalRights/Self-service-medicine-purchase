// src/types/api.ts
/**
 * API响应通用格式
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
  timestamp: number;
}

/**
 * 分页响应格式
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 错误响应格式
 */
export interface ErrorResponse {
  code: number;
  message: string;
  details?: Record<string, string[]>;
}