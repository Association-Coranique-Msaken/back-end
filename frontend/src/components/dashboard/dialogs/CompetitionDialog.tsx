import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import adminService from '../../../api/services/adminService';
import type { Competition, UpdateCompetitionDto } from '../../../api/types';
import BaseDialog from '../BaseDialog';
import { dialogFormGridStyles } from '../../../styles/dashboardStyles';

interface CompetitionDialogProps {
  open: boolean;
  onClose: () => void;
  competition: Competition | null;
  onSuccess: () => void;
}

export default function CompetitionDialog({ open, onClose, competition, onSuccess }: CompetitionDialogProps) {
  const [formData, setFormData] = useState<UpdateCompetitionDto>({
    edition: '',
    scope: 'Local',
    isActive: true,
  });

  useEffect(() => {
    if (competition) {
      setFormData({
        edition: competition.edition,
        scope: competition.scope,
        isActive: competition.isActive,
      });
    } else {
      // Reset form for create
      setFormData({
        edition: '',
        scope: 'Local',
        isActive: true,
      });
    }
  }, [competition]);

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
      if (competition) {
        await adminService.updateCompetition(competition.id, formData);
      } else {
        console.log('Create competition not fully implemented yet');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save competition:', error);
    }
  };

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={competition ? 'تعديل المسابقة' : 'إضافة مسابقة جديدة'}
      onSubmit={handleSubmit}
      submitLabel={competition ? 'حفظ' : 'إضافة'}
    >
      <Box sx={dialogFormGridStyles}>
            <TextField
              required
              name="edition"
              label="الإصدار"
              value={formData.edition || ''}
              onChange={handleChange}
              fullWidth
              dir="rtl"
            />
            <TextField
              required
              select
              name="scope"
              label="النطاق"
              value={formData.scope || 'Local'}
              onChange={handleChange}
              fullWidth
              dir="rtl"
            >
              <MenuItem value="Local">محلي</MenuItem>
              <MenuItem value="Regional">إقليمي</MenuItem>
              <MenuItem value="National">وطني</MenuItem>
            </TextField>
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
              <MenuItem value="active">نشطة</MenuItem>
              <MenuItem value="inactive">غير نشطة</MenuItem>
            </TextField>
          </Box>
        </BaseDialog>
      );
    }
