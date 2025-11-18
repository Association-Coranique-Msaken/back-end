import * as React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import LoginDialog from '../../components/auth/LoginDialog';
import type { UserType } from '../../components/auth/LoginDialog';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'all 0.3s ease-in-out',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 120,
  height: 120,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  '& svg': {
    fontSize: '4rem',
    color: theme.palette.common.white,
  },
}));

const userSpaces = [
  {
    type: 'admin' as UserType,
    title: 'فضاء الإدارة',
    description: 'تسجيل الدخول للإدارة',
    icon: AdminPanelSettingsIcon,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    type: 'teacher' as UserType,
    title: 'فضاء المؤدب',
    description: 'تسجيل الدخول للمؤدبين',
    icon: SchoolIcon,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    type: 'student' as UserType,
    title: 'فضاء التلميذ',
    description: 'تسجيل الدخول للتلاميذ',
    icon: PersonIcon,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    type: 'parent' as UserType,
    title: 'فضاء الوليّ',
    description: 'تسجيل الدخول لأولياء الأمور',
    icon: FamilyRestroomIcon,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
];

const LoginSection: React.FC = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedUserType, setSelectedUserType] = React.useState<UserType>('admin');

  const handleCardClick = (userType: UserType) => {
    setSelectedUserType(userType);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Box
      id="login-section"
      sx={{
        py: { xs: 4, sm: 8, md: 12 },
        bgcolor: 'background.default',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: { xs: 4, sm: 6 }, textAlign: 'center' }}>
          <Typography
            component="h2"
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 2,
              background: (theme) =>
                `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            تسجيل الدخول
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            اختر الفضاء المناسب لك للدخول إلى النظام
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 4,
          }}
        >
          {userSpaces.map((space) => {
            const IconComponent = space.icon;
            return (
              <Box key={space.type}>
                <StyledCard elevation={2}>
                  <CardActionArea
                    onClick={() => handleCardClick(space.type)}
                    sx={{ height: '100%', p: 3 }}
                  >
                    <CardContent
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        height: '100%',
                      }}
                    >
                      <IconWrapper sx={{ background: space.gradient }}>
                        <IconComponent />
                      </IconWrapper>
                      
                      <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        sx={{ fontWeight: 600, mb: 1 }}
                      >
                        {space.title}
                      </Typography>
                      
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ flexGrow: 1 }}
                      >
                        {space.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </StyledCard>
              </Box>
            );
          })}
        </Box>
      </Container>

      <LoginDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        userType={selectedUserType}
      />
    </Box>
  );
};

export default LoginSection;
