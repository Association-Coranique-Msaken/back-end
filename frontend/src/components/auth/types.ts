export type UserType = 'admin' | 'teacher' | 'student' | 'parent';

export interface UserTypeConfig {
  label: string;
  icon: React.ElementType;
  gradient: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  // Admin fields
  username: string;
  password: string;
  
  // Teacher fields
  code: string;
  
  // Student/Parent fields
  identifier: string;
  birthDate: string;
}

export interface FormErrors {
  username: string;
  password: string;
  code: string;
  identifier: string;
  birthDate: string;
}