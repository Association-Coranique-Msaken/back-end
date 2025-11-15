import apiClient from '../config';
import type { User, UpdateUserDto } from '../types';

/**
 * User API Service
 * Handles all user-related API calls
 * All endpoints require user authentication
 */
class UserService {
  /**
   * Update user data
   * PATCH /api/v1/user-api/user
   * Requires user authentication
   */
  async updateUser(data: UpdateUserDto): Promise<User> {
    const response = await apiClient.patch<User>('/user-api/user', data);
    return response.data;
  }
}

export default new UserService();
