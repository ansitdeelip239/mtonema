import './src/utils/gesture-handler.native';
import React from 'react';
import RootNavigator from './src/navigator/RootNavigator';
import {AuthProvider} from './src/context/AuthProvider';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {PaperProvider} from 'react-native-paper';
import {DialogProvider} from './src/context/DialogProvider';
import {MasterProvider} from './src/context/MasterProvider';
import {ThemeProvider} from './src/context/ThemeProvider';

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <ThemeProvider>
          <DialogProvider>
            <MasterProvider>
              <AuthProvider>
                <RootNavigator />
                <Toast />
              </AuthProvider>
            </MasterProvider>
          </DialogProvider>
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
