import './src/utils/gesture-handler.native';
import React from 'react';
import RootNavigator from './src/navigator/RootNavigator';
import {AuthProvider} from './src/context/AuthProvider';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {PropertyFormProvider} from './src/context/PropertyFormContext';
import {PaperProvider} from 'react-native-paper';
import {DialogProvider} from './src/context/DialogProvider';
import {MasterProvider} from './src/context/MasterProvider';

const App = () => {
  return (
    <PaperProvider>
      <DialogProvider>
        <MasterProvider>
          <AuthProvider>
            <PropertyFormProvider>
              <SafeAreaProvider>
                <RootNavigator />
                <Toast />
              </SafeAreaProvider>
            </PropertyFormProvider>
          </AuthProvider>
        </MasterProvider>
      </DialogProvider>
    </PaperProvider>
  );
};

export default App;
