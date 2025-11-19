import type { FormState, FormErrors } from '../types';

export const validateAdminForm = (formState: FormState): FormErrors => {
  const errors: FormErrors = {
    username: '',
    password: '',
    code: '',
    identifier: '',
    birthDate: '',
  };

  if (!formState.username.trim()) {
    errors.username = 'اسم المستخدم مطلوب';
  }

  if (!formState.password) {
    errors.password = 'كلمة المرور مطلوبة';
  } else if (formState.password.length < 6) {
    errors.password = 'كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل';
  }

  return errors;
};

export const validateTeacherForm = (formState: FormState): FormErrors => {
  const errors: FormErrors = {
    username: '',
    password: '',
    code: '',
    identifier: '',
    birthDate: '',
  };

  if (!formState.code.trim()) {
    errors.code = 'رمز المؤدب مطلوب';
  }

  if (!formState.password) {
    errors.password = 'كلمة المرور مطلوبة';
  } else if (formState.password.length < 6) {
    errors.password = 'كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل';
  }

  return errors;
};

export const validateStudentForm = (formState: FormState): FormErrors => {
  const errors: FormErrors = {
    username: '',
    password: '',
    code: '',
    identifier: '',
    birthDate: '',
  };

  if (!formState.identifier.trim()) {
    errors.identifier = 'المعرّف مطلوب';
  }

  if (!formState.birthDate) {
    errors.birthDate = 'تاريخ الميلاد مطلوب';
  } else {
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!dateRegex.test(formState.birthDate)) {
      errors.birthDate = 'الصيغة المطلوبة: MM/DD/YYYY';
    }
  }

  return errors;
};

export const hasValidationErrors = (errors: FormErrors): boolean => {
  return Object.values(errors).some(error => error !== '');
};