import React, {useCallback, useRef} from 'react';
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
  const suggestionTimeoutRef = useRef<NodeJS.Timeout>();

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
    <View style={styles.container}>
      <TextInput
        {...props}
        value={formInput[field] as string}
        onChangeText={(text: string) => setFormInput(field, text)}
        right={renderRight()}
        outlineStyle={styles.textInput}
        error={!!errorMessage}
        contentStyle={{
          minHeight: props.multiline ? 100 : undefined,
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
                <Text>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
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
    marginTop: -12,
    marginBottom: 6,
    paddingBottom: 0,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    zIndex: 1000,
    elevation: 5,
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
});
