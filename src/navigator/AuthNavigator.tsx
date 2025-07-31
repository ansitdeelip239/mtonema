// import React, {useState} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmailScreen from '../screens/auth/EmailScreen';
import SignUpScreen from '../screens/auth/SignUpScreen2';
import { MainScreen } from '../screens/auth/MainScreen';
import PostProperty from '../screens/seller/PostPropertyScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import PartnerZoneScreen from '../screens/auth/PartnerZoneScreen';
import { MasterDetailModel } from '../types';
import PartnerLoginScreen from '../screens/auth/PartnerLoginScreen';
import { Platform } from 'react-native';
// import UserTypeSelectionScreen from '../screens/auth/UserTypeSelectionScreen';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import storageKeys from '../constants/storageKeys';
// import {ActivityIndicator, StyleSheet, View} from 'react-native';
// import Colors from '../constants/Colors';
// import Roles from '../constants/Roles';
// import OtpModel from '../components/OtpModel';

export type AuthStackParamList = {
  EmailScreen: { role: string[]; location: MasterDetailModel | null };
  PartnerLoginScreen: undefined;
  PartnerZoneScreen: undefined;
  SignUpScreen: { role: string };
  MainScreen: undefined;
  // ChangePasswordScreen: undefined;
  PasswordScreen: { email: string };
  OtpScreen: {
    email: string;
    isForgetPassword?: boolean;
    logoUrl?: string;
    location?: MasterDetailModel;
  };
  PostProperty: undefined;
  OtpModel: { email: string };
  UserTypeSelectionScreen: undefined;
  // ForgetPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  // const [initialRoute, setInitialRoute] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const checkUserType = async () => {
  //     try {
  //       // await AsyncStorage.clear();
  //       const userType = await AsyncStorage.getItem(storageKeys.USER_TYPE_KEY);

  //       console.log('User type from AsyncStorage:', userType);

  //       if (userType === null) {
  //         setInitialRoute('UserTypeSelectionScreen');
  //       } else if (userType === Roles.PARTNER) {
  //         setInitialRoute('PartnerZoneScreen');
  //       } else {
  //         setInitialRoute('MainScreen');
  //       }
  //     } catch (error) {
  //       console.error('Error checking user type:', error);
  //       setInitialRoute('UserTypeSelectionScreen');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   checkUserType();
  // }, []);

  // if (isLoading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color={Colors.MT_PRIMARY_1} />
  //     </View>
  //   );
  // }
  const isIOS = Platform.OS === 'ios';

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: isIOS,
        headerTitleStyle: { color: 'black' },
      }}
      initialRouteName="PartnerLoginScreen"
    >
      {/* <Stack.Screen
      name="UserTypeSelectionScreen"
      component={UserTypeSelectionScreen}
      options={{
        title: isIOS ? 'User Type Selection' : '',
      }}
      /> */}
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{
          title: isIOS ? 'Main' : '',
        }}
      />
      <Stack.Screen
        name="PartnerLoginScreen"
        component={PartnerLoginScreen}
        options={{
          title: isIOS ? 'Login' : '',
        }}
      />
      <Stack.Screen
        name="PartnerZoneScreen"
        component={PartnerZoneScreen}
        options={{
          title: isIOS ? 'Partner Zone' : '',
        }}
      />
      <Stack.Screen
        name="EmailScreen"
        component={EmailScreen}
        options={{
          title: isIOS ? 'Email' : '',
        }}
      />
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{
          title: isIOS ? 'Sign Up' : '',
        }}
      />
      <Stack.Screen
        name="OtpScreen"
        component={OtpScreen}
        options={{
          title: isIOS ? 'OTP' : '',
        }}
      />
      <Stack.Screen
        name="PostProperty"
        component={PostProperty}
        options={{
          title: isIOS ? 'Post Property' : '',
        }}
      />
    </Stack.Navigator>
  );
}

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//   },
// });
