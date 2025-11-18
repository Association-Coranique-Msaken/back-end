import * as React from 'react';
import { FormField } from '../../common/FormField';
import { PasswordField } from '../../common/PasswordField';
import type { FormState, FormErrors } from '../types';

interface TeacherFormProps {
  formState: FormState;
  errors: FormErrors;
  disabled: boolean;
  onChange: (field: keyof FormState, value: string) => void;
}

export const TeacherForm: React.FC<TeacherFormProps> = ({
  formState,
  errors,
  disabled,
  onChange,
}) => {
  return (
    <>
      <FormField
        autoFocus
        label="رمز المؤدب"
        value={formState.code}
        onChange={(value) => onChange('code', value)}
        error={errors.code}
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