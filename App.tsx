import './src/utils/gesture-handler.native';
import React, {useEffect} from 'react';
import {I18nManager} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import './src/i18n';
import RootNavigator from './src/navigator/RootNavigator';
import {AuthProvider} from './src/context/AuthProvider';
import {LanguageProvider} from './src/context/LanguageProvider';
import Toast from 'react-native-toast-message';
import {PaperProvider} from 'react-native-paper';
import {DialogProvider} from './src/context/DialogProvider';
import {MasterProvider} from './src/context/MasterProvider';
import {ThemeProvider} from './src/context/ThemeProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  useEffect(() => {
    // ✅ Critical: Verify RTL state on every app start
    const verifyRTLState = async () => {
      try {
        const [savedLanguage, savedRTL] = await Promise.all([
          AsyncStorage.getItem('user_selected_language'),
          AsyncStorage.getItem('user_rtl_preference'),
        ]);

        if (savedLanguage && savedRTL !== null) {
          const shouldBeRTL = savedRTL === 'true';
          const currentRTL = I18nManager.isRTL;

          console.log(
            `App start - Language: ${savedLanguage}, Should be RTL: ${shouldBeRTL}, Current RTL: ${currentRTL}`,
          );

          if (shouldBeRTL !== currentRTL) {
            console.log('RTL state mismatch on app start, correcting...');
            I18nManager.allowRTL(shouldBeRTL);
            I18nManager.forceRTL(shouldBeRTL);

            // ✅ Small delay then restart
            setTimeout(() => {
              console.log('Restarting app to fix RTL state...');
              RNRestart.Restart();
            }, 500);
          }
        }
      } catch (error) {
        console.error('Error verifying RTL state:', error);
      }
    };

    verifyRTLState();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <ThemeProvider>
          <LanguageProvider>
            <DialogProvider>
              <MasterProvider>
                <AuthProvider>
                  <RootNavigator />
                  <Toast />
                </AuthProvider>
              </MasterProvider>
            </DialogProvider>
          </LanguageProvider>
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
