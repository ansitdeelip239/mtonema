import './src/utils/gesture-handler.native';
import React from 'react';
import RootNavigator from './src/navigator/RootNavigator';
import { AuthProvider } from './src/context/AuthProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <RootNavigator />
        <Toast/>
      </SafeAreaProvider>
    </AuthProvider>
  );
};


export default App;
