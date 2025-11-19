import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Button from '@mui/material/Button';
import MenuContent from './MenuContent';
import TokenManager from '../../utils/tokenManager';
import authService from '../../api/services/authService';
import { useNavigate } from 'react-router-dom';

interface SideMenuMobileProps {
  open: boolean;
  toggleDrawer: (open: boolean) => () => void;
}

export default function SideMenuMobile({ open, toggleDrawer }: SideMenuMobileProps) {
  const navigate = useNavigate();
  const userData = TokenManager.getUserData();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      TokenManager.clearTokens();
      navigate('/');
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box sx={{ width: 240, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sizes="small"
            sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
          >
            {userData?.username?.charAt(0).toUpperCase() || 'A'}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {userData?.username || 'Admin'}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <MenuContent />
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutRoundedIcon />}
            onClick={handleLogout}
          >
            تسجيل الخروج
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
