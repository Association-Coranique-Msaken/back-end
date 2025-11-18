import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import { arSD } from '@mui/x-data-grid/locales';
import { dataTableContainerStyles, dataTableHeaderStyles } from '../../styles/dashboardStyles';

interface DataTableProps {
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (id: string) => void;
}

export default function DataTable({ 
  rows, 
  columns, 
  loading = false,
  onEdit,
  onDelete,
}: DataTableProps) {
  const actionColumn: GridColDef = {
    field: 'actions',
    type: 'actions',
    headerName: 'الإجراءات',
    width: 100,
    getActions: (params) => [
      <GridActionsCellItem
        icon={<EditIcon />}
        label="تعديل"
        onClick={() => onEdit?.(params.row)}
      />,
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="حذف"
        onClick={() => {
          if (window.confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
            onDelete?.(params.row.id);
          }
        }}
      />,
    ],
  };

  const allColumns = onEdit || onDelete 
    ? [...columns, actionColumn]
    : columns;

  return (
    <Box sx={dataTableContainerStyles}>
      <DataGrid
        rows={rows}
        columns={allColumns}
        loading={loading}
        localeText={arSD.components.MuiDataGrid.defaultProps.localeText}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 25, 50]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={dataTableHeaderStyles}
      />
    </Box>
  );
}
