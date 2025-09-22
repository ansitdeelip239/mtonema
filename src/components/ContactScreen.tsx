import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import GetIcon, {IconEnum} from './GetIcon';
import Colors from '../constants/Colors';
import BuyerSellerHeader from './BuyerSellerHeader';
import {useAuth} from '../context/AuthProvider';
import AuthService from '../services/AuthService';
import {useTranslation} from 'react-i18next';

export interface ContactInfo {
  id: string;
  title: string;
  value: string;
  icon: IconEnum;
  action: () => void;
}

export interface OfficeHour {
  day: string;
  hours: string;
}

export interface SocialLink {
  name: string;
  icon: IconEnum;
  color: string;
  action?: () => void;
}

export interface ContactScreenConfig {
  title: string;
  subtitle: string;
  contactInfo: ContactInfo[];
  officeHours?: OfficeHour[];
  socialLinks?: SocialLink[];
  showBusinessHours?: boolean;
  showSocialMedia?: boolean;
  showQuickActions?: boolean;
  formFields: {
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    subject?: boolean;
    message?: boolean;
  };
  submitButtonText?: string;
  onSubmit?: (formData: any) => Promise<void>;
}

interface ContactScreenProps {
  config: ContactScreenConfig;
}

const ContactScreen: React.FC<ContactScreenProps> = ({config}) => {
  const {user} = useAuth();
  const {t} = useTranslation();

  const getInitialFormData = () => {
    const formData: any = {};
    if (config.formFields.name) {
      formData.name = '';
    }
    if (config.formFields.email) {
      formData.email = '';
    }
    if (config.formFields.phone) {
      formData.phone = '';
    }
    if (config.formFields.subject) {
      formData.subject = '';
    }
    if (config.formFields.message) {
      formData.message = '';
    }
    return formData;
  };

  const [formData, setFormData] = useState(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = [];
    if (config.formFields.name) {
      requiredFields.push('name');
    }
    if (config.formFields.email) {
      requiredFields.push('email');
    }
    if (config.formFields.message) {
      requiredFields.push('message');
    }

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      Alert.alert(t('contactScreen.alerts.error'), t('contactScreen.alerts.fillRequiredFields'));
      return;
    }

    setIsSubmitting(true);
    try {
      if (config.onSubmit) {
        await config.onSubmit(formData);
      } else {
        // Default submission logic
        const response = await AuthService.getInTouch({
          subject: formData.subject || 'Contact Form Submission',
          message: formData.message,
          email: formData.email || user?.email || '',
          name: formData.name || user?.name || '',
          phone: formData.phone || user?.phone || '',
          domain: 'mtonerealestate.com',
        });

        if (response.success) {
          Alert.alert(
            t('contactScreen.alerts.messageSent'),
            t('contactScreen.alerts.messageSentMessage'),
            [
              {
                text: t('contactScreen.alerts.ok'),
                onPress: () => setFormData(getInitialFormData()),
              },
            ],
          );
        } else {
          Alert.alert(t('contactScreen.alerts.error'), response.message || t('contactScreen.alerts.sendFailed'));
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert(t('contactScreen.alerts.error'), t('contactScreen.alerts.sendFailedRetry'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContactInfo = (info: ContactInfo) => (
    <TouchableOpacity
      key={info.id}
      style={styles.contactCard}
      onPress={info.action}
      activeOpacity={0.8}>
      <View style={styles.contactIcon}>
        <GetIcon iconName={info.icon} size={24} color={Colors.MT_PRIMARY_1} />
      </View>
      <View style={styles.contactDetails}>
        <Text style={styles.contactTitle}>{info.title}</Text>
        <Text style={styles.contactValue}>{info.value}</Text>
      </View>
      <GetIcon iconName="threeDots" size={16} color="#666" />
    </TouchableOpacity>
  );

  const renderOfficeHour = (hour: OfficeHour) => (
    <View key={hour.day} style={styles.officeHour}>
      <Text style={styles.dayText}>{hour.day}</Text>
      <Text style={styles.hourText}>{hour.hours}</Text>
    </View>
  );

  const renderSocialLink = (social: SocialLink) => (
    <TouchableOpacity
      key={social.name}
      style={[styles.socialButton, {backgroundColor: social.color}]}
      onPress={social.action || (() => {
        Alert.alert(t('contactScreen.alerts.comingSoon'), t('contactScreen.alerts.socialComingSoon', {socialName: social.name}));
      })}>
      <GetIcon iconName={social.icon} size={20} color="white" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <BuyerSellerHeader
        title={config.title}
        subtitle={config.subtitle}
      />

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('contactScreen.sections.contactInformation')}</Text>
        {config.contactInfo.map(renderContactInfo)}
      </View>

      {/* Office Hours */}
      {config.showBusinessHours && config.officeHours && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('contactScreen.sections.officeHours')}</Text>
          <View style={styles.officeHoursContainer}>
            {config.officeHours.map(renderOfficeHour)}
          </View>
        </View>
      )}

      {/* Contact Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('contactScreen.sections.sendMessage')}</Text>

        <View style={styles.formContainer}>
          {config.formFields.name && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('contactScreen.form.labels.fullName')}</Text>
              <TextInput
                style={styles.textInput}
                placeholder={t('contactScreen.form.placeholders.fullName')}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
              />
            </View>
          )}

          {config.formFields.email && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('contactScreen.form.labels.emailAddress')}</Text>
              <TextInput
                style={styles.textInput}
                placeholder={t('contactScreen.form.placeholders.email')}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
              />
            </View>
          )}

          {config.formFields.phone && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('contactScreen.form.labels.phoneNumber')}</Text>
              <TextInput
                style={styles.textInput}
                placeholder={t('contactScreen.form.placeholders.phoneNumber')}
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
              />
            </View>
          )}

          {config.formFields.subject && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('contactScreen.form.labels.subject')}</Text>
              <TextInput
                style={styles.textInput}
                placeholder={t('contactScreen.form.placeholders.subject')}
                value={formData.subject}
                onChangeText={(value) => handleInputChange('subject', value)}
              />
            </View>
          )}

          {config.formFields.message && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('contactScreen.form.labels.message')}</Text>
              <TextInput
                style={[styles.textInput, styles.messageInput]}
                placeholder={t('contactScreen.form.placeholders.message')}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={formData.message}
                onChangeText={(value) => handleInputChange('message', value)}
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}>
            <Text style={styles.submitButtonText}>
              {isSubmitting ? t('contactScreen.form.buttons.sending') : (config.submitButtonText || t('contactScreen.form.buttons.sendMessage'))}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Social Media */}
      {config.showSocialMedia && config.socialLinks && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('contactScreen.sections.followUs')}</Text>
          <View style={styles.socialContainer}>
            {config.socialLinks.map(renderSocialLink)}
          </View>
        </View>
      )}

      {/* Quick Actions */}
      {config.showQuickActions && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('contactScreen.sections.quickActions')}</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => Linking.openURL('tel:+917303062845')}>
              <GetIcon iconName="phone" size={24} color={Colors.MT_PRIMARY_1} />
              <Text style={styles.quickActionText}>{t('contactScreen.quickActions.callNow')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => {
                const whatsappUrl = 'https://wa.me/+917303062845';
                Linking.openURL(whatsappUrl);
              }}>
              <GetIcon iconName="message" size={24} color="#4CAF50" />
              <Text style={styles.quickActionText}>{t('contactScreen.quickActions.whatsApp')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => {
                const address = 'OfficeOn, Sector 2, Noida, Uttar Pradesh - 201301';
                const url = Platform.select({
                  ios: `maps:0,0?q=${address}`,
                  android: `geo:0,0?q=${address}`,
                });
                if (url) {
                  Linking.openURL(url);
                }
              }}>
              <GetIcon iconName="locationPin" size={24} color="#FF9800" />
              <Text style={styles.quickActionText}>{t('contactScreen.quickActions.visitUs')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.MT_PRIMARY_1 + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactDetails: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 12,
    color: '#666',
  },
  officeHoursContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
  },
  officeHour: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  hourText: {
    fontSize: 14,
    color: '#666',
  },
  formContainer: {
    gap: 15,
  },
  inputGroup: {
    marginBottom: 5,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: Colors.MT_PRIMARY_1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAction: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default ContactScreen;
