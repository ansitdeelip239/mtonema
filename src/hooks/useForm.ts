import {useState, useCallback} from 'react';

interface UseFormOptions<T> {
  initialState: T;
  onSubmit: (formData: T) => Promise<void>;
}

export default function useForm<T>({
  initialState,
  onSubmit,
}: UseFormOptions<T>) {
  const [formInput, setFormInput] = useState<T>(initialState);
  const [loading, setLoading] = useState(false);

  const handleInputChange = useCallback((field: keyof T, value: any) => {
    setFormInput(prevState => ({
      ...prevState,
      [field]: value,
    }));
  }, []);

  const handleSetFormInput = useCallback((newState: Partial<T>) => {
    setFormInput(prevState => ({
      ...prevState,
      ...newState,
    }));
  }, []);

  const handleSelect = useCallback((key: keyof T, value: string) => {
    setFormInput(prev => ({
      ...prev,
      [key]: (prev[key] as string) === value ? '' : value,
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      await onSubmit(formInput);
    } finally {
      setLoading(false);
    }
  }, [formInput, onSubmit]);

  return {
    formInput,
    handleInputChange,
    handleSelect,
    loading,
    onSubmit: handleSubmit,
    setFormInput: handleSetFormInput,
  };
}
