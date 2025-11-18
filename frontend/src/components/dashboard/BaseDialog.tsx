import type { ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

interface BaseDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function BaseDialog({
  open,
  onClose,
  title,
  onSubmit,
  children,
  submitLabel = 'حفظ',
  cancelLabel = 'إلغاء',
  maxWidth = 'md',
}: BaseDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle dir="rtl">{title}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{cancelLabel}</Button>
          <Button type="submit" variant="contained">
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
