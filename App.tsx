import './src/utils/gesture-handler.native';
import React from 'react';
import RootNavigator from './src/navigator/RootNavigator';
import {AuthProvider} from './src/context/AuthProvider';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {PropertyFormProvider} from './src/context/PropertyFormContext';
import {StatusBar} from 'react-native';
import {PaperProvider} from 'react-native-paper';

const App = () => {
  return (
    <PaperProvider>
      <PropertyFormProvider>
        <AuthProvider>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="hotpink"
            animated
            showHideTransition="fade"
          />
          <SafeAreaProvider>
            <RootNavigator />
            <Toast />
          </SafeAreaProvider>
        </AuthProvider>
      </PropertyFormProvider>
    </PaperProvider>
  );
};

export default App;
