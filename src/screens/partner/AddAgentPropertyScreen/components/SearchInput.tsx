import React, {useRef, useCallback, useState, useEffect} from 'react';
import MasterService from '../../../../services/MasterService';
import {SearchIntellisenseResponse} from '../../../../types';
import {MaterialTextInput} from '../../../../components/MaterialTextInput';
import {InteractionManager} from 'react-native';
import {ViewStyle} from 'react-native';

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
  onAgentSelect?: (agentName: string, contactNo: string) => void;
  style?: ViewStyle;
}

export const SearchInput = <T,>({
  field,
  formInput,
  handleFieldChange,
  errors,
  searchType,
  label,
  placeholder,
  onAgentSelect,
  style,
}: SearchInputProps<T>) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchData, setSearchData] = useState<SearchIntellisenseResponse[]>(
    [],
  );
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const isSelectingRef = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const searchIntellisense = useCallback(
    async (query: string) => {
      if (query.length > 2 && !isSelectingRef.current) {
        setIsSearching(true);
        try {
          const response = await MasterService.searchIntellisense(
            searchType,
            query,
          );
          if (response.success && response.data && mounted.current) {
            setSearchData(response.data);
            const items = response.data
              .map((item: SearchIntellisenseResponse) =>
                searchType === 'AgentPropertyLocation'
                  ? item.location
                  : item.agentName,
              )
              .filter(
                (item): item is string => item !== null && item !== undefined,
              );

            const uniqueItems = Array.from(new Set(items));
            setSuggestions(uniqueItems);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          if (mounted.current) {
            setSuggestions([]);
          }
        } finally {
          if (mounted.current) {
            setIsSearching(false);
          }
        }
      } else if (mounted.current) {
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

      InteractionManager.runAfterInteractions(() => {
        if (searchType === 'AgentName' && onAgentSelect) {
          const selectedAgent = searchData.find(
            item => item.agentName === suggestion,
          );
          if (selectedAgent?.agentContactNo) {
            onAgentSelect(suggestion, selectedAgent.agentContactNo);
          }
        } else {
          handleFieldChange(field, suggestion);
        }

        setSuggestions([]);
        setShowSuggestions(false);

        // Reset selection flag after interactions complete
        setTimeout(() => {
          if (mounted.current) {
            isSelectingRef.current = false;
          }
        }, 100);
      });
    },
    [field, handleFieldChange, searchType, onAgentSelect, searchData],
  );

  return (
    <MaterialTextInput<T>
      style={style}
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
        InteractionManager.runAfterInteractions(() => {
          if (mounted.current && !isSelectingRef.current) {
            setShowSuggestions(false);
          }
        });
      }}
      onFocus={() => {
        const currentValue = formInput[field] as string;
        if (currentValue && currentValue.length > 2) {
          debouncedSearch(currentValue);
        }
      }}
    />
  );
};

// const styles = StyleSheet.create({
//   textInput: {
//     // marginBottom: 16,
//   },
// });
