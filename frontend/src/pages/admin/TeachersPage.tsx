import type { Teacher } from '../../api/types';
import adminService from '../../api/services/adminService';
import { useCrudPage } from '../../hooks/useCrudPage';
import CrudPageLayout from '../../components/dashboard/CrudPageLayout';
import TeacherDialog from '../../components/dashboard/dialogs/TeacherDialog';

export default function TeachersPage() {
  const {
    items: teachers,
    loading,
    openDialog,
    selectedItem: selectedTeacher,
    error,
    handleCreate,
    handleEdit,
    handleDelete,
    handleCloseDialog,
    handleSuccess,
  } = useCrudPage<Teacher>({
    getAll: adminService.getTeachers.bind(adminService),
    delete: adminService.deleteTeacher.bind(adminService),
  });

  const columns = [
    { field: 'code', headerName: 'الكود', width: 100 },
    { field: 'kotebName', headerName: 'اسم الكتب', width: 150 },
    { field: 'bonus', headerName: 'المكافأة', width: 100 },
    { field: 'teacherType', headerName: 'نوع المؤدب', width: 150 },
    { 
      field: 'isActive', 
      headerName: 'الحالة', 
      width: 100,
      renderCell: (params: any) => params.value ? 'نشط' : 'غير نشط'
    },
  ];

  return (
    <CrudPageLayout
      title="المؤدبون"
      buttonLabel="إضافة مؤدب"
      rows={teachers}
      columns={columns}
      loading={loading}
      onAdd={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      error={error}
      dialog={
        <TeacherDialog
          open={openDialog}
          onClose={handleCloseDialog}
          teacher={selectedTeacher}
          onSuccess={handleSuccess}
        />
      }
    />
  );
}
