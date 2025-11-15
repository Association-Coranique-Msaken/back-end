/**
 * API Module - Central export for all API services and types
 * 
 * This module provides a unified interface for making API calls to the backend.
 * All services use the configured axios client with automatic token refresh
 * and error handling.
 * 
 * Usage example:
 * ```typescript
 * import { authService, adminService, User, CreateUserDto } from '@/api';
 * 
 * // Login
 * const response = await authService.adminLogin({ username: 'admin', password: '123' });
 * 
 * // Get users
 * const users = await adminService.getUsers({ page: 1, take: 10 });
 * ```
 */

// Export API client configuration
export { default as apiClient } from './config';

// Export all types
export * from './types';

// Export all services
export { default as authService } from './services/authService';
export { default as adminService } from './services/adminService';
export { default as userService } from './services/userService';
export { default as teacherService } from './services/teacherService';
export { default as tokensService } from './services/tokensService';
