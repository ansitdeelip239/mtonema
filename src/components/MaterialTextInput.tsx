import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
  TextInput,
  TextInputProps,
  HelperText,
  Text,
  ActivityIndicator,
  Portal, // Import Portal
} from 'react-native-paper';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
  ScrollView,
  Keyboard,
} from 'react-native';

interface MaterialTextInputProps<T> extends TextInputProps {
  field: keyof T;
  formInput: T;
  setFormInput: (field: keyof T, value: string | boolean) => void;
  rightComponent?: React.ReactNode;
  errorMessage?: string;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  loading?: boolean;
}

export const MaterialTextInput = <T,>({
  field,
  formInput,
  setFormInput,
  rightComponent,
  errorMessage,
  suggestions,
  onSuggestionSelect,
  loading,
  ...props
}: MaterialTextInputProps<T>) => {
  const suggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Add state to track input position for portal
  const [inputLayout, setInputLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const inputRef = useRef<View>(null);

  // Measure input position when mounted and when window size changes
  useEffect(() => {
    if (inputRef.current && suggestions && suggestions.length > 0) {
      setTimeout(() => {
        inputRef.current?.measureInWindow((x, y, width, height) => {
          setInputLayout({x, y, width, height});
        });
      }, 100);
    }
  }, [suggestions]);

  const CrossButton = useCallback(() => {
    return (
      <TouchableOpacity
        onPress={() => setFormInput(field, '')}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
        <Image
          source={require('../assets/Icon/crossicon.png')}
          style={styles.crossIcon}
        />
      </TouchableOpacity>
    );
  }, [field, setFormInput]);

  // Convert the value to string, handling all data types
  const getStringValue = (): string => {
    const value = formInput[field];
    // Check if the value is null/undefined
    if (value === null || value === undefined) {
      return '';
    }
    // Convert to string (works for numbers, booleans, etc.)
    return String(value);
  };

  const renderRight = () => {
    if (loading) {
      // eslint-disable-next-line react/no-unstable-nested-components
      return <TextInput.Icon icon={() => <ActivityIndicator size={20} />} />;
    }
    if (rightComponent) {
      return <TextInput.Affix text={rightComponent as string} />;
    }
    if (formInput[field]) {
      // eslint-disable-next-line react/no-unstable-nested-components
      return <TextInput.Icon icon={() => <CrossButton />} />;
    }
    return null;
  };

  const handleSuggestionPress = useCallback(
    (suggestion: string) => {
      // Clear any existing timeouts
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }

      // Dismiss keyboard first
      Keyboard.dismiss();

      // Delay the selection slightly to ensure keyboard dismiss completes
      suggestionTimeoutRef.current = setTimeout(() => {
        if (onSuggestionSelect) {
          onSuggestionSelect(suggestion);
        }
      }, 50);
    },
    [onSuggestionSelect],
  );

  return (
    <View style={styles.container} ref={inputRef}>
      <TextInput
        {...props}
        value={getStringValue()}
        onChangeText={(text: string) => setFormInput(field, text)}
        right={renderRight()}
        outlineStyle={styles.textInput}
        error={!!errorMessage}
        // eslint-disable-next-line react-native/no-inline-styles
        contentStyle={{
          minHeight: props.multiline ? 100 : undefined,
          color: 'black',
        }}
        theme={{
          colors: {
            background: 'white',
            placeholder: !errorMessage ? 'black' : '#666666',
            text: 'black',
            primary: errorMessage ? '#FF0000' : 'black',
            outline: errorMessage ? '#FF0000' : 'black',
            onSurfaceVariant: '#555555',
            error: '#FF0000',
            onSurface: 'black',
            surfaceDisabled: 'transparent',
            onSurfaceDisabled: 'rgba(0, 0, 0, 0.6)',
          },
        }}
      />

      {errorMessage && (
        <HelperText
          type="error"
          visible={!!errorMessage}
          style={styles.helperText}>
          {errorMessage}
        </HelperText>
      )}

      {suggestions && suggestions.length > 0 && (
        <Portal>
          <View
            style={[
              styles.suggestionsContainer,
              {
                top: inputLayout.y + 60, // Position below input
                left: inputLayout.x,
                width: inputLayout.width,
              },
            ]}>
            <ScrollView
              style={styles.suggestionsList}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              indicatorStyle="black">
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  activeOpacity={0.7}
                  onPress={() => handleSuggestionPress(suggestion)}>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Portal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  crossIcon: {
    width: 20,
    height: 20,
  },
  textInput: {
    borderRadius: 10,
    borderWidth: 1,
  },
  helperText: {
    marginTop: 4,
    marginBottom: 0,
    paddingBottom: 0,
    color: '#cc0000',
    fontSize: 12, // Add specific font size for better readability
  },
  suggestionsContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    zIndex: 9999, // Much higher z-index
    elevation: 20, // Higher elevation for Android
    maxHeight: 200,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    color: 'black',
  },
});
