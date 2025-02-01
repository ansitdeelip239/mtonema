import './src/utils/gesture-handler.native';
import React from 'react';
import RootNavigator from './src/navigator/RootNavigator';
import { AuthProvider } from './src/context/AuthProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { PropertyFormProvider } from './src/context/PropertyFormContext';

const App = () => {
  return (
    <PropertyFormProvider>
    <AuthProvider>
      <SafeAreaProvider>
        <RootNavigator />
        <Toast/>
      </SafeAreaProvider>
    </AuthProvider>
    </PropertyFormProvider>
  );
};


export default App;
