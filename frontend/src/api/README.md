# Frontend API Services

This directory contains all the API service implementations for communicating with the backend. The services provide a clean, type-safe interface for making HTTP requests.

## 📁 Structure

```
api/
├── config.ts                 # Axios client configuration with interceptors
├── types.ts                  # TypeScript type definitions for all DTOs
├── index.ts                  # Central export file
├── services/
│   ├── authService.ts        # Authentication endpoints
│   ├── adminService.ts       # Admin management endpoints
│   ├── userService.ts        # User endpoints
│   ├── teacherService.ts     # Teacher endpoints
│   └── tokensService.ts      # Token management endpoints
└── README.md                 # This file
```

## 🚀 Getting Started

### Basic Usage

Import the services you need:

```typescript
import { authService, adminService, userService } from '@/api';
// or
import { authService, adminService } from './api';
```

### Configuration

Set the API base URL in your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

If not set, it defaults to `http://localhost:5000/api/v1`.

## 📚 Services Documentation

### 🔐 Auth Service

Handles authentication operations.

```typescript
import { authService, AdminLoginDto, UserLoginDto, TeacherLoginDto } from '@/api';

// Admin login
const adminResponse = await authService.adminLogin({
  username: 'admin',
  password: 'password123'
});
console.log(adminResponse.accessToken);
console.log(adminResponse.admin);

// User login
const userResponse = await authService.userLogin({
  identifier: '12345678',
  birthDate: '2000-01-01'
});

// Teacher login
const teacherResponse = await authService.teacherLogin({
  code: 'TEACH001',
  password: 'password123'
});

// Logout (requires authentication)
await authService.logout();

// Refresh token
const refreshed = await authService.refreshToken({
  refreshToken: 'your-refresh-token'
});

// Reset admin password
await authService.resetAdminPassword({
  token: 'reset-token',
  newPassword: 'newPassword123'
});
```

### 👨‍💼 Admin Service

Comprehensive admin operations including CRUD for admins, teachers, users, groups, and competitions.

```typescript
import { adminService, CreateUserDto, UpdateUserDto } from '@/api';

// ===== User Management =====

// Create a user
const newUser = await adminService.createUser({
  identifier: '12345678',
  firstName: 'John',
  lastName: 'Doe',
  fatherFirstName: 'James',
  motherFirstName: 'Jane',
  motherLastName: 'Smith',
  birthDate: '2000-01-01',
  birthPlace: 'City',
  gender: 'male'
});

// Get users with pagination
const users = await adminService.getUsers({
  page: 1,
  take: 10,
  order: 'DESC',
  orderBy: 'createdAt'
});
console.log(users.data); // Array of users
console.log(users.meta); // Pagination metadata

// Get user by ID
const user = await adminService.getUserById('user-uuid');

// Update user
const updatedUser = await adminService.updateUser('user-uuid', {
  phoneNumber: '+1234567890'
});

// Delete user
await adminService.deleteUser('user-uuid');

// ===== Teacher Management =====

// Create teacher
const teacher = await adminService.createTeacher({
  codeType: 'T001',
  kotebName: 'Koteb Name',
  userId: 'user-uuid'
});

// Get teachers with pagination
const teachers = await adminService.getTeachers({ page: 1, take: 20 });

// Regenerate teacher password
const newPassword = await adminService.regenerateTeacherPassword('teacher-uuid');
console.log(newPassword.password);

// ===== Group Management =====

// Create group
const group = await adminService.createGroup({
  code: 'GRP01',
  days: 'Monday, Wednesday',
  timeRange: '10:00-12:00',
  roomNumber: 101,
  levelOrNumHizbs: 'Level 1',
  courseType: 'theoretical',
  teacherId: 'teacher-uuid'
});

// Get groups
const groups = await adminService.getGroups({ page: 1, take: 10 });

// Get group users
const groupUsers = await adminService.getGroupUsers('group-uuid', { page: 1, take: 50 });

// Enroll user to group
await adminService.enrollUserToGroup({
  userId: 'user-uuid',
  groupId: 'group-uuid'
});

// ===== Competition Management =====

// Create competition
const competition = await adminService.createCompetition({
  edition: '2024',
  scope: 'National',
  isActive: true
});

// Get competitions
const competitions = await adminService.getCompetitions();

// Create competition registration
const registration = await adminService.createCompetitionRegistration({
  competitionId: 'competition-uuid',
  userId: 'user-uuid',
  teacherId: 'teacher-uuid'
});

// ===== Card Management =====

// Create card for user
const card = await adminService.createCardForUser({
  userId: 'user-uuid'
});

// Get user's last card
const lastCard = await adminService.getUserLastCard('user-uuid');
```

