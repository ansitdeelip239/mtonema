import {TFunction} from 'i18next';
import {Alert} from 'react-native';

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
