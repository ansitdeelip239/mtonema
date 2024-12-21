import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { View, Text } from 'react-native'
import React from 'react'
import MainNavigator from './MainNavigator';
import SellerNavigator from './SellerNavigator';
import { navigationRef } from './NavigationRef';
import AuthNavigator from './AuthNavigator';
import { useAuth } from '../hooks/useAuth';

const RootStack = createNativeStackNavigator();
export default function RootNavigator() {
    const {isAuthenticated}=useAuth()
    return (
      <NavigationContainer ref={navigationRef}>
        <RootStack.Navigator screenOptions={{headerShown: false}}>
          {isAuthenticated ? (
            <RootStack.Screen name="Main" component={MainNavigator} />
          ) : (
            <RootStack.Screen name="Auth" component={AuthNavigator} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    );
}





