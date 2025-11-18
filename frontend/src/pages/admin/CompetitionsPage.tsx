import type { Competition } from '../../api/types';
import adminService from '../../api/services/adminService';
import { useCrudPage } from '../../hooks/useCrudPage';
import CrudPageLayout from '../../components/dashboard/CrudPageLayout';
import CompetitionDialog from '../../components/dashboard/dialogs/CompetitionDialog';

export default function CompetitionsPage() {
  const {
    items: competitions,
    loading,
    openDialog,
    selectedItem: selectedCompetition,
    error,
    handleCreate,
    handleEdit,
    handleDelete,
    handleCloseDialog,
    handleSuccess,
  } = useCrudPage<Competition>({
    getAll: adminService.getCompetitions.bind(adminService),
    delete: adminService.deleteCompetition.bind(adminService),
  });

  const columns = [
    { field: 'edition', headerName: 'الإصدار', width: 150 },
    { 
      field: 'scope', 
      headerName: 'النطاق', 
      width: 150,
      renderCell: (params: any) => {
        const scopeMap: { [key: string]: string } = {
          'Local': 'محلي',
          'Regional': 'إقليمي',
          'National': 'وطني'
        };
        return scopeMap[params.value] || params.value;
      }
    },
    { 
      field: 'isActive', 
      headerName: 'الحالة', 
      width: 100,
      renderCell: (params: any) => params.value ? 'نشطة' : 'غير نشطة'
    },
  ];

  return (
    <CrudPageLayout
      title="المسابقات"
      buttonLabel="إضافة مسابقة"
      rows={competitions}
      columns={columns}
      loading={loading}
      onAdd={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      error={error}
      dialog={
        <CompetitionDialog
          open={openDialog}
          onClose={handleCloseDialog}
          competition={selectedCompetition}
          onSuccess={handleSuccess}
        />
      }
    />
  );
}
