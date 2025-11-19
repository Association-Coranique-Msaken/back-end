import * as React from 'react';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { UserTypeConfig } from '../auth/types';

interface DialogHeaderProps {
  config: UserTypeConfig;
  onClose: () => void;
  loading: boolean;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  config,
  onClose,
  loading,
}) => {
  const IconComponent = config.icon;

  return (
    <Box
      sx={{
        background: config.gradient,
        color: 'white',
        p: 4,
        position: 'relative',
        textAlign: 'center',
      }}
    >
      <IconButton
        aria-label="إغلاق"
        onClick={onClose}
        disabled={loading}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'white',
        }}
      >
        <CloseIcon />
      </IconButton>
      
      <Box
        sx={{
          width: 100,
          height: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          mb: 2,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        }}
      >
        <IconComponent sx={{ fontSize: '3.5rem' }} />
      </Box>
      
      <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
        {config.label}
      </Typography>
    </Box>
  );
};