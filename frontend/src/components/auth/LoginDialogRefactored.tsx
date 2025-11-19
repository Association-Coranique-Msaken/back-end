import * as React from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { DialogHeader } from '../common/DialogHeader';
import { AdminForm } from './forms/AdminForm';
import { TeacherForm } from './forms/TeacherForm';
import { StudentForm } from './forms/StudentForm';
import { ParentForm } from './forms/ParentForm';
import { userTypeConfig } from './config';
import { 
  validateAdminForm, 
  validateTeacherForm, 
  validateStudentForm, 
  hasValidationErrors 
} from './validation/validationRules';
import { authService } from '../../api';
import TokenManager from '../../utils/tokenManager';
import type { AdminLoginDto, TeacherLoginDto, UserLoginDto } from '../../api/types';
import type { UserType, FormState, FormErrors } from './types';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  userType: UserType;
}

const initialFormState: FormState = {
  username: '',
  password: '',
  code: '',
  identifier: '',
  birthDate: '',
};

const initialErrors: FormErrors = {
  username: '',
  password: '',
  code: '',
  identifier: '',
  birthDate: '',
};

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose, userType }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [formState, setFormState] = React.useState<FormState>(initialFormState);
  const [errors, setErrors] = React.useState<FormErrors>(initialErrors);

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setFormState(initialFormState);
    setErrors(initialErrors);
    setError(null);
    setSuccess(false);
  };

  const handleFieldChange = (field: keyof FormState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    let validationErrors: FormErrors;

    switch (userType) {
      case 'admin':
        validationErrors = validateAdminForm(formState);
        break;
      case 'teacher':
        validationErrors = validateTeacherForm(formState);
        break;
      case 'student':
        validationErrors = validateStudentForm(formState);
        break;
      default:
        return false;
    }

    setErrors(validationErrors);
    return !hasValidationErrors(validationErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (userType === 'parent') {
      setError('فضاء الوليّ سيكون متاحًا قريبًا');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      let response;

      switch (userType) {
        case 'admin':
          response = await authService.adminLogin({ 
            username: formState.username, 
            password: formState.password 
          } as AdminLoginDto);
          break;
        case 'teacher':
          response = await authService.teacherLogin({ 
            code: formState.code, 
            password: formState.password 
          } as TeacherLoginDto);
          break;
        case 'student':
          response = await authService.userLogin({ 
            identifier: formState.identifier, 
            birthDate: formState.birthDate 
          } as UserLoginDto);
          break;
        default:
          throw new Error('نوع مستخدم غير صالح');
      }

      if (response.success) {
        const { data, accessToken, refreshToken, userTokenExpiration } = response;
        
        // Store tokens and user data using TokenManager
        TokenManager.setTokens({
          accessToken,
          refreshToken,
          userTokenExpiration,
        }, {
          id: data.id,
          username: 'username' in data ? data.username : 'code' in data ? data.code : (data as any).identifier,
          role: 'role' in data ? data.role : undefined,
          type: userType === 'student' ? 'user' : userType,
        });

        setSuccess(true);
        
        // Redirect to dashboard
        const redirectPath = `/${userType}/dashboard`;
        window.location.href = redirectPath;
      } else {
        setError('فشل تسجيل الدخول');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    const commonProps = {
      formState,
      errors,
      disabled: loading,
      onChange: handleFieldChange,
    };

    switch (userType) {
      case 'admin':
        return <AdminForm {...commonProps} />;
      case 'teacher':
        return <TeacherForm {...commonProps} />;
      case 'student':
        return <StudentForm {...commonProps} />;
      case 'parent':
        return <ParentForm />;
      default:
        return null;
    }
  };

  const config = userTypeConfig[userType];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      dir="rtl"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      <DialogHeader 
        config={config} 
        onClose={handleClose} 
        loading={loading} 
      />

      <DialogContent sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            تم تسجيل الدخول بنجاح!
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {renderForm()}

          {userType !== 'parent' && (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;