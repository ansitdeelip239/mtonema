import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {I18nManager} from 'react-native';
import {getCurrentLanguage} from '../i18n';

const LanguageDebugger: React.FC = () => {
  useEffect(() => {
    const debugLanguageState = async () => {
      try {
        const [savedLang, savedRTL, setFlag] = await Promise.all([
          AsyncStorage.getItem('user_selected_language'),
          AsyncStorage.getItem('user_rtl_preference'),
          AsyncStorage.getItem('language_initially_set'),
        ]);

        console.log('=== LANGUAGE DEBUG ===');
        console.log('Current i18n language:', getCurrentLanguage());
        console.log('Saved language:', savedLang);
        console.log('Saved RTL preference:', savedRTL);
        console.log('Language set flag:', setFlag);
        console.log('I18nManager.isRTL:', I18nManager.isRTL);
        console.log('=====================');
      } catch (error) {
        console.error('Debug error:', error);
      }
    };

    debugLanguageState();
  }, []);

  return null; // This is just for debugging
};

export default LanguageDebugger;
