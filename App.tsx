import './src/utils/gesture-handler.native';
import React from 'react';
import RootNavigator from './src/navigator/RootNavigator';
import {AuthProvider} from './src/context/AuthProvider';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {PropertyFormProvider} from './src/context/PropertyFormContext';
import {StatusBar} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {DialogProvider} from './src/context/DialogProvider';

const App = () => {
  return (
    <PaperProvider>
      <DialogProvider>
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
      </DialogProvider>
    </PaperProvider>
  );
};

export default App;
