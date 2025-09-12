import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import MainNavigator from './MainNavigator';
import {navigationRef} from './components/NavigationRef';
import AuthNavigator from './AuthNavigator';
import {useLanguage} from '../context/LanguageProvider';
import {View, ActivityIndicator, StyleSheet, Image, Platform} from 'react-native';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import LanguageSelectionScreen from '../screens/language/LanguageSelectionScreen';
import LanguageDebugger from '../components/LanguageDebugger';
import {BottomTabProvider} from '../context/BottomTabProvider';
import SubscriptionProvider from '../context/SubscriptionProvider';
import { useAuth } from '../context/AuthProvider';
import {SafeAreaView} from 'react-native-safe-area-context';

const RootStack = createNativeStackNavigator();

// Wrapper component for MainNavigator with providers
const MainNavigatorWithProviders = () => (
  <SubscriptionProvider>
    <BottomTabProvider>
      <MainNavigator />
    </BottomTabProvider>
  </SubscriptionProvider>
);

export default function RootNavigator() {
  const {isAuthenticated, isLoading: isAuthLoading} = useAuth();
  const {isLanguageSet, isLoading: isLanguageLoading} = useLanguage();

  const isLoading = isAuthLoading || isLanguageLoading;

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

  // Show language selection if language is not set
  if (!isLanguageSet) {
    return <LanguageSelectionScreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={Platform.OS === 'ios' ? [] : ['bottom']}>
      <NavigationContainer 
        ref={navigationRef}
        onReady={() => {
          // Reset navigation state when switching between auth states on iOS
          if (Platform.OS === 'ios' && navigationRef.current) {
            const InteractionManager = require('react-native').InteractionManager;
            InteractionManager.runAfterInteractions(() => {
              // Small delay to ensure UI is ready
              setTimeout(() => {
                console.log('Navigation ready for', isAuthenticated ? 'authenticated' : 'unauthenticated', 'user');
              }, 100);
            });
          }
        }}
      >
        <LanguageDebugger />
        <RootStack.Navigator screenOptions={{headerShown: false}}>
          {isAuthenticated ? (
            <RootStack.Screen name="Main" component={MainNavigatorWithProviders} />
          ) : (
            <RootStack.Screen name="Auth" component={AuthNavigator} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
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
