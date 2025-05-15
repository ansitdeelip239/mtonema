import React, { useCallback, useRef, useState } from 'react';
import {
  TextInput,
  TextInputProps,
  HelperText,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
  ScrollView,
  Keyboard,
  Platform,
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
  const inputRef = useRef<View>(null);
  const [isFocused, setIsFocused] = useState(false); // Add focus state

  const CrossButton = useCallback(() => {
    return (
      <TouchableOpacity
        onPress={() => setFormInput(field, '')}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Image
          source={require('../assets/Icon/crossicon.png')}
          style={styles.crossIcon}
        />
      </TouchableOpacity>
    );
  }, [field, setFormInput]);

  const getStringValue = (): string => {
    const value = formInput[field];
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  };

  const renderRight = () => {
    if (loading) {
      return <TextInput.Icon icon={() => <ActivityIndicator size={20} />} />;
    }
    if (rightComponent) {
      return <TextInput.Affix text={rightComponent as string} />;
    }
    if (formInput[field]) {
      return <TextInput.Icon icon={() => <CrossButton />} />;
    }
    return null;
  };

  const handleSuggestionPress = useCallback(
    (suggestion: string) => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
      Keyboard.dismiss();
      suggestionTimeoutRef.current = setTimeout(() => {
        if (onSuggestionSelect) {
          onSuggestionSelect(suggestion);
        }
      }, 50);
    },
    [onSuggestionSelect],
  );

  // Determine if suggestions should be shown
  const showSuggestions = isFocused && suggestions && suggestions.length > 0;

  // Dynamically adjust outerContainer style
  const outerContainerStyle = [
    styles.outerContainer,
    {
      zIndex: showSuggestions ? 1000 : 100,
      elevation: Platform.OS === 'android' ? (showSuggestions ? 1000 : 100) : undefined,
    },
  ];

  return (
    <View style={outerContainerStyle}>
      <View style={styles.container} ref={inputRef}>
        <TextInput
          {...props}
          value={getStringValue()}
          onChangeText={(text: string) => setFormInput(field, text)}
          right={renderRight()}
          outlineStyle={styles.textInput}
          error={!!errorMessage}
          onFocus={() => setIsFocused(true)} // Set focus state
          onBlur={() => setIsFocused(false)} // Reset focus state
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

        {/* Render suggestions only when focused and suggestions exist */}
        {showSuggestions && (
          <View style={styles.suggestionsContainer}>
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
        )}
      </View>
    </View>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  outerContainer: {
    zIndex: 100,
    elevation: Platform.OS === 'android' ? 100 : undefined,
  },
  container: {
    position: 'relative',
    zIndex: 100,
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
    fontSize: 12,
  },
  suggestionsContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    zIndex: 1000,
    elevation: Platform.OS === 'android' ? 1000 : undefined,
    maxHeight: 200,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    left: 0,
    right: 0,
    top: '100%',
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