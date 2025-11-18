import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import type { UserType, UserTypeConfig } from './types';

export const userTypeConfig: Record<UserType, UserTypeConfig> = {
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