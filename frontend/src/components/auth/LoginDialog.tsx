import * as React from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { authService } from '../../api';
import type { AdminLoginDto, TeacherLoginDto, UserLoginDto } from '../../api/types';

export type UserType = 'admin' | 'teacher' | 'student' | 'parent';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  userType: UserType;
}

const userTypeConfig: Record<UserType, {
  label: string;
  icon: React.ElementType;
  gradient: string;
}> = {
  admin: {
    label: 'فضاء الإدارة',
    icon: AdminPanelSettingsIcon,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  teacher: {
    label: 'فضاء المؤدب',
    icon: SchoolIcon,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  student: {
    label: 'فضاء التلميذ',
    icon: PersonIcon,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  parent: {
    label: 'فضاء الوليّ',
    icon: FamilyRestroomIcon,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
};

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose, userType }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // Form fields
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [identifier, setIdentifier] = React.useState('');
  const [birthDate, setBirthDate] = React.useState('');
  const [code, setCode] = React.useState('');

  // Validation errors
  const [usernameError, setUsernameError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [identifierError, setIdentifierError] = React.useState('');
  const [birthDateError, setBirthDateError] = React.useState('');
  const [codeError, setCodeError] = React.useState('');

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setIdentifier('');
    setBirthDate('');
    setCode('');
    setError(null);
    setSuccess(false);
    setUsernameError('');
    setPasswordError('');
    setIdentifierError('');
    setBirthDateError('');
    setCodeError('');
  };

  const validateAdminForm = (): boolean => {
    let isValid = true;

    if (!username.trim()) {
      setUsernameError('اسم المستخدم مطلوب');
      isValid = false;
    } else {
      setUsernameError('');
    }

    if (!password) {
      setPasswordError('كلمة المرور مطلوبة');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const validateTeacherForm = (): boolean => {
    let isValid = true;

    if (!code.trim()) {
      setCodeError('رمز المؤدب مطلوب');
      isValid = false;
    } else {
      setCodeError('');
    }

    if (!password) {
      setPasswordError('كلمة المرور مطلوبة');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const validateStudentForm = (): boolean => {
    let isValid = true;

    if (!identifier.trim()) {
      setIdentifierError('المعرّف مطلوب');
      isValid = false;
    } else {
      setIdentifierError('');
    }

    if (!birthDate) {
      setBirthDateError('تاريخ الميلاد مطلوب');
      isValid = false;
    } else {
      const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
      if (!dateRegex.test(birthDate)) {
        setBirthDateError('الصيغة المطلوبة: MM/DD/YYYY');
        isValid = false;
      } else {
        setBirthDateError('');
      }
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (userType === 'parent') {
      setError('فضاء الوليّ سيكون متاحًا قريبًا');
      return;
    }

    let isValid = false;
    if (userType === 'admin') {
      isValid = validateAdminForm();
    } else if (userType === 'teacher') {
      isValid = validateTeacherForm();
    } else if (userType === 'student') {
      isValid = validateStudentForm();
    }

    if (!isValid) return;

    setLoading(true);

    try {
      let response;

      switch (userType) {
        case 'admin':
          response = await authService.adminLogin({ username, password } as AdminLoginDto);
          break;
        case 'teacher':
          response = await authService.teacherLogin({ code, password } as TeacherLoginDto);
          break;
        case 'student':
          response = await authService.userLogin({ identifier, birthDate } as UserLoginDto);
          break;
        default:
          throw new Error('نوع مستخدم غير صالح');
      }

      if (response.success) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('userType', userType);
        localStorage.setItem('userData', JSON.stringify(response.data));

        setSuccess(true);
        setTimeout(() => {
          handleClose();
          window.location.href = `/${userType}/dashboard`;
        }, 1000);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderAdminFields = () => (
    <>
      <TextField
        autoFocus
        margin="dense"
        label="اسم المستخدم"
        type="text"
        fullWidth
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={!!usernameError}
        helperText={usernameError}
        disabled={loading}
        dir="rtl"
      />
      <TextField
        margin="dense"
        label="كلمة المرور"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!passwordError}
        helperText={passwordError}
        disabled={loading}
        dir="rtl"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="إظهار كلمة المرور"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );

  const renderTeacherFields = () => (
    <>
      <TextField
        autoFocus
        margin="dense"
        label="رمز المؤدب"
        type="text"
        fullWidth
        variant="outlined"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        error={!!codeError}
        helperText={codeError}
        disabled={loading}
        dir="rtl"
      />
      <TextField
        margin="dense"
        label="كلمة المرور"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!passwordError}
        helperText={passwordError}
        disabled={loading}
        dir="rtl"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="إظهار كلمة المرور"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );

  const renderStudentFields = () => (
    <>
      <TextField
        autoFocus
        margin="dense"
        label="المعرّف"
        type="text"
        fullWidth
        variant="outlined"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        error={!!identifierError}
        helperText={identifierError}
        disabled={loading}
        dir="rtl"
      />
      <TextField
        margin="dense"
        label="تاريخ الميلاد (MM/DD/YYYY)"
        type="text"
        fullWidth
        variant="outlined"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        error={!!birthDateError}
        helperText={birthDateError}
        placeholder="01/15/2010"
        disabled={loading}
        dir="ltr"
      />
    </>
  );

  const renderParentFields = () => (
    <Alert severity="info" sx={{ mt: 2 }}>
      فضاء الوليّ سيكون متاحًا قريبًا
    </Alert>
  );

  const config = userTypeConfig[userType];
  const IconComponent = config.icon;

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
      <Box
        sx={{
          background: config.gradient,
          color: 'white',
          p: 4,
          position: 'relative',
          textAlign: 'center',
        }}
      >
        <IconButton
          aria-label="إغلاق"
          onClick={handleClose}
          disabled={loading}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <Box
          sx={{
            width: 100,
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            mb: 2,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          <IconComponent sx={{ fontSize: '3.5rem' }} />
        </Box>
        
        <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
          {config.label}
        </Typography>
      </Box>

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
          {userType === 'admin' && renderAdminFields()}
          {userType === 'teacher' && renderTeacherFields()}
          {userType === 'student' && renderStudentFields()}
          {userType === 'parent' && renderParentFields()}

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
