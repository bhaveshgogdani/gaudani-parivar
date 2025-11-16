import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(
    (field: string, value: any): boolean => {
      const rule = rules[field];
      if (!rule) return true;

      // Required check
      if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        setErrors((prev) => ({ ...prev, [field]: 'This field is required' }));
        return false;
      }

      // Skip other validations if field is empty and not required
      if (!value && !rule.required) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
        return true;
      }

      // Min length check
      if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
        setErrors((prev) => ({
          ...prev,
          [field]: `Minimum ${rule.minLength} characters required`,
        }));
        return false;
      }

      // Max length check
      if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
        setErrors((prev) => ({
          ...prev,
          [field]: `Maximum ${rule.maxLength} characters allowed`,
        }));
        return false;
      }

      // Pattern check
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        setErrors((prev) => ({ ...prev, [field]: 'Invalid format' }));
        return false;
      }

      // Custom validation
      if (rule.custom) {
        const result = rule.custom(value);
        if (result !== true) {
          setErrors((prev) => ({
            ...prev,
            [field]: typeof result === 'string' ? result : 'Invalid value',
          }));
          return false;
        }
      }

      // Clear error if validation passes
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    },
    [rules]
  );

  const validateAll = useCallback(
    (values: Record<string, any>): boolean => {
      let isValid = true;
      const newErrors: Record<string, string> = {};

      Object.keys(rules).forEach((field) => {
        const fieldValid = validate(field, values[field]);
        if (!fieldValid) {
          isValid = false;
        }
      });

      return isValid;
    },
    [rules, validate]
  );

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validate,
    validateAll,
    clearError,
    clearAllErrors,
  };
};

