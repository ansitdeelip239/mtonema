import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ListRenderItem,
  SafeAreaView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  changeLanguage,
  getSupportedLanguages,
  isCurrentLanguageRTL,
} from '../i18n';
import {SupportedLanguage, SupportedLanguageCode} from '../i18n/types';
import Colors from '../constants/Colors';
import {
  showRTLChangeAlert,
} from './LanguageChangeAlert';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  visible,
  onClose,
}) => {
  const {i18n, t} = useTranslation();
  const supportedLanguages = getSupportedLanguages();

  const handleLanguageSelect = (languageCode: SupportedLanguageCode): void => {
    if (languageCode === i18n.language) {
      onClose();
      return;
    }

    const newLanguage = supportedLanguages.find(
      lang => lang.code === languageCode,
    );
    if (!newLanguage) {
      return;
    }

    const currentIsRTL = isCurrentLanguageRTL();
    const newIsRTL = newLanguage.isRTL || false;

    // ✅ Only show alert if RTL direction will change
    if (currentIsRTL !== newIsRTL) {
      // Show RTL change alert only when direction changes
      showRTLChangeAlert(
        t,
        newLanguage.name,
        () => performLanguageChange(languageCode),
        onClose, // Close modal on cancel
      );
    } else {
      // ✅ No alert needed - direct language change for same direction
      performLanguageChange(languageCode);
    }
  };

  const performLanguageChange = async (
    languageCode: SupportedLanguageCode,
  ): Promise<void> => {
    try {
      await changeLanguage(languageCode);
      onClose();
    } catch (error) {
      console.error('Failed to change language:', error);
      onClose();
    }
  };

  const renderLanguageItem: ListRenderItem<SupportedLanguage> = ({item}) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        i18n.language === item.code && styles.selectedLanguageItem,
      ]}
      onPress={() => handleLanguageSelect(item.code as SupportedLanguageCode)}
      accessibilityLabel={`Select ${item.name} language`}>
      <View style={[styles.languageContent, item.isRTL && styles.rtlContent]}>
        <View style={styles.languageInfo}>
          <Text
            style={[
              styles.languageName,
              i18n.language === item.code && styles.selectedText,
              item.isRTL && styles.rtlText,
            ]}>
            {item.name}
          </Text>
          <Text
            style={[
              styles.nativeName,
              i18n.language === item.code && styles.selectedNativeText,
              item.isRTL && styles.rtlText,
            ]}>
            {item.nativeName}
          </Text>
          {item.isRTL && <Text style={styles.rtlIndicator}>RTL</Text>}
        </View>
        {i18n.language === item.code && (
          <Text style={styles.selectedIndicator}>✓</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('screens.languageSelectionScreen.selectLanguage')}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={supportedLanguages}
          renderItem={renderLanguageItem}
          keyExtractor={item => item.code}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.MT_PRIMARY_1,
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  languageItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f9fafb',
  },
  selectedLanguageItem: {
    borderColor: Colors.MT_PRIMARY_1,
    backgroundColor: Colors.MT_PRIMARY_1 + '10',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rtlContent: {
    flexDirection: 'row-reverse',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  selectedText: {
    color: Colors.MT_PRIMARY_1,
  },
  nativeName: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  selectedNativeText: {
    color: Colors.MT_PRIMARY_1,
    opacity: 0.8,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  rtlIndicator: {
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: '600',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  selectedIndicator: {
    fontSize: 18,
    color: Colors.MT_PRIMARY_1,
    fontWeight: 'bold',
  },
});

export default LanguageSelector;
