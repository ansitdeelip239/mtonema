// import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import EmailScreen from '../screens/auth/EmailScreen';
import SignUpScreen from '../screens/auth/SignUpScreen2';
import {MainScreen} from '../screens/auth/MainScreen';
import PostProperty from '../screens/seller/PostPropertyScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import PartnerZoneScreen from '../screens/auth/PartnerZoneScreen';
import {MasterDetailModel} from '../types';
// import UserTypeSelectionScreen from '../screens/auth/UserTypeSelectionScreen';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import storageKeys from '../constants/storageKeys';
// import {ActivityIndicator, StyleSheet, View} from 'react-native';
// import Colors from '../constants/Colors';
// import Roles from '../constants/Roles';
// import OtpModel from '../components/OtpModel';

export type AuthStackParamList = {
  EmailScreen: {role: string[]; location: MasterDetailModel};
  PartnerZoneScreen: undefined;
  SignUpScreen: {role: string};
  MainScreen: undefined;
  // ChangePasswordScreen: undefined;
  PasswordScreen: {email: string};
  OtpScreen: {
    email: string;
    isForgetPassword?: boolean;
    logoUrl?: string;
    location?: MasterDetailModel;
  };
  PostProperty: undefined;
  OtpModel: {email: string};
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
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      // initialRouteName={initialRoute as keyof AuthStackParamList}>
      initialRouteName="PartnerZoneScreen">
      {/* <Stack.Screen
        name="UserTypeSelectionScreen"
        component={UserTypeSelectionScreen}
      /> */}
      <Stack.Screen name="MainScreen" component={MainScreen} />
      <Stack.Screen name="PartnerZoneScreen" component={PartnerZoneScreen} />
      <Stack.Screen name="EmailScreen" component={EmailScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="PostProperty" component={PostProperty} />
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
