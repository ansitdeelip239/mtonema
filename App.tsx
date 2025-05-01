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
        <PropertyFormProvider>
          <MasterProvider>
            <AuthProvider>
              <SafeAreaProvider>
                <RootNavigator />
                <Toast />
              </SafeAreaProvider>
            </AuthProvider>
          </MasterProvider>
        </PropertyFormProvider>
      </DialogProvider>
    </PaperProvider>
  );
};

export default App;
