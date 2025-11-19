import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MuiToolbar from '@mui/material/Toolbar';
import { tabsClasses } from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SideMenuMobile from './SideMenuMobile';
import OptionsMenu from './OptionsMenu';

const Toolbar = styled(MuiToolbar)({
  width: '100%',
  padding: '12px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  borderRadius: `calc(8px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'rgba(255, 255, 255, 0.4)',
  boxShadow: `0 1px 2px hsla(210, 0%, 0%, 0.05), 0 2px 12px hsla(210, 100%, 80%, 0.5)`,
  [`& .${tabsClasses.flexContainer}`]: {
    gap: '8px',
    p: '8px',
    pb: 0,
  },
});

export default function Header() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Toolbar variant="regular">
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flexGrow: 1,
            width: '100%',
            gap: 1,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: 'center', mr: 'auto' }}
          >
            <MenuRoundedIcon
              onClick={toggleDrawer(true)}
              sx={{ display: { xs: 'inline', md: 'none' } }}
            />
            <Typography variant="h6" component="h1" sx={{ color: 'text.primary' }}>
              الجمعية القرآنية بمسكن
            </Typography>
          </Stack>
        </Stack>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <OptionsMenu />
        </Box>
      </Toolbar>
      <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />
    </AppBar>
  );
}
