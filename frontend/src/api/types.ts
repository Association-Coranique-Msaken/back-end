// ==================== Common Types ====================
// Import shared API response types from the shared module
import type { ApiResponse, LoginResponse as SharedLoginResponse, PaginationParams, PageMeta, PagedResponse } from '../../../shared/types';

// Re-export shared types for convenience
export type { ApiResponse, PaginationParams, PageMeta, PagedResponse };

// Extend LoginResponse with entity types (Generic in shared, specific here)
export type LoginResponse = SharedLoginResponse<Admin | User | Teacher>;

// ==================== User Types ====================

export type SocialCondition = 'donator' | 'poor' | 'teacherSon' | 'unknown';
export type Gender = 'male' | 'female';

export interface User {
  id: string;
  identifier: string;
  firstName: string;
  lastName: string;
  fatherFirstName: string;
  grandFatherFirstName?: string;
  motherFirstName: string;
  motherLastName: string;
  birthDate: string;
  birthPlace: string;
  phoneNumber?: string;
  fatherPhoneNumber?: string;
  motherPhoneNumber?: string;
  gender: Gender;
  cin?: string;
  hasNationalIDcard: boolean;
  hasGuaranteedBirthCertificate: boolean;
  hasPassport: boolean;
  socialCondition?: SocialCondition;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  identifier: string;
  firstName: string;
  lastName: string;
  fatherFirstName: string;
  grandFatherFirstName?: string;
  motherFirstName: string;
  motherLastName: string;
  birthDate: string;
  birthPlace: string;
  phoneNumber?: string;
  fatherPhoneNumber?: string;
  motherPhoneNumber?: string;
  gender: Gender;
  cin?: string;
  hasNationalIDcard?: boolean;
  hasGuaranteedBirthCertificate?: boolean;
  hasPassport?: boolean;
  socialCondition?: SocialCondition;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  fatherFirstName?: string;
  grandFatherFirstName?: string;
  motherFirstName?: string;
  motherLastName?: string;
  birthDate?: string;
  birthPlace?: string;
  phoneNumber?: string;
  fatherPhoneNumber?: string;
  motherPhoneNumber?: string;
  gender?: Gender;
  cin?: string;
  hasNationalIDcard?: boolean;
  hasGuaranteedBirthCertificate?: boolean;
  hasPassport?: boolean;
  socialCondition?: SocialCondition;
}

// ==================== Admin Types ====================

export type AdminRole = 'fullAccessAdmin' | 'limitedAccess' | 'readOnly';

export interface Admin {
  id: string;
  username: string;
  role: AdminRole;
  isDeleted: boolean;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminDto {
  username: string;
  password: string;
  role: AdminRole;
  userId: string;
}

export interface UpdateAdminDto {
  username?: string;
  role?: AdminRole;
}

export interface CreateUserAdminDto {
  // User fields
  identifier: string;
  firstName: string;
  lastName: string;
  fatherFirstName: string;
  grandFatherFirstName?: string;
  motherFirstName: string;
  motherLastName: string;
  birthDate: string;
  birthPlace: string;
  phoneNumber?: string;
  fatherPhoneNumber?: string;
  motherPhoneNumber?: string;
  gender: Gender;
  cin?: string;
  hasNationalIDcard?: boolean;
  hasGuaranteedBirthCertificate?: boolean;
  hasPassport?: boolean;
  // Admin fields
  username: string;
  password: string;
  role: AdminRole;
}

// ==================== Teacher Types ====================

export interface Teacher {
  id: string;
  code: string;
  kotebName?: string;
  bonus?: string;
  teacherType?: string;
  isActive: boolean;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherDto {
  codeType: string;
  kotebName?: string;
  bonus?: string;
  teacherType?: string;
  userId: string;
}

export interface UpdateTeacherDto {
  kotebName?: string;
  bonus?: string;
  teacherType?: string;
  isActive?: boolean;
}

// ==================== Group Types ====================

export type CourseType = 'practical' | 'theoretical' | 'summerGroup';

export interface Group {
  id: string;
  code: string;
  days: string;
  timeRange: string;
  roomNumber: number;
  levelOrNumHizbs: string;
  courseType: CourseType;
  maxStudents?: number;
  teacher: Teacher;
  numStudents?: number;
  inactiveStudents?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupDto {
  code: string;
  days: string;
  timeRange: string;
  roomNumber: number;
  levelOrNumHizbs: string;
  courseType: CourseType;
  maxStudents?: number;
  teacherId: string;
}

export interface UpdateGroupDto {
  code?: string;
  days?: string;
  timeRange?: string;
  roomNumber?: number;
  levelOrNumHizbs?: string;
  courseType?: CourseType;
  maxStudents?: number;
  teacherId?: string;
}

export interface EnrollUserToGroupDto {
  userId: string;
  groupId: string;
}

// ==================== Card Types ====================

export interface Card {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardDto {
  userId: string;
}

// ==================== Competition Types ====================

export type CompetitionScope = 'Local' | 'Regional' | 'National';

export interface Competition {
  id: string;
  edition: string;
  scope: CompetitionScope;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompetitionDto {
  edition: string;
  scope: CompetitionScope;
  isActive?: boolean;
}

export interface UpdateCompetitionDto {
  edition?: string;
  scope?: CompetitionScope;
  isActive?: boolean;
}

export interface CompetitionRegistration {
  id: string;
  competitionId: string;
  userId: string;
  teacherId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompetitionRegistrationDto {
  competitionId: string;
  userId: string;
  teacherId?: string;
}

export interface UpdateCompetitionRegistrationDto {
  competitionId?: string;
  userId?: string;
  teacherId?: string;
}

// ==================== Auth Types ====================

export interface UserLoginDto {
  identifier: string;
  birthDate: string;
}

export interface AdminLoginDto {
  username: string;
  password: string;
}

export interface TeacherLoginDto {
  code: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

// ==================== Token Types ====================

export interface ClearExpiredTokensDto {
  // Add any required fields if needed
}

export interface InvalidateUserTokensDto {
  userId: string;
}
