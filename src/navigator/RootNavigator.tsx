import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import MainNavigator from './MainNavigator';
import {navigationRef} from './NavigationRef';
import AuthNavigator from './AuthNavigator';
import {useAuth} from '../hooks/useAuth';
import {View, ActivityIndicator, StyleSheet, Image} from 'react-native';
import Colors from '../constants/Colors';
import Images from '../constants/Images';

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
  const {isAuthenticated, isLoading} = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Image
          source={Images.MTESTATES_LOGO}
          style={styles.image}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color={Colors.MT_PRIMARY_1} />
      </View>
    );
  }

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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});
