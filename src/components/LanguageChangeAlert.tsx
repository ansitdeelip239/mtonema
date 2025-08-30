import {TFunction} from 'i18next';
import {Alert} from 'react-native';

export const showLanguageChangeAlert = (
  t: TFunction,
  languageName: string,
  onConfirm: () => void,
  onCancel?: () => void,
) => {
  Alert.alert(
    t('language.change', 'Change Language'),
    `${t('language.switchTo', 'Switch to {{languageName}}?', { languageName })} ${t('language.rtlWarning', 'This will change the app layout direction and the app will restart.')}`,
    [
      {
        text: t('common.actions.cancel', 'Cancel'),
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: t('app.restart', 'Restart App'),
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
    changeLanguage: t('language.change', 'Change Language'),
    switchToLanguage: t(
      'language.switchTo',
      'Switch to {{languageName}}?',
      { languageName }
    ),
    rtlChangeWarning: t(
      'language.rtlWarning',
      'This will change the app layout direction and the app will restart.'
    ),
  };

  Alert.alert(
    translations.changeLanguage,
    `${translations.switchToLanguage} ${translations.rtlChangeWarning}`,
    [
      {
        text: t('common.actions.cancel'),
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: t('app.restart'),
        onPress: onConfirm,
      },
    ],
    {cancelable: false},
  );
};
