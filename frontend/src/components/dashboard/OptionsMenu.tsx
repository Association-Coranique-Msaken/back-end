import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiMenu, { type MenuProps } from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useNavigate } from 'react-router-dom';
import TokenManager from '../../utils/tokenManager';
import authService from '../../api/services/authService';

const Menu = styled((props: MenuProps) => (
  <MuiMenu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
  },
}));

const MenuItem = styled(MuiMenuItem)(() => ({
  margin: '2px 0',
}));

export default function OptionsMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const userData = TokenManager.getUserData();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
    <React.Fragment>
      <Avatar
        sizes="small"
        sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
      >
        {userData?.username?.charAt(0).toUpperCase() || 'A'}
      </Avatar>
      <IconButton
        aria-label="Options menu"
        onClick={handleClick}
        sx={{ ml: 'auto' }}
      >
        <MoreVertRoundedIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleLogout} dir="rtl">
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>تسجيل الخروج</ListItemText>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
