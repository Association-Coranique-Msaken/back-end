import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import SideMenu from './SideMenu';
import { dashboardMainContentStyles, dashboardContentWrapperStyles } from '../../styles/dashboardStyles';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
  },
});

export default function DashboardLayout() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <Box component="main" sx={dashboardMainContentStyles}>
          <Header />
          <Box sx={dashboardContentWrapperStyles}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
