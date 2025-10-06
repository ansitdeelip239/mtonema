import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../components/Header';
import LanguageSelector from '../../../components/LanguageSelector';
import Colors from '../../../constants/Colors';
import {getSupportedLanguages} from '../../../i18n';
import { useAuth } from '../../../context/AuthProvider';
import AuthService from '../../../services/AuthService';

const SettingsScreen = () => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const isIOS = Platform.OS === 'ios';
  const {user, logout} = useAuth();

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

  const handleHelpSupportPress = () => {
    navigation.navigate('Help Center' as never);
  };

  const handleDeleteAccountPress = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteAccountConfirm = async () => {
    if (deleteConfirmationText.trim().toLowerCase() !== 'delete my account') {
      Alert.alert('Error', 'Please type "delete my account" to confirm deletion.');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User information not found. Please try logging in again.');
      return;
    }

    try {
      setIsDeleting(true);

      const response = await AuthService.deleteUser(user.id);

      if (response.success) {
        // Account deleted successfully, logout the user
        await logout();
        setShowDeleteModal(false);
        setDeleteConfirmationText('');
        Alert.alert(
          'Account Deleted',
          'Your account has been successfully deleted. You have been logged out.',
        );
      } else {
        throw new Error(response.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      Alert.alert(
        'Error',
        'Failed to delete account. Please try again or contact support.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAccountCancel = () => {
    setShowDeleteModal(false);
    setDeleteConfirmationText('');
  };

  return (
    <View style={styles.container}>
      {!isIOS && <Header title={t('settings.title', 'Settings')} />}
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
            {t('settings.about.title', 'About')}
          </Text>

          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                {t('settings.version.title', 'App Version')}
              </Text>
              <Text style={styles.settingValue}>1.0.8</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingRow} 
            activeOpacity={0.7}
            onPress={handleHelpSupportPress}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                {t('settings.help.title', 'Help & Support')}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Delete Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.danger.title', 'Danger Zone')}
          </Text>

          <TouchableOpacity 
            style={[styles.settingRow, styles.dangerRow]}
            activeOpacity={0.7}
            onPress={handleDeleteAccountPress}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, styles.dangerText]}>
                {t('settings.deleteAccount.title', 'Delete Account')}
              </Text>
              <Text style={[styles.settingValue, styles.dangerSubText]}>
                {t('settings.deleteAccount.subtitle', 'Permanently delete your account and all data')}
              </Text>
            </View>
            <Text style={[styles.chevron, styles.dangerText]}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language Selector Modal */}
      <LanguageSelector
        visible={showLanguageSelector}
        onClose={handleLanguageSelectorClose}
      />

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={handleDeleteAccountCancel}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {t('settings.deleteAccount.confirmTitle', 'Delete Account')}
            </Text>
            <Text style={styles.modalMessage}>
              {t('settings.deleteAccount.confirmMessage', 'This action cannot be undone. All your data will be permanently deleted.')}
            </Text>
            <Text style={styles.modalInstruction}>
              {t('settings.deleteAccount.typeInstruction', 'Type "delete my account" to confirm:')}
            </Text>
            <TextInput
              style={styles.confirmationInput}
              value={deleteConfirmationText}
              onChangeText={setDeleteConfirmationText}
              placeholder={t('settings.deleteAccount.placeholder', 'delete my account')}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={handleDeleteAccountCancel}>
                <Text style={styles.cancelModalButtonText}>
                  {t('common.cancel', 'Cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.deleteModalButton,
                  (deleteConfirmationText.trim().toLowerCase() !== 'delete my account' || isDeleting) && styles.disabledButton
                ]}
                onPress={handleDeleteAccountConfirm}
                disabled={deleteConfirmationText.trim().toLowerCase() !== 'delete my account' || isDeleting}>
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.deleteModalButtonText}>
                    {t('settings.deleteAccount.confirmButton', 'Delete Account')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    // flex: 1,
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
  dangerRow: {
    borderWidth: 1,
    borderColor: '#ff3b30',
    backgroundColor: '#fff5f5',
  },
  dangerText: {
    color: '#ff3b30',
  },
  dangerSubText: {
    color: '#ff6b6b',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
    lineHeight: 22,
  },
  modalInstruction: {
    fontSize: 14,
    marginBottom: 12,
    color: '#666',
    fontWeight: '600',
  },
  confirmationInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelModalButton: {
    backgroundColor: '#f0f0f0',
  },
  deleteModalButton: {
    backgroundColor: '#ff3b30',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  cancelModalButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;
