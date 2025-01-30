import React, {useCallback} from 'react';
import {TextInput, TextInputProps, HelperText} from 'react-native-paper';
import {TouchableOpacity, Image, StyleSheet, View} from 'react-native';

interface MaterialTextInputProps<T> extends TextInputProps {
  field: keyof T;
  formInput: T;
  setFormInput: (field: keyof T, value: string | boolean) => void;
  rightComponent?: React.ReactNode;
  errorMessage?: string;
}

export const MaterialTextInput = <T,>({
  field,
  formInput,
  setFormInput,
  rightComponent,
  errorMessage,
  ...props
}: MaterialTextInputProps<T>) => {
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

  return (
    <View>
      <TextInput
        {...props}
        value={formInput[field] as string}
        onChangeText={(text: string) => setFormInput(field, text)}
        right={
          rightComponent ? (
            <TextInput.Affix text={rightComponent as string} />
          ) : formInput[field] ? (
            <TextInput.Icon icon={() => CrossButton()} />
          ) : null
        }
        outlineStyle={styles.textInput}
        error={!!errorMessage}
      />
      {errorMessage && (
        <HelperText type="error" visible={!!errorMessage} style={styles.helperText}>
          {errorMessage}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});
