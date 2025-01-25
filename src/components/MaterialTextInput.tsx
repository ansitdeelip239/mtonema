import React, {useCallback} from 'react';
import {TextInput, TextInputProps} from 'react-native-paper';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';

interface MaterialTextInputProps<T> extends TextInputProps {
  field: keyof T;
  formInput: T;
  setFormInput: (field: keyof T, value: string | boolean) => void;
}

export const MaterialTextInput = <T,>({
  field,
  formInput,
  setFormInput,
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
    <TextInput
      {...props}
      value={formInput[field] as string}
      onChangeText={(text: string) => setFormInput(field, text)}
      right={
        formInput[field] ? <TextInput.Icon icon={() => CrossButton()} /> : null
      }
      outlineStyle={styles.textInput}
    />
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
});
