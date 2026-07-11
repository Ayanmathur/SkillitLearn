/**
 * Shared TypeScript types for SkillItLearn.
 *
 * These are application-level types (not DB models - those come from Prisma).
 * Use these for API responses, component props, and cross-cutting concerns.
 */

/** User roles - matches the DB enum defined in Prompt 2 */
export type UserRole = "learner" | "instructor" | "admin" | "super_admin";

/** Authenticated user context available in server actions */
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

/** Standard API response wrapper */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Pagination params */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** Paginated response */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}
