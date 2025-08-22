import {TFunction} from 'i18next';
import {Alert} from 'react-native';

export const showLanguageChangeAlert = (
  t: TFunction,
  languageName: string,
  onConfirm: () => void,
  onCancel?: () => void,
) => {
  Alert.alert(
    t('language.changeLanguage'),
    `Switch to ${languageName}? The app will restart to apply changes.`,
    [
      {
        text: t('common.cancel'),
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: 'OK',
        onPress: onConfirm,
      },
    ],
    {cancelable: false},
  );
};

export const showRTLChangeAlert = (
  t: TFunction,
  languageName: string,
  onConfirm: () => void,
  onCancel?: () => void,
) => {
  const translations = {
    changeLanguage: t('components.languageSwitcher.changeLanguage'),
    switchToLanguage: t('components.languageSwitcher.switchToLanguage', {
      languageName,
    }),
    rtlChangeWarning: t('components.languageSwitcher.rtlChangeWarning'),
  };

  Alert.alert(
    translations.changeLanguage, // ✅ Now localized
    `${translations.switchToLanguage} ${translations.rtlChangeWarning}`, // ✅ Now localized with interpolation
    [
      {
        text: t('common.cancel'), // ✅ Already localized
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: t('common.restartApp'), // ✅ Now localized
        onPress: onConfirm,
      },
    ],
    {cancelable: false},
  );
};
