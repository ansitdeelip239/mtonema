import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../../../components/Header';
import LanguageSelector from '../../../components/LanguageSelector';
import Colors from '../../../constants/Colors';
import {getSupportedLanguages} from '../../../i18n';

const SettingsScreen = () => {
  const {t, i18n} = useTranslation();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Get current language info
  const supportedLanguages = getSupportedLanguages();
  const currentLanguage = supportedLanguages.find(
    lang => lang.code === i18n.language,
  );

  const handleLanguageSelectorClose = () => {
    setShowLanguageSelector(false);
  };

  const openLanguageSelector = () => {
    setShowLanguageSelector(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={t('settings.title', 'Settings')} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.language.title', 'Language')}
          </Text>

          {/* Language Selection Row */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={openLanguageSelector}
            activeOpacity={0.7}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                {t('settings.language.current', 'Current Language')}
              </Text>
              <Text style={styles.settingValue}>
                {currentLanguage?.name || 'English'} (
                {currentLanguage?.nativeName || 'English'})
                {currentLanguage?.isRTL && (
                  <Text style={styles.rtlBadge}> RTL</Text>
                )}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Add other settings sections here */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.general.title', 'General')}
          </Text>

          {/* Example: Notifications */}
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                {t('settings.notifications.title', 'Notifications')}
              </Text>
              <Text style={styles.settingValue}>
                {t('settings.notifications.enabled', 'Enabled')}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Example: Theme */}
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                {t('settings.theme.title', 'Theme')}
              </Text>
              <Text style={styles.settingValue}>
                {t('settings.theme.system', 'System')}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.about.title', 'About')}
          </Text>

          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                {t('settings.version.title', 'App Version')}
              </Text>
              <Text style={styles.settingValue}>1.0.0</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                {t('settings.help.title', 'Help & Support')}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language Selector Modal */}
      <LanguageSelector
        visible={showLanguageSelector}
        onClose={handleLanguageSelectorClose}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MT_SECONDARY_3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.MT_PRIMARY_1,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  rtlBadge: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '600',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  chevron: {
    fontSize: 20,
    color: '#9ca3af',
    fontWeight: '300',
    marginLeft: 12,
  },
});

export default SettingsScreen;
