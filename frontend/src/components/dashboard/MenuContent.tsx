import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import { useNavigate, useLocation } from 'react-router-dom';

const mainListItems = [
  { text: 'الرئيسية', icon: <HomeRoundedIcon />, path: '/admin/dashboard' },
  { text: 'التلاميذ', icon: <PeopleRoundedIcon />, path: '/admin/users' },
  { text: 'المؤدبين', icon: <SchoolRoundedIcon />, path: '/admin/teachers' },
  { text: 'المجموعات', icon: <GroupsRoundedIcon />, path: '/admin/groups' },
  { text: 'المسابقات', icon: <EmojiEventsRoundedIcon />, path: '/admin/competitions' },
  { text: 'المديرين', icon: <AdminPanelSettingsRoundedIcon />, path: '/admin/admins' },
];

export default function MenuContent() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{ direction: 'rtl' }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
