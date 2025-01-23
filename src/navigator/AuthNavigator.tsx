import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmailScreen from '../screens/auth/EmailScreen';
import PasswordScreen from '../screens/auth/PasswordScreen';
import ChangePasswordScreen from '../screens/auth/ChangePasswordScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import { MainScreen } from '../screens/auth/MainScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import PostProperty from '../screens/seller/PostPropertyScreen';

export type AuthStackParamList = {
    EmailScreen: {role: string[]};
    SignUpScreen: {role: string};
    MainScreen : undefined;
    ChangePasswordScreen : undefined;
    PasswordScreen :{email: string;};
    OtpScreen :{email:string};
    PostProperty :undefined;

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
          <Stack.Screen name="OtpScreen" component={OtpScreen} />
          <Stack.Screen name="PostProperty" component={PostProperty} />
        </Stack.Navigator>
      );
}
