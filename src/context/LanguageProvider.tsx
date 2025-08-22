import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {I18nManager} from 'react-native';
import {changeLanguage, getCurrentLanguage} from '../i18n';
import {SupportedLanguageCode, SUPPORTED_LANGUAGES} from '../i18n/types';

interface LanguageContextType {
  currentLanguage: SupportedLanguageCode;
  isLanguageSet: boolean;
  isLoading: boolean;
  setUserLanguage: (language: SupportedLanguageCode) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const LANGUAGE_STORAGE_KEY = 'user_selected_language';
const LANGUAGE_SET_FLAG = 'language_initially_set';
const RTL_STORAGE_KEY = 'user_rtl_preference';

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] =
    useState<SupportedLanguageCode>('en');
  const [isLanguageSet, setIsLanguageSet] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    initializeLanguage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeLanguage = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // ✅ Get both language and RTL preference from storage
      const [savedLanguage, languageSetFlag, savedRTL] = await Promise.all([
        AsyncStorage.getItem(LANGUAGE_STORAGE_KEY),
        AsyncStorage.getItem(LANGUAGE_SET_FLAG),
        AsyncStorage.getItem(RTL_STORAGE_KEY),
      ]);

      console.log('Retrieved from storage:', {
        savedLanguage,
        languageSetFlag,
        savedRTL,
      });

      if (savedLanguage && languageSetFlag) {
        // ✅ Verify RTL state matches saved preference
        const selectedLanguage = SUPPORTED_LANGUAGES.find(
          lang => lang.code === savedLanguage,
        );
        const shouldBeRTL =
          savedRTL === 'true' || selectedLanguage?.isRTL || false;

        console.log(
          `Language: ${savedLanguage}, Should be RTL: ${shouldBeRTL}, Current RTL: ${I18nManager.isRTL}`,
        );

        // ✅ Fix RTL state if it doesn't match
        if (shouldBeRTL !== I18nManager.isRTL) {
          console.log('RTL state mismatch detected, fixing...');
          I18nManager.allowRTL(shouldBeRTL);
          I18nManager.forceRTL(shouldBeRTL);

          // ✅ Force re-render by restarting if there's a mismatch
          setTimeout(() => {
            console.log('Restarting due to RTL mismatch...');
            const RNRestart = require('react-native-restart').default;
            RNRestart.Restart();
          }, 100);
          return;
        }

        // Apply the saved language
        await changeLanguageWithoutRestart(
          savedLanguage as SupportedLanguageCode,
        );
        setCurrentLanguage(savedLanguage as SupportedLanguageCode);
        setIsLanguageSet(true);
      } else {
        const deviceLanguage = getCurrentLanguage();
        setCurrentLanguage(deviceLanguage);
        setIsLanguageSet(false);
      }
    } catch (error) {
      console.error('Failed to initialize language:', error);
      setCurrentLanguage('en');
      setIsLanguageSet(false);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Helper function to change language without restart (for initialization)
  const changeLanguageWithoutRestart = async (
    language: SupportedLanguageCode,
  ): Promise<void> => {
    const i18n = (await import('../i18n')).default;
    await i18n.changeLanguage(language);
  };

  const setUserLanguage = async (
    language: SupportedLanguageCode,
  ): Promise<void> => {
    try {
      console.log(`Setting user language to: ${language}`);

      // ✅ Update state immediately for UI feedback
      setCurrentLanguage(language);
      setIsLanguageSet(true);

      // ✅ Save to AsyncStorage first
      const selectedLanguage = SUPPORTED_LANGUAGES.find(
        lang => lang.code === language,
      );
      const shouldBeRTL = selectedLanguage?.isRTL || false;

      await Promise.all([
        AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language),
        AsyncStorage.setItem(LANGUAGE_SET_FLAG, 'true'),
        AsyncStorage.setItem(RTL_STORAGE_KEY, shouldBeRTL.toString()),
      ]);

      console.log('Language preferences saved to AsyncStorage');

      // ✅ Now change language (this will handle restart if needed)
      await changeLanguage(language);
    } catch (error) {
      console.error('Failed to set user language:', error);
      // ✅ Reset state on error
      setCurrentLanguage(getCurrentLanguage());
      throw error;
    }
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    isLanguageSet,
    isLoading,
    setUserLanguage,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