### 👤 User Service

User self-management operations.

```typescript
import { userService, UpdateUserDto } from '@/api';

// Update own profile (requires user authentication)
const updatedProfile = await userService.updateUser({
  phoneNumber: '+1234567890',
  fatherPhoneNumber: '+0987654321'
});
```

### 👨‍🏫 Teacher Service

Teacher-specific operations.

```typescript
import { teacherService, UpdateTeacherDto } from '@/api';

// Update own profile (requires teacher authentication)
const updatedProfile = await teacherService.updateTeacher({
  kotebName: 'New Koteb Name',
  bonus: 'Some bonus info'
});

// Get my groups (requires teacher authentication)
const myGroups = await teacherService.getGroups({ page: 1, take: 10 });
```

### 🔑 Tokens Service

Token management operations.

```typescript
import { tokensService } from '@/api';

// Clear expired tokens
await tokensService.clearExpiredTokens();

// Invalidate user tokens
await tokensService.invalidateUserTokens({
  userId: 'user-uuid'
});
```

## 🔒 Authentication

The API client automatically:
- Adds the `Authorization: Bearer <token>` header to requests
- Handles token refresh on 401 responses
- Stores tokens in localStorage
- Redirects to login on refresh failure

### Token Storage

Tokens are stored in localStorage:
```typescript
localStorage.getItem('accessToken');
localStorage.getItem('refreshToken');
```

After login, save tokens:
```typescript
const response = await authService.adminLogin(credentials);
localStorage.setItem('accessToken', response.accessToken);
localStorage.setItem('refreshToken', response.refreshToken);
```

## 📄 Pagination

Most list endpoints support pagination:

```typescript
const params = {
  page: 1,        // Page number (starts at 1)
  take: 10,       // Items per page
  order: 'DESC',  // 'ASC' or 'DESC'
  orderBy: 'createdAt' // Field to order by
};

const result = await adminService.getUsers(params);
console.log(result.data);     // Array of items
console.log(result.meta);     // Pagination metadata
```

Pagination metadata includes:
```typescript
{
  page: 1,
  take: 10,
  itemCount: 10,
  pageCount: 5,
  hasPreviousPage: false,
  hasNextPage: true
}
```

## ⚠️ Error Handling

All API calls return Promises. Use try-catch for error handling:

```typescript
import { AxiosError } from 'axios';

try {
  const user = await adminService.getUserById('invalid-id');
} catch (error) {
  if (error instanceof AxiosError) {
    console.error('API Error:', error.response?.data);
    console.error('Status:', error.response?.status);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## 🎯 TypeScript Types

All DTOs and response types are fully typed. Import them as needed:

```typescript
import type {
  User,
  Admin,
  Teacher,
  Group,
  Competition,
  CreateUserDto,
  UpdateUserDto,
  AdminRole,
  CourseType,
  CompetitionScope,
  PagedResponse,
  PaginationParams
} from '@/api';
```

## 🔧 Customization

### Custom Interceptors

You can add custom interceptors to the API client:

```typescript
import { apiClient } from '@/api';

apiClient.interceptors.request.use((config) => {
  // Custom request logic
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Custom error handling
    return Promise.reject(error);
  }
);
```

## 📝 Notes

- All services are singleton instances (using `export default new ServiceClass()`)
- The API client uses `withCredentials: true` for cookie-based sessions
- Token refresh is automatic and transparent
- Type definitions match the backend DTOs exactly

## 🚦 Status

✅ All backend API endpoints have been implemented in the frontend
✅ Full TypeScript support with type definitions
✅ Automatic token refresh and error handling
✅ Ready for UI integration
