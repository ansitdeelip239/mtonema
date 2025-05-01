import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import EmailScreen from '../screens/auth/EmailScreen';
import SignUpScreen from '../screens/auth/SignUpScreen2';
import {MainScreen} from '../screens/auth/MainScreen';
import PostProperty from '../screens/seller/PostPropertyScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import PartnerZoneScreen from '../screens/auth/PartnerZoneScreen';
import { MasterDetailModel } from '../types';
// import OtpModel from '../components/OtpModel';

export type AuthStackParamList = {
  EmailScreen: {role: string[], location: MasterDetailModel};
  PartnerZoneScreen: {role: string[]};
  SignUpScreen: {role: string};
  MainScreen: undefined;
  // ChangePasswordScreen: undefined;
  PasswordScreen: {email: string};
  OtpScreen: {email: string; isForgetPassword?: boolean, logoUrl?: string};
  PostProperty: undefined;
  OtpModel: {email: string};
  // ForgetPassword: undefined;
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
      <Stack.Screen name="PartnerZoneScreen" component={PartnerZoneScreen} />
      <Stack.Screen name="EmailScreen" component={EmailScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="PostProperty" component={PostProperty} />
      {/* <Stack.Screen name="OtpModel" component={OtpModel}/> */}
    </Stack.Navigator>
  );
}
