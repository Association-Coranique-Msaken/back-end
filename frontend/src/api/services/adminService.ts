import apiClient from '../config';
import type {
  Admin,
  CreateAdminDto,
  UpdateAdminDto,
  CreateUserAdminDto,
  Teacher,
  CreateTeacherDto,
  UpdateTeacherDto,
  User,
  CreateUserDto,
  UpdateUserDto,
  Group,
  CreateGroupDto,
  UpdateGroupDto,
  EnrollUserToGroupDto,
  Card,
  CreateCardDto,
  Competition,
  CreateCompetitionDto,
  UpdateCompetitionDto,
  CompetitionRegistration,
  CreateCompetitionRegistrationDto,
  UpdateCompetitionRegistrationDto,
  PagedResponse,
  PaginationParams,
} from '../types';

/**
 * Admin API Service
 * Handles all admin-related API calls
 * All endpoints require admin authentication
 */
class AdminService {
  // ==================== Admin Management ====================

  /**
   * Create an admin
   * POST /api/v1/admin-api/admin
   * Requires full access admin authorization
   */
  async createAdmin(data: CreateAdminDto): Promise<Admin> {
    const response = await apiClient.post<Admin>('/admin-api/admin/', data);
    return response.data;
  }

  /**
   * Get admins list with pagination
   * GET /api/v1/admin-api/admin/list
   * Requires read-only admin authorization
   */
  async getAdmins(params?: PaginationParams): Promise<PagedResponse<Admin>> {
    const response = await apiClient.get<PagedResponse<Admin>>('/admin-api/admin/list', { params });
    return response.data;
  }

  /**
   * Get admin by ID
   * GET /api/v1/admin-api/admin/:id
   * Requires read-only admin authorization
   */
  async getAdminById(id: string): Promise<Admin> {
    const response = await apiClient.get<Admin>(`/admin-api/admin/${id}`);
    return response.data;
  }

  /**
   * Update admin
   * PATCH /api/v1/admin-api/admin/:id
   * Requires full access admin authorization
   */
  async updateAdmin(id: string, data: UpdateAdminDto): Promise<Admin> {
    const response = await apiClient.patch<Admin>(`/admin-api/admin/${id}`, data);
    return response.data;
  }

  /**
   * Delete admin
   * DELETE /api/v1/admin-api/admin/:id
   * Requires full access admin authorization
   */
  async deleteAdmin(id: string): Promise<void> {
    await apiClient.delete(`/admin-api/admin/${id}`);
  }

  /**
   * Generate password reset link for admin
   * GET /api/v1/admin-api/admin/password-reset-link/:id
   * Requires full access admin authorization
   */
  async generateAdminResetPasswordLink(id: string): Promise<{ link: string }> {
    const response = await apiClient.get<{ link: string }>(`/admin-api/admin/password-reset-link/${id}`);
    return response.data;
  }

  // ==================== Teacher Management ====================

  /**
   * Create a teacher
   * POST /api/v1/admin-api/teacher
   * Requires full access admin authorization
   */
  async createTeacher(data: CreateTeacherDto): Promise<Teacher> {
    const response = await apiClient.post<Teacher>('/admin-api/teacher/', data);
    return response.data;
  }

  /**
   * Get teachers list with pagination
   * GET /api/v1/admin-api/teacher/list
   * Requires read-only admin authorization
   */
  async getTeachers(params?: PaginationParams): Promise<PagedResponse<Teacher>> {
    const response = await apiClient.get<PagedResponse<Teacher>>('/admin-api/teacher/list', { params });
    return response.data;
  }

  /**
   * Get teacher by ID
   * GET /api/v1/admin-api/teacher/:id
   * Requires read-only admin authorization
   */
  async getTeacherById(id: string): Promise<Teacher> {
    const response = await apiClient.get<Teacher>(`/admin-api/teacher/${id}`);
    return response.data;
  }

  /**
   * Update teacher
   * PATCH /api/v1/admin-api/teacher/:id
   * Requires full access admin authorization
   */
  async updateTeacher(id: string, data: UpdateTeacherDto): Promise<Teacher> {
    const response = await apiClient.patch<Teacher>(`/admin-api/teacher/${id}`, data);
    return response.data;
  }

