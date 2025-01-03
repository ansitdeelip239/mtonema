import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmailScreen from '../screens/auth/EmailScreen';
import PasswordScreen from '../screens/auth/PasswordScreen';
import ChangePasswordScreen from '../screens/auth/ChangePasswordScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import { MainScreen } from '../screens/auth/MainScreen';
import ContactScreen from '../screens/auth/ContactScreen';


export type AuthStackParamList = {
    EmailScreen: undefined;
    SignUpScreen: undefined;
    MainScreen : undefined;
    ChangePasswordScreen : undefined;
    PasswordScreen :{email: string;};
    ContactScreen :undefined;

  };

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
    return (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="MainScreen">
          <Stack.Screen name="MainScreen" component={MainScreen} />
          <Stack.Screen name="EmailScreen" component={EmailScreen} />
          <Stack.Screen name="PasswordScreen" component={PasswordScreen} />
          <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="ContactScreen" component={ContactScreen} />
        </Stack.Navigator>
      );
}
