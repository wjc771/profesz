
import { useState, useEffect, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

interface ValidationRule {
  field: string;
  validator: (value: any, formValues: any) => string | null;
  debounceMs?: number;
}

interface ValidationState {
  [field: string]: {
    isValid: boolean;
    error: string | null;
    isValidating: boolean;
  };
}

export function useRealTimeValidation(
  form: UseFormReturn<any>,
  rules: ValidationRule[]
) {
  const [validationState, setValidationState] = useState<ValidationState>({});
  const [debounceTimers, setDebounceTimers] = useState<{ [key: string]: NodeJS.Timeout }>({});

  const validateField = useCallback(async (
    fieldName: string,
    value: any,
    rule: ValidationRule
  ) => {
    setValidationState(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        isValidating: true
      }
    }));

    try {
      const formValues = form.getValues();
      const error = await rule.validator(value, formValues);
      
      setValidationState(prev => ({
        ...prev,
        [fieldName]: {
          isValid: !error,
          error,
          isValidating: false
        }
      }));
    } catch (err) {
      setValidationState(prev => ({
        ...prev,
        [fieldName]: {
          isValid: false,
          error: 'Erro na validação',
          isValidating: false
        }
      }));
    }
  }, [form]);

  const debouncedValidate = useCallback((
    fieldName: string,
    value: any,
    rule: ValidationRule
  ) => {
    // Limpar timer anterior se existir
    if (debounceTimers[fieldName]) {
      clearTimeout(debounceTimers[fieldName]);
    }

    const timer = setTimeout(() => {
      validateField(fieldName, value, rule);
    }, rule.debounceMs || 300);

    setDebounceTimers(prev => ({
      ...prev,
      [fieldName]: timer
    }));
  }, [debounceTimers, validateField]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (!name) return;

      const rule = rules.find(r => r.field === name);
      if (!rule) return;

      const fieldValue = value[name];
      debouncedValidate(name, fieldValue, rule);
    });

    return () => {
      subscription.unsubscribe();
      // Limpar todos os timers
      Object.values(debounceTimers).forEach(timer => clearTimeout(timer));
    };
  }, [form, rules, debouncedValidate, debounceTimers]);

  const getFieldValidation = useCallback((fieldName: string) => {
    return validationState[fieldName] || {
      isValid: true,
      error: null,
      isValidating: false
    };
  }, [validationState]);

  const validateAllFields = useCallback(async () => {
    const formValues = form.getValues();
    const promises = rules.map(async (rule) => {
      const value = formValues[rule.field];
      await validateField(rule.field, value, rule);
    });

    await Promise.all(promises);
  }, [form, rules, validateField]);

  const isFormValid = useCallback(() => {
    return Object.values(validationState).every(state => state.isValid);
  }, [validationState]);

  const hasValidationErrors = useCallback(() => {
    return Object.values(validationState).some(state => !state.isValid);
  }, [validationState]);

  return {
    validationState,
    getFieldValidation,
    validateAllFields,
    isFormValid,
    hasValidationErrors
  };
}
