import * as React from 'react';
import { FormField } from '../../common/FormField';
import type { FormState, FormErrors } from '../types';

interface StudentFormProps {
  formState: FormState;
  errors: FormErrors;
  disabled: boolean;
  onChange: (field: keyof FormState, value: string) => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  formState,
  errors,
  disabled,
  onChange,
}) => {
  return (
    <>
      <FormField
        autoFocus
        label="المعرّف"
        value={formState.identifier}
        onChange={(value) => onChange('identifier', value)}
        error={errors.identifier}
        disabled={disabled}
      />
      <FormField
        label="تاريخ الميلاد (MM/DD/YYYY)"
        value={formState.birthDate}
        onChange={(value) => onChange('birthDate', value)}
        error={errors.birthDate}
        placeholder="01/15/2010"
        disabled={disabled}
        dir="ltr"
      />
    </>
  );
};