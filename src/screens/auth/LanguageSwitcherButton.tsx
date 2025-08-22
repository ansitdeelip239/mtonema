import React, {useState, useCallback, useMemo} from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import { getCurrentLanguage, getSupportedLanguages } from '../../i18n';
import { SupportedLanguage } from '../../i18n/types';
import LanguageSelector from '../../components/LanguageSelector';

interface LanguageSwitcherButtonProps {
  style?: any;
  textColor?: string;
}

const LanguageSwitcherButton: React.FC<LanguageSwitcherButtonProps> = ({
  style,
  textColor = '#007AFF',
}) => {
  // ✅ Call ALL hooks at the top level, in the same order every time
  const {t} = useTranslation();
  const [showLanguageSelector, setShowLanguageSelector] =
    useState<boolean>(false);

  // ✅ Use useMemo to prevent recalculation and ensure stable values
  const currentLanguage = useMemo(() => getCurrentLanguage(), []);
  const supportedLanguages = useMemo(() => getSupportedLanguages() || [], []); // ✅ Fallback to empty array

  // ✅ Use useMemo for finding current language info
  const currentLangInfo = useMemo((): SupportedLanguage | undefined => {
    return supportedLanguages.find(
      (lang: SupportedLanguage) => lang.code === currentLanguage,
    );
  }, [currentLanguage, supportedLanguages]);

  // ✅ Define callbacks with useCallback for stable references
  const openSelector = useCallback(() => {
    setShowLanguageSelector(true);
  }, []);

  const closeSelector = useCallback(() => {
    setShowLanguageSelector(false);
  }, []);

  // ✅ Early return AFTER all hooks have been called
  if (!supportedLanguages.length) {
    return null; // Don't render if no languages available
  }

  return (
    <View>
      <TouchableOpacity
        style={[styles.languageButton, style]}
        onPress={openSelector}
        accessibilityLabel={t('language.changeLanguage')}>
        <View style={styles.languageButtonContent}>
          <Text style={[styles.languageIcon, {color: textColor}]}>🌐</Text>
          <Text style={[styles.languageText, {color: textColor}]}>
            {currentLangInfo?.code.toUpperCase() || 'EN'}
          </Text>
        </View>
      </TouchableOpacity>

      <LanguageSelector
        visible={showLanguageSelector}
        onClose={closeSelector}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  languageButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LanguageSwitcherButton;
