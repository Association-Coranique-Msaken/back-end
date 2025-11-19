import * as React from 'react';
import { TextField } from '@mui/material';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  type?: string;
  placeholder?: string;
  dir?: 'ltr' | 'rtl';
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  error,
  disabled = false,
  autoFocus = false,
  type = 'text',
  placeholder,
  dir = 'rtl',
}) => {
  return (
    <TextField
      autoFocus={autoFocus}
      margin="dense"
      label={label}
      type={type}
      fullWidth
      variant="outlined"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error}
      disabled={disabled}
      placeholder={placeholder}
      dir={dir}
    />
  );
};