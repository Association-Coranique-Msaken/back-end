import type { Group } from '../../api/types';
import adminService from '../../api/services/adminService';
import { useCrudPage } from '../../hooks/useCrudPage';
import CrudPageLayout from '../../components/dashboard/CrudPageLayout';
import GroupDialog from '../../components/dashboard/dialogs/GroupDialog';

export default function GroupsPage() {
  const {
    items: groups,
    loading,
    openDialog,
    selectedItem: selectedGroup,
    error,
    handleCreate,
    handleEdit,
    handleDelete,
    handleCloseDialog,
    handleSuccess,
  } = useCrudPage<Group>({
    getAll: adminService.getGroups.bind(adminService),
    delete: adminService.deleteGroup.bind(adminService),
  });

  const columns = [
    { field: 'code', headerName: 'الكود', width: 100 },
    { field: 'days', headerName: 'الأيام', width: 120 },
    { field: 'timeRange', headerName: 'نطاق الوقت', width: 120 },
    { field: 'roomNumber', headerName: 'رقم الغرفة', width: 100 },
    { field: 'levelOrNumHizbs', headerName: 'المستوى', width: 120 },
    { field: 'courseType', headerName: 'نوع الدورة', width: 120 },
    { field: 'maxStudents', headerName: 'العدد الأقصى', width: 100 },
    { field: 'numStudents', headerName: 'عدد الطلاب', width: 100 },
  ];

  return (
    <CrudPageLayout
      title="المجموعات"
      buttonLabel="إضافة مجموعة"
      rows={groups}
      columns={columns}
      loading={loading}
      onAdd={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      error={error}
      dialog={
        <GroupDialog
          open={openDialog}
          onClose={handleCloseDialog}
          group={selectedGroup}
          onSuccess={handleSuccess}
        />
      }
    />
  );
}
