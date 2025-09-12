import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  ListRenderItem,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useLanguage} from '../../context/LanguageProvider';
import {getSupportedLanguages, isCurrentLanguageRTL} from '../../i18n';
import {SupportedLanguage, SupportedLanguageCode} from '../../i18n/types';
import Colors from '../../constants/Colors';
import Images from '../../constants/Images';
import {
  showRTLChangeAlert,
} from '../../components/LanguageChangeAlert';

const LanguageSelectionScreen: React.FC = () => {
  const {t} = useTranslation();
  const {setUserLanguage, currentLanguage} = useLanguage();
  const [selectedLanguage, setSelectedLanguage] =
    useState<SupportedLanguageCode>(currentLanguage);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const supportedLanguages = getSupportedLanguages();

  const handleLanguageSelect = (languageCode: SupportedLanguageCode): void => {
    setSelectedLanguage(languageCode);
  };

  const handleContinue = (): void => {
    const newLanguage = supportedLanguages.find(
      lang => lang.code === selectedLanguage,
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
        () => performLanguageChange(),
        () => setSelectedLanguage(currentLanguage), // Reset selection on cancel
      );
    } else {
      // ✅ No alert needed - direct language change for same direction
      performLanguageChange();
    }
  };

  const performLanguageChange = async (): Promise<void> => {
    try {
      setIsSubmitting(true);
      await setUserLanguage(selectedLanguage);
    } catch (error) {
      console.error('Failed to set language:', error);
      setSelectedLanguage(currentLanguage); // Reset on error
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderLanguageItem: ListRenderItem<SupportedLanguage> = ({item}) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        selectedLanguage === item.code && styles.selectedLanguageItem,
      ]}
      onPress={() => handleLanguageSelect(item.code as SupportedLanguageCode)}
      disabled={isSubmitting}
      accessibilityLabel={`Select ${item.name} language`}>
      <View style={[styles.languageContent, item.isRTL && styles.rtlContent]}>
        <View style={styles.languageInfo}>
          <Text
            style={[
              styles.languageName,
              selectedLanguage === item.code && styles.selectedLanguageText,
              item.isRTL && styles.rtlText,
            ]}>
            {item.name}
          </Text>
          <Text
            style={[
              styles.nativeName,
              selectedLanguage === item.code && styles.selectedNativeText,
              item.isRTL && styles.rtlText,
            ]}>
            {item.nativeName}
          </Text>
          {item.isRTL && <Text style={styles.rtlIndicator}>RTL</Text>}
        </View>
        <View
          style={[
            styles.radioCircle,
            selectedLanguage === item.code && styles.selectedRadioCircle,
          ]}>
          {selectedLanguage === item.code && <View style={styles.radioDot} />}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image
            source={Images.MTESTATES_LOGO}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            {t('language.welcome', 'Welcome to MTOneMA')}
          </Text>
          <Text style={styles.subtitle}>
            {t('language.selectLanguage', 'Please select your preferred language')}
          </Text>
        </View>

        {/* Language List */}
        <View style={styles.languageListContainer}>
          <FlatList
            data={supportedLanguages}
            keyExtractor={(item: SupportedLanguage) => item.code}
            renderItem={renderLanguageItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.languageList}
          />
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!selectedLanguage || isSubmitting) && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!selectedLanguage || isSubmitting}
            activeOpacity={0.8}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.continueButtonText}>
                {t('language.continue', 'Continue')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MT_SECONDARY_3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logo: {
    width: 200,
    height: 100,
  },
  titleSection: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.MT_PRIMARY_1,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.MT_SECONDARY_2,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
  },
  languageList: {
    flex: 1,
    maxHeight: 400,
  },
  languageListContainer: {
    flex: 1,
    marginBottom: 20,
  },
  languageItem: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    backgroundColor: '#ffffff',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  selectedLanguageText: {
    color: Colors.MT_PRIMARY_1,
  },
  nativeName: {
    fontSize: 16,
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
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '600',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  selectedRadioCircle: {
    borderColor: Colors.MT_PRIMARY_1,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.MT_PRIMARY_1,
  },
  buttonSection: {
    paddingVertical: 40,
  },
  buttonContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: Colors.MT_PRIMARY_1,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default LanguageSelectionScreen;
