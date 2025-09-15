import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import {I18nManager} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

import en from './locales/en.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';
import am from './locales/am.json';

import {SupportedLanguageCode, SUPPORTED_LANGUAGES} from './types';
import config from '../config';

// ✅ Add storage keys as constants
const LANGUAGE_STORAGE_KEY = 'user_selected_language';
const RTL_STORAGE_KEY = 'user_rtl_preference';

const resources = {
  en: {translation: en},
  es: {translation: es},
  pt: {translation: pt},
  am: {translation: am},
  ar: {translation: ar},
  hi: {translation: hi},
} as const;

const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: (callback: (lng: string) => void): void => {
    const bestLanguage = RNLocalize.findBestLanguageTag(Object.keys(resources));
    callback(bestLanguage?.languageTag ?? 'en');
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

const initI18n = async () => {
  await i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v4',
      resources,
      fallbackLng: 'en',
      debug: config.environment === 'development',
      lng: 'en', // Default language
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
};

initI18n().catch(console.error);

// ✅ Updated: Only restart when RTL direction actually changes
export const changeLanguage = async (
  languageCode: SupportedLanguageCode,
): Promise<void> => {
  try {
    console.log(`Starting language change to: ${languageCode}`);

    // Get the selected language info
    const selectedLanguage = SUPPORTED_LANGUAGES.find(
      lang => lang.code === languageCode,
    );
    const shouldBeRTL = selectedLanguage?.isRTL || false;
    const currentIsRTL = I18nManager.isRTL;

    // ✅ ALWAYS save to AsyncStorage first
    await Promise.all([
      AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode),
      AsyncStorage.setItem(RTL_STORAGE_KEY, shouldBeRTL.toString()),
    ]);

    console.log(
      `Language and RTL preference saved to storage: ${languageCode}, RTL: ${shouldBeRTL}`,
    );

    // Change the language in i18next
    await i18n.changeLanguage(languageCode);
    console.log(`i18next language changed to: ${languageCode}`);

    // ✅ Only restart if RTL direction actually changes
    if (shouldBeRTL !== currentIsRTL) {
      console.log(
        `RTL direction changing from ${currentIsRTL} to ${shouldBeRTL}`,
      );

      // Force the new direction
      I18nManager.allowRTL(shouldBeRTL);
      I18nManager.forceRTL(shouldBeRTL);

      // Wait a bit to ensure AsyncStorage write is complete
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));

      console.log('Restarting app for RTL change...');
      RNRestart.Restart();
    } else {
      console.log(
        'No RTL change needed, language change complete without restart',
      );
      // ✅ Language changed successfully without restart
    }
  } catch (error) {
    console.error('Failed to change language:', error);
    throw error;
  }
};

// Helper function to get current language
export const getCurrentLanguage = (): SupportedLanguageCode => {
  return (i18n.language as SupportedLanguageCode) || 'en';
};

// Helper function to get supported languages
export const getSupportedLanguages = () => SUPPORTED_LANGUAGES.filter(lang => !lang.isHidden);

// Helper function to check if current language is RTL
export const isCurrentLanguageRTL = (): boolean => {
  const currentLang = getCurrentLanguage();
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLang);
  return language?.isRTL || false;
};

export default i18n;
