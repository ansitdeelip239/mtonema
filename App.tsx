
import React from 'react';
import RootNavigator from './src/navigator/RootNavigator';
import { AuthProvider } from './src/context/AuthProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    // <RootNavigator/>
    <AuthProvider>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </AuthProvider>

  );
};


export default App;
