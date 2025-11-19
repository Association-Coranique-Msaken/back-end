import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import LoginSection from './components/LoginSection';

export default function LandingPage(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <AppAppBar />
      <div>
        <LoginSection />
        <Divider />
        <FAQ />
      </div>
      <Footer />
    </AppTheme>
  );
}