import apiClient from '../config';
import type {
  LoginResponse,
  UserLoginDto,
  AdminLoginDto,
  TeacherLoginDto,
  RefreshTokenDto,
  ResetPasswordDto,
} from '../types';

/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Admin login
   * POST /api/v1/auth/admin/login
   */
  async adminLogin(credentials: AdminLoginDto): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/admin/login', credentials);
    return response.data;
  }

  /**
   * Admin signup (Hidden API for testing purposes only)
   * POST /api/v1/auth/admin/signup
   */
  async adminSignup(credentials: AdminLoginDto): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/admin/signup', credentials);
    return response.data;
  }

  /**
   * User login
   * POST /api/v1/auth/user/login
   */
  async userLogin(credentials: UserLoginDto): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/user/login', credentials);
    return response.data;
  }

  /**
   * Teacher login
   * POST /api/v1/auth/teacher/login
   */
  async teacherLogin(credentials: TeacherLoginDto): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/teacher/login', credentials);
    return response.data;
  }

  /**
   * Logout
   * POST /api/v1/auth/logout
   * Requires authentication
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh-token
   */
  async refreshToken(data: RefreshTokenDto): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/refresh-token', data);
    return response.data;
  }

  /**
   * Reset admin password
   * POST /api/v1/auth/admin/reset-password
   */
  async resetAdminPassword(data: ResetPasswordDto): Promise<void> {
    await apiClient.post('/auth/admin/reset-password', data);
  }
}

export default new AuthService();
