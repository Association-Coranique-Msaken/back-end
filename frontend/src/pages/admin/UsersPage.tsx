import type { User } from '../../api/types';
import adminService from '../../api/services/adminService';
import { useCrudPage } from '../../hooks/useCrudPage';
import CrudPageLayout from '../../components/dashboard/CrudPageLayout';
import UserDialog from '../../components/dashboard/dialogs/UserDialog';

export default function UsersPage() {
  const {
    items: users,
    loading,
    openDialog,
    selectedItem: selectedUser,
    error,
    handleCreate,
    handleEdit,
    handleDelete,
    handleCloseDialog,
    handleSuccess,
  } = useCrudPage<User>({
    getAll: adminService.getUsers.bind(adminService),
    delete: adminService.deleteUser.bind(adminService),
  });

  const columns = [
    { field: 'identifier', headerName: 'الرقم التعريفي', width: 150 },
    { field: 'firstName', headerName: 'الاسم', width: 150 },
    { field: 'lastName', headerName: 'اللقب', width: 150 },
    { field: 'birthDate', headerName: 'تاريخ الميلاد', width: 150 },
    { field: 'phoneNumber', headerName: 'الهاتف', width: 150 },
    { field: 'gender', headerName: 'الجنس', width: 100 },
  ];

  return (
    <CrudPageLayout
      title="التلاميذ"
      buttonLabel="إضافة تلميذ"
      rows={users}
      columns={columns}
      loading={loading}
      onAdd={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      error={error}
      dialog={
        <UserDialog
          open={openDialog}
          onClose={handleCloseDialog}
          user={selectedUser}
          onSuccess={handleSuccess}
        />
      }
    />
  );
}
