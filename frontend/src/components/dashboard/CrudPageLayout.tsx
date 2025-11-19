import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from './DataTable';
import { pageHeaderStyles, pageContainerStyles } from '../../styles/dashboardStyles';

interface CrudPageLayoutProps<T> {
  title: string;
  buttonLabel: string;
  rows: T[];
  columns: GridColDef[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  dialog: ReactNode;
  error?: string | null;
}

export default function CrudPageLayout<T extends { id: string }>({
  title,
  buttonLabel,
  rows,
  columns,
  loading,
  onAdd,
  onEdit,
  onDelete,
  dialog,
  error,
}: CrudPageLayoutProps<T>) {
  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageHeaderStyles}>
        <Typography variant="h4" dir="rtl">
          {title}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
        >
          {buttonLabel}
        </Button>
      </Box>

      {error && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
          <Typography dir="rtl">{error}</Typography>
        </Box>
      )}

      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {dialog}
    </Box>
  );
}
