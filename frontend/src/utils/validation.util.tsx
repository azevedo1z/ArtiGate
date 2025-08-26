export const ValidationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  password: {
    pattern:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message:
      'Password must contain at least 8 characters with uppercase, lowercase, number and special character',
  },
  phone: {
    pattern: /^\(\d{2}\) \d{4,5}-\d{4}$/,
    message: 'Phone must be in format (XX) XXXXX-XXXX',
  },
  zipCode: {
    pattern: /^\d{5}-?\d{3}$/,
    message: 'ZIP code must be in format XXXXX-XXX',
  },
  name: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
    message: 'Name must contain only letters and spaces (2-100 characters)',
  },
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>"'&]/g, '')
    .trim()
    .substring(0, 1000);
};

export const validateField = (
  value: string,
  fieldName: keyof typeof ValidationRules
): { isValid: boolean; message?: string } => {
  const rule = ValidationRules[fieldName];

  if (!value || value.trim() === '')
    return { isValid: false, message: `${fieldName} is required` };

  const sanitizedInput = sanitizeInput(value);

  if ('pattern' in rule && !rule.pattern.test(sanitizedInput))
    return { isValid: false, message: rule.message };

  if ('minLength' in rule && sanitizedInput.length < rule.minLength)
    return {
      isValid: false,
      message: `${fieldName} must be at least ${rule.minLength} characters`,
    };

  if ('maxLength' in rule && sanitizedInput.length > rule.maxLength)
    return {
      isValid: false,
      message: `${fieldName} must be no more than ${rule.maxLength} characters`,
    };

  return { isValid: true };
};

export const validateForm = (
  formData: Record<string, string>,
  fields: (keyof typeof ValidationRules)[]
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  fields.forEach((field) => {
    const result = validateField(formData[field] || '', field);
    if (!result.isValid && result.message) {
      errors[field] = result.message;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
