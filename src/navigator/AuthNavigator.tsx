import { View, Text } from 'react-native'
import React from 'react'
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

/* I make a react native application wghere i want to add the authentication for user login i have api and i ahve two screen first is email screen thensecnond is password screen and
I have two user one is selller and one is buyer if user login with seller aacount then redirect to seller dashboard if user login with buyer account then redirect to buyer dashboard
i want to authenticate with first check mail is valid or not if valid then go to password screen itherwise show error if mail is not valid i make a file in navifgator folder
AuthNavigator.tsx and in context folder make two file AuthContext.ts and AuthProvider.tsx  sand in one file url.tsx where i have writeen all the api link so please help me to add jwt authenticate ser and buyer for this and which file code you want il provide to you 
*/