  /**
   * Delete teacher
   * DELETE /api/v1/admin-api/teacher/:id
   * Requires full access admin authorization
   */
  async deleteTeacher(id: string): Promise<void> {
    await apiClient.delete(`/admin-api/teacher/${id}`);
  }

  /**
   * Regenerate teacher password
   * POST /api/v1/admin-api/teacher/password/:teacherId
   * Requires full access admin authorization
   */
  async regenerateTeacherPassword(teacherId: string): Promise<{ password: string }> {
    const response = await apiClient.post<{ password: string }>(`/admin-api/teacher/password/${teacherId}`);
    return response.data;
  }

  // ==================== User Management ====================

  /**
   * Create a user
   * POST /api/v1/admin-api/user
   * Requires full access admin authorization
   */
  async createUser(data: CreateUserDto): Promise<User> {
    const response = await apiClient.post<User>('/admin-api/user/', data);
    return response.data;
  }

  /**
   * Get users list with pagination
   * GET /api/v1/admin-api/user/list
   * Requires read-only admin authorization
   */
  async getUsers(params?: PaginationParams): Promise<PagedResponse<User>> {
    const response = await apiClient.get<PagedResponse<User>>('/admin-api/user/list', { params });
    return response.data;
  }

  /**
   * Get user by ID
   * GET /api/v1/admin-api/user/:id
   * Requires read-only admin authorization
   */
  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/admin-api/user/${id}`);
    return response.data;
  }

  /**
   * Update user
   * PATCH /api/v1/admin-api/user/:id
   * Requires full access admin authorization
   */
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const response = await apiClient.patch<User>(`/admin-api/user/${id}`, data);
    return response.data;
  }

  /**
   * Delete user
   * DELETE /api/v1/admin-api/user/:id
   * Requires full access admin authorization
   */
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/admin-api/user/${id}`);
  }

  // ==================== Group Management ====================

  /**
   * Create a group
   * POST /api/v1/admin-api/group
   * Requires full access admin authorization
   */
  async createGroup(data: CreateGroupDto): Promise<Group> {
    const response = await apiClient.post<Group>('/admin-api/group/', data);
    return response.data;
  }

  /**
   * Get groups list with pagination
   * GET /api/v1/admin-api/group/list
   * Requires read-only admin authorization
   */
  async getGroups(params?: PaginationParams): Promise<PagedResponse<Group>> {
    const response = await apiClient.get<PagedResponse<Group>>('/admin-api/group/list', { params });
    return response.data;
  }

  /**
   * Get group by ID
   * GET /api/v1/admin-api/group/:id
   * Requires read-only admin authorization
   */
  async getGroupById(id: string): Promise<Group> {
    const response = await apiClient.get<Group>(`/admin-api/group/${id}`);
    return response.data;
  }

  /**
   * Update group
   * PATCH /api/v1/admin-api/group/:id
   * Requires full access admin authorization
   */
  async updateGroup(id: string, data: UpdateGroupDto): Promise<Group> {
    const response = await apiClient.patch<Group>(`/admin-api/group/${id}`, data);
    return response.data;
  }

  /**
   * Delete group
   * DELETE /api/v1/admin-api/group/:id
   * Requires full access admin authorization
   */
  async deleteGroup(id: string): Promise<void> {
    await apiClient.delete(`/admin-api/group/${id}`);
  }

  /**
   * Get users in a group with pagination
   * GET /api/v1/admin-api/group/user/list/:id
   * Requires read-only admin authorization
   */
  async getGroupUsers(id: string, params?: PaginationParams): Promise<PagedResponse<User>> {
    const response = await apiClient.get<PagedResponse<User>>(`/admin-api/group/user/list/${id}`, { params });
    return response.data;
  }

  /**
   * Enroll user to a group
   * POST /api/v1/admin-api/group/user/enroll
   * Requires full access admin authorization
   */
  async enrollUserToGroup(data: EnrollUserToGroupDto): Promise<void> {
    await apiClient.post('/admin-api/group/user/enroll/', data);
  }

  // ==================== Card Management ====================

  /**
   * Create card for user
   * POST /api/v1/admin-api/card/user
   * Requires full access admin authorization
   */
  async createCardForUser(data: CreateCardDto): Promise<Card> {
    const response = await apiClient.post<Card>('/admin-api/card/user/', data);
    return response.data;
  }

  /**
   * Get user's last card by user ID
   * GET /api/v1/admin-api/card/user/:userId
   * Requires read-only admin authorization
   */
  async getUserLastCard(userId: string): Promise<Card | null> {
    const response = await apiClient.get<Card | null>(`/admin-api/card/user/${userId}`);
    return response.data;
  }

  // ==================== Competition Management ====================

  /**
   * Create a competition
   * POST /api/v1/admin-api/competition
   * Requires full access admin authorization
   */
  async createCompetition(data: CreateCompetitionDto): Promise<Competition> {
    const response = await apiClient.post<Competition>('/admin-api/competition/', data);
    return response.data;
  }

  /**
   * Get competitions list with pagination
   * GET /api/v1/admin-api/competition/list
   * Requires read-only admin authorization
   */
  async getCompetitions(params?: PaginationParams): Promise<PagedResponse<Competition>> {
    const response = await apiClient.get<PagedResponse<Competition>>('/admin-api/competition/list', { params });
    return response.data;
  }

  /**
   * Get competition by ID
   * GET /api/v1/admin-api/competition/:id
   * Requires read-only admin authorization
   */
  async getCompetitionById(id: string): Promise<Competition> {
    const response = await apiClient.get<Competition>(`/admin-api/competition/${id}`);
    return response.data;
  }

  /**
   * Update competition
   * PATCH /api/v1/admin-api/competition/:id
   * Requires full access admin authorization
   */
  async updateCompetition(id: string, data: UpdateCompetitionDto): Promise<Competition> {
    const response = await apiClient.patch<Competition>(`/admin-api/competition/${id}`, data);
    return response.data;
  }

  /**
   * Delete competition
   * DELETE /api/v1/admin-api/competition/:id
   * Requires full access admin authorization
   */
  async deleteCompetition(id: string): Promise<void> {
    await apiClient.delete(`/admin-api/competition/${id}`);
  }

  // ==================== Competition Registration Management ====================

  /**
   * Create a competition registration
   * POST /api/v1/admin-api/competition/registration
   * Requires full access admin authorization
   */
  async createCompetitionRegistration(data: CreateCompetitionRegistrationDto): Promise<CompetitionRegistration> {
    const response = await apiClient.post<CompetitionRegistration>('/admin-api/competition/registration/', data);
    return response.data;
  }

  /**
   * Get competition registrations list with pagination
   * GET /api/v1/admin-api/competition/registration/list
   * Requires read-only admin authorization
   */
  async getCompetitionRegistrations(params?: PaginationParams): Promise<PagedResponse<CompetitionRegistration>> {
    const response = await apiClient.get<PagedResponse<CompetitionRegistration>>(
      '/admin-api/competition/registration/list',
      { params }
    );
    return response.data;
  }

  /**
   * Get competition registration by ID
   * GET /api/v1/admin-api/competition/registration/:id
   * Requires read-only admin authorization
   */
  async getCompetitionRegistrationById(id: string): Promise<CompetitionRegistration> {
    const response = await apiClient.get<CompetitionRegistration>(`/admin-api/competition/registration/${id}`);
    return response.data;
  }

  /**
   * Update competition registration
   * PATCH /api/v1/admin-api/competition/registration/:id
   * Requires full access admin authorization
   */
  async updateCompetitionRegistration(
    id: string,
    data: UpdateCompetitionRegistrationDto
  ): Promise<CompetitionRegistration> {
    const response = await apiClient.patch<CompetitionRegistration>(
      `/admin-api/competition/registration/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Delete competition registration
   * DELETE /api/v1/admin-api/competition/registration/:id
   * Requires full access admin authorization
   */
  async deleteCompetitionRegistration(id: string): Promise<void> {
    await apiClient.delete(`/admin-api/competition/registration/${id}`);
  }
}

export default new AdminService();
