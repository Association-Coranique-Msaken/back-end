import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import adminService from '../../../api/services/adminService';
import type { Teacher, UpdateTeacherDto } from '../../../api/types';
import BaseDialog from '../BaseDialog';
import { dialogFormGridStyles } from '../../../styles/dashboardStyles';

interface TeacherDialogProps {
  open: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  onSuccess: () => void;
}

export default function TeacherDialog({ open, onClose, teacher, onSuccess }: TeacherDialogProps) {
  const [formData, setFormData] = useState<UpdateTeacherDto>({
    kotebName: '',
    bonus: '',
    teacherType: '',
    isActive: true,
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        kotebName: teacher.kotebName || '',
        bonus: teacher.bonus || '',
        teacherType: teacher.teacherType || '',
        isActive: teacher.isActive,
      });
    } else {
      // Reset form for create
      setFormData({
        kotebName: '',
        bonus: '',
        teacherType: '',
        isActive: true,
      });
    }
  }, [teacher]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (teacher) {
        await adminService.updateTeacher(teacher.id, formData);
      } else {
        // For create, we need to handle it differently since CreateTeacherDto requires userId
        // For now, we'll just update
        console.log('Create teacher not fully implemented yet');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save teacher:', error);
    }
  };

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={teacher ? 'تعديل المؤدب' : 'إضافة مؤدب جديد'}
      onSubmit={handleSubmit}
      submitLabel={teacher ? 'حفظ' : 'إضافة'}
    >
      <Box sx={dialogFormGridStyles}>
            <TextField
              name="kotebName"
              label="اسم الكتب"
              value={formData.kotebName || ''}
              onChange={handleChange}
              fullWidth
              dir="rtl"
            />
            <TextField
              name="bonus"
              label="المكافأة"
              value={formData.bonus || ''}
              onChange={handleChange}
              fullWidth
              dir="rtl"
            />
            <TextField
              name="teacherType"
              label="نوع المؤدب"
              value={formData.teacherType || ''}
              onChange={handleChange}
              fullWidth
              dir="rtl"
            />
            <TextField
              select
              name="isActive"
              label="الحالة"
              value={formData.isActive ? 'active' : 'inactive'}
              onChange={(e) => setFormData({
                ...formData,
                isActive: e.target.value === 'active'
              })}
              fullWidth
              dir="rtl"
            >
              <MenuItem value="active">نشط</MenuItem>
              <MenuItem value="inactive">غير نشط</MenuItem>
            </TextField>
          </Box>
        </BaseDialog>
      );
    }
