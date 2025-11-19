import * as React from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LoginDialog from './LoginDialogRefactored';
import type { UserType } from './types';

const LoginMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedUserType, setSelectedUserType] = React.useState<UserType>('admin');
  
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (userType: UserType) => {
    setSelectedUserType(userType);
    setDialogOpen(true);
    handleClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        size="small"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{ minWidth: 120 }}
      >
        تسجيل دخول
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        dir="rtl"
      >
        <MenuItem onClick={() => handleMenuItemClick('admin')}>
          <ListItemIcon>
            <AdminPanelSettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>فضاء الإدارة</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleMenuItemClick('teacher')}>
          <ListItemIcon>
            <SchoolIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>فضاء المؤدب</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => handleMenuItemClick('student')}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>فضاء التلميذ</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleMenuItemClick('parent')}>
          <ListItemIcon>
            <FamilyRestroomIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>فضاء الوليّ</ListItemText>
        </MenuItem>
      </Menu>

      <LoginDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        userType={selectedUserType}
      />
    </>
  );
};

export default LoginMenu;
