import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import adminService from '../../../api/services/adminService';
import type { User, CreateUserDto } from '../../../api/types';
import BaseDialog from '../BaseDialog';
import { dialogFormGridStyles } from '../../../styles/dashboardStyles';

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: () => void;
}

export default function UserDialog({ open, onClose, user, onSuccess }: UserDialogProps) {
  const [formData, setFormData] = useState<CreateUserDto>({
    identifier: '',
    firstName: '',
    lastName: '',
    fatherFirstName: '',
    motherFirstName: '',
    motherLastName: '',
    birthDate: '',
    birthPlace: '',
    gender: 'male',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        identifier: user.identifier,
        firstName: user.firstName,
        lastName: user.lastName,
        fatherFirstName: user.fatherFirstName,
        motherFirstName: user.motherFirstName,
        motherLastName: user.motherLastName,
        birthDate: user.birthDate,
        birthPlace: user.birthPlace,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
        fatherPhoneNumber: user.fatherPhoneNumber,
        motherPhoneNumber: user.motherPhoneNumber,
      });
    } else {
      // Reset form for create
      setFormData({
        identifier: '',
        firstName: '',
        lastName: '',
        fatherFirstName: '',
        motherFirstName: '',
        motherLastName: '',
        birthDate: '',
        birthPlace: '',
        gender: 'male',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user) {
        await adminService.updateUser(user.id, formData);
      } else {
        await adminService.createUser(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={user ? 'تعديل تلميذ' : 'إضافة تلميذ جديد'}
      onSubmit={handleSubmit}
      submitLabel={user ? 'حفظ' : 'إضافة'}
    >
      <Box sx={dialogFormGridStyles}>
        <TextField
          required
          name="identifier"
          label="الرقم التعريفي"
          value={formData.identifier}
          onChange={handleChange}
          fullWidth
          dir="rtl"
        />
        <TextField
          required
          name="firstName"
          label="الاسم"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
          dir="rtl"
        />
        <TextField
          required
          name="lastName"
          label="اللقب"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          dir="rtl"
        />
        <TextField
          required
          name="fatherFirstName"
          label="اسم الأب"
          value={formData.fatherFirstName}
          onChange={handleChange}
          fullWidth
          dir="rtl"
        />
        <TextField
          required
          name="motherFirstName"
          label="اسم الأم"
          value={formData.motherFirstName}
          onChange={handleChange}
          fullWidth
          dir="rtl"
        />
        <TextField
          required
          name="motherLastName"
          label="لقب الأم"
          value={formData.motherLastName}
          onChange={handleChange}
          fullWidth
          dir="rtl"
        />
        <TextField
          required
          name="birthDate"
          label="تاريخ الميلاد"
          type="date"
          value={formData.birthDate}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          dir="rtl"
        />
        <TextField
          required
          name="birthPlace"
          label="مكان الميلاد"
          value={formData.birthPlace}
          onChange={handleChange}
          fullWidth
          dir="rtl"
        />
        <TextField
          required
          select
          name="gender"
          label="الجنس"
          value={formData.gender}
          onChange={handleChange}
          fullWidth
          dir="rtl"
        >
          <MenuItem value="male">ذكر</MenuItem>
          <MenuItem value="female">أنثى</MenuItem>
        </TextField>
        <TextField
          name="phoneNumber"
          label="رقم الهاتف"
          value={formData.phoneNumber || ''}
          onChange={handleChange}
          fullWidth
          dir="rtl"
        />
      </Box>
    </BaseDialog>
  );
}
