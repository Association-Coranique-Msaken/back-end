import type { SxProps, Theme } from '@mui/material/styles';

// Page Layout Styles
export const pageHeaderStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 3,
};

export const pageContainerStyles: SxProps<Theme> = {
  p: 0,
};

// Dialog Styles
export const dialogFormGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
  gap: 2,
};

export const dialogFormFullWidthStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

// DataTable Styles
export const dataTableContainerStyles: SxProps<Theme> = {
  height: 600,
  width: '100%',
};

export const dataTableHeaderStyles: SxProps<Theme> = {
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: 'primary.light',
  },
};

// Dashboard Layout Styles
export const dashboardMainContentStyles: SxProps<Theme> = {
  position: { sm: 'relative', md: '' },
  top: { sm: '48px', md: '0' },
  height: { sm: 'calc(100vh - 48px)', md: '100vh' },
  flexGrow: 1,
  pt: 2,
  backgroundColor: 'rgba(0, 0, 0, 0.02)',
  overflow: 'auto',
};

export const dashboardContentWrapperStyles: SxProps<Theme> = {
  mt: 12,
  px: 3,
};

// Button Styles
export const primaryActionButtonStyles: SxProps<Theme> = {
  fontWeight: 600,
};

// Common RTL Styles
export const rtlTextFieldStyles = {
  dir: 'rtl' as const,
};

// Card Styles
export const cardContainerStyles: SxProps<Theme> = {
  p: 3,
  borderRadius: 2,
  boxShadow: 1,
};

// Form Styles
export const formFieldStyles: SxProps<Theme> = {
  mb: 2,
};
