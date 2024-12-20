import { View, Text, Button, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigator/AuthNavigator';


type Props = NativeStackScreenProps<AuthStackParamList, 'PasswordScreen'>;

const PasswordScreen :React.FC<Props>=({navigation})=> {
const onContinue =()=>{}
  return (
      <View>
      <Text>Password Screen</Text>
      <TextInput
          style={styles.input}
          placeholder="Enter your E-mail."
          placeholderTextColor="gray"
          keyboardType="email-address"
          autoCapitalize="none"
          />
      <Button onPress={onContinue} title="Continue" />
      <Button onPress={navigation.goBack} title="Back" />
    </View>
  )
}
const styles =StyleSheet.create({
    input: {
        minHeight: 50,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 15,
      },
})

export default PasswordScreen;