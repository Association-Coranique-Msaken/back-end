import * as React from 'react';
import { FormField } from '../../common/FormField';
import { PasswordField } from '../../common/PasswordField';
import type { FormState, FormErrors } from '../types';

interface AdminFormProps {
  formState: FormState;
  errors: FormErrors;
  disabled: boolean;
  onChange: (field: keyof FormState, value: string) => void;
}

export const AdminForm: React.FC<AdminFormProps> = ({
  formState,
  errors,
  disabled,
  onChange,
}) => {
  return (
    <>
      <FormField
        autoFocus
        label="اسم المستخدم"
        value={formState.username}
        onChange={(value) => onChange('username', value)}
        error={errors.username}
        disabled={disabled}
      />
      <PasswordField
        label="كلمة المرور"
        value={formState.password}
        onChange={(value) => onChange('password', value)}
        error={errors.password}
        disabled={disabled}
      />
    </>
  );
};