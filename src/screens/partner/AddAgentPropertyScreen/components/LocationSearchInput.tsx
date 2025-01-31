import React, {useRef, useCallback, useState, useEffect} from 'react';
import MasterService from '../../../../services/MasterService';
import {SearchIntellisenseResponse} from '../../../../types';
import {MaterialTextInput} from '../../../../components/MaterialTextInput';
import {StyleSheet} from 'react-native';

const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  const debouncedCallback = useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
  return debouncedCallback;
};

interface SearchInputProps<T> {
  field: keyof T;
  formInput: T;
  handleFieldChange: (field: keyof T, value: string) => void;
  errors: Partial<Record<keyof T, string>>;
  searchType: 'AgentPropertyLocation' | 'AgentName';
  label: string;
  placeholder?: string;
}

export const SearchInput = <T,>({
  field,
  formInput,
  handleFieldChange,
  errors,
  searchType,
  label,
  placeholder,
}: SearchInputProps<T>) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const isSelectingRef = useRef(false);

  const searchIntellisense = useCallback(
    async (query: string) => {
      if (query.length > 2 && !isSelectingRef.current) {
        setIsSearching(true);
        try {
          const response = await MasterService.searchIntellisense(
            searchType,
            query,
          );
          if (response.Success && response.data) {
            const locations = response.data
              .map((item: SearchIntellisenseResponse) => item.Location)
              .filter(
                (location): location is string =>
                  location !== null && location !== undefined,
              );
            setSuggestions(locations);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error('Error fetching locations:', error);
          setSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    },
    [searchType],
  );

  const debouncedSearch = useDebounce(searchIntellisense, 300);

  const handleInputChange = useCallback(
    (value: string) => {
      if (!isSelectingRef.current) {
        handleFieldChange(field, value);
        debouncedSearch(value);
      }
    },
    [field, handleFieldChange, debouncedSearch],
  );

  const handleSuggestionSelect = useCallback(
    (suggestion: string) => {
      isSelectingRef.current = true;
      handleFieldChange(field, suggestion);
      setSuggestions([]);
      setShowSuggestions(false);
      setTimeout(() => {
        isSelectingRef.current = false;
      }, 100);
    },
    [field, handleFieldChange],
  );

  useEffect(() => {
    return () => {
      setSuggestions([]);
      setShowSuggestions(false);
    };
  }, []);

  return (
    <MaterialTextInput<T>
      style={styles.textInput}
      label={label}
      field={field}
      formInput={formInput}
      setFormInput={(_, value) => handleInputChange(value as string)}
      mode="outlined"
      placeholder={placeholder}
      errorMessage={errors[field]}
      suggestions={showSuggestions ? suggestions : []}
      loading={isSearching}
      onSuggestionSelect={handleSuggestionSelect}
      onBlur={() => {
        setTimeout(() => {
          setShowSuggestions(false);
        }, 200);
      }}
      onFocus={() => {
        if (formInput[field] && suggestions.length > 0) {
          setShowSuggestions(true);
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    marginBottom: 16,
  },
});
