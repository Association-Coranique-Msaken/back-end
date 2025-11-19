import * as React from 'react';
import { Alert } from '@mui/material';

export const ParentForm: React.FC = () => {
  return (
    <Alert severity="info" sx={{ mt: 2 }}>
      فضاء الوليّ سيكون متاحًا قريبًا
    </Alert>
  );
};