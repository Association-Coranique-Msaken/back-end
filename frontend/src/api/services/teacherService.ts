import apiClient from '../config';
import type { Teacher, UpdateTeacherDto, Group, PagedResponse, PaginationParams } from '../types';

/**
 * Teacher API Service
 * Handles all teacher-related API calls
 * All endpoints require teacher authentication
 */
class TeacherService {
  /**
   * Update teacher data
   * PATCH /api/v1/teacher-api/teacher
   * Requires teacher authentication and write authorization
   */
  async updateTeacher(data: UpdateTeacherDto): Promise<Teacher> {
    const response = await apiClient.patch<Teacher>('/teacher-api/teacher', data);
    return response.data;
  }

  /**
   * Get teacher's groups with pagination
   * GET /api/v1/teacher-api/group/list
   * Requires teacher authentication
   */
  async getGroups(params?: PaginationParams): Promise<PagedResponse<Group>> {
    const response = await apiClient.get<PagedResponse<Group>>('/teacher-api/group/list', { params });
    return response.data;
  }
}

export default new TeacherService();
