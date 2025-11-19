import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import adminService from '../../../api/services/adminService';
import type { Group, UpdateGroupDto } from '../../../api/types';
import BaseDialog from '../BaseDialog';
import { dialogFormGridStyles } from '../../../styles/dashboardStyles';

interface GroupDialogProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
  onSuccess: () => void;
}

export default function GroupDialog({ open, onClose, group, onSuccess }: GroupDialogProps) {
  const [formData, setFormData] = useState<UpdateGroupDto>({
    code: '',
    days: '',
    timeRange: '',
    roomNumber: 0,
    levelOrNumHizbs: '',
    courseType: 'theoretical',
    maxStudents: undefined,
  });

  useEffect(() => {
    if (group) {
      setFormData({
        code: group.code,
        days: group.days,
        timeRange: group.timeRange,
        roomNumber: group.roomNumber,
        levelOrNumHizbs: group.levelOrNumHizbs,
        courseType: group.courseType,
        maxStudents: group.maxStudents,
      });
    } else {
      // Reset form for create
      setFormData({
        code: '',
        days: '',
        timeRange: '',
        roomNumber: 0,
        levelOrNumHizbs: '',
        courseType: 'theoretical',
        maxStudents: undefined,
      });
    }
  }, [group]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'roomNumber' || name === 'maxStudents' ? parseInt(value) || undefined : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (group) {
        await adminService.updateGroup(group.id, formData);
      } else {
        console.log('Create group requires teacherId - not fully implemented yet');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save group:', error);
    }
  };

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={group ? 'تعديل المجموعة' : 'إضافة مجموعة جديدة'}
      onSubmit={handleSubmit}
      submitLabel={group ? 'حفظ' : 'إضافة'}
    >
      <Box sx={dialogFormGridStyles}>
            <TextField
              required
              name="code"
              label="الكود"
              value={formData.code || ''}
              onChange={handleChange}
              fullWidth
              dir="rtl"
            />
            <TextField
              required
              name="days"
              label="الأيام"
              value={formData.days || ''}
              onChange={handleChange}
              fullWidth
              dir="rtl"
            />
            <TextField
              required
              name="timeRange"
              label="نطاق الوقت"
              value={formData.timeRange || ''}
              onChange={handleChange}
              fullWidth
              dir="rtl"
            />
            <TextField
              required
              name="roomNumber"
              label="رقم الغرفة"
              type="number"
              value={formData.roomNumber || 0}
              onChange={handleChange}
              fullWidth
              dir="rtl"
            />
            <TextField
              required
              name="levelOrNumHizbs"
              label="المستوى أو عدد الأحزاب"
              value={formData.levelOrNumHizbs || ''}
              onChange={handleChange}
              fullWidth
              dir="rtl"
            />
            <TextField
              required
              select
              name="courseType"
              label="نوع الدورة"
              value={formData.courseType || 'theoretical'}
              onChange={handleChange}
              fullWidth
              dir="rtl"
            >
              <MenuItem value="practical">عملي</MenuItem>
              <MenuItem value="theoretical">نظري</MenuItem>
              <MenuItem value="summerGroup">مجموعة صيفية</MenuItem>
            </TextField>
            <TextField
              name="maxStudents"
              label="العدد الأقصى للطلاب"
              type="number"
              value={formData.maxStudents || ''}
              onChange={handleChange}
              fullWidth
              dir="rtl"
            />
          </Box>
        </BaseDialog>
      );
    }
