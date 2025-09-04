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
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import GetIcon, {IconEnum} from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import {BuyerBottomTabParamList} from '../../types/navigation';
import {useDrawer} from '../../hooks/useDrawer';

type Props = NativeStackScreenProps<BuyerBottomTabParamList, 'Contact Us'>;

const ContactUsScreen: React.FC<Props> = ({navigation: _navigation}) => {
  const {openDrawer} = useDrawer();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const contactInfo: Array<{
    id: string;
    title: string;
    value: string;
    icon: IconEnum;
    action: () => void;
  }> = [
    {
      id: 'phone',
      title: 'Phone',
      value: '+91 98765 43210',
      icon: 'phone',
      action: () => Linking.openURL('tel:+919876543210'),
    },
    {
      id: 'email',
      title: 'Email',
      value: 'support@mtonerealestate.com',
      icon: 'message',
      action: () => Linking.openURL('mailto:support@mtonerealestate.com'),
    },
    {
      id: 'address',
      title: 'Address',
      value: '123 Business District, Andheri West, Mumbai - 400058',
      icon: 'locationPin',
      action: () => {
        const address = '123 Business District, Andheri West, Mumbai';
        const url = Platform.OS === 'ios'
          ? `maps:///?q=${encodeURIComponent(address)}`
          : `geo:0,0?q=${encodeURIComponent(address)}`;
        Linking.openURL(url);
      },
    },
  ];

  const officeHours = [
    {day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM'},
    {day: 'Saturday', hours: '9:00 AM - 4:00 PM'},
    {day: 'Sunday', hours: 'Closed'},
  ];

  const socialLinks: Array<{name: string; icon: IconEnum; color: string}> = [
    {name: 'Facebook', icon: 'home', color: '#1877F2'},
    {name: 'Instagram', icon: 'search', color: '#E4405F'},
    {name: 'LinkedIn', icon: 'user', color: '#0077B5'},
    {name: 'Twitter', icon: 'message', color: '#1DA1F2'},
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Here you would typically send the form data to your backend
    Alert.alert(
      'Thank You!',
      'Your message has been sent successfully. We will get back to you within 24 hours.',
      [{text: 'OK', onPress: () => {
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      }}]
    );
  };

  const renderContactInfo = (info: typeof contactInfo[0]) => (
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

  const renderOfficeHour = (hour: typeof officeHours[0]) => (
    <View key={hour.day} style={styles.officeHour}>
      <Text style={styles.dayText}>{hour.day}</Text>
      <Text style={styles.hourText}>{hour.hours}</Text>
    </View>
  );

  const renderSocialLink = (social: typeof socialLinks[0]) => (
    <TouchableOpacity
      key={social.name}
      style={[styles.socialButton, {backgroundColor: social.color}]}
      onPress={() => {
        // Handle social media link
        console.log(`Open ${social.name}`);
      }}>
      <GetIcon iconName={social.icon} size={20} color="white" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={openDrawer}
            style={styles.drawerButton}>
            <GetIcon iconName="hamburgerMenu" size={20} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Get In Touch</Text>
          <Text style={styles.headerTitle}>Contact Us</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <GetIcon iconName="threeDots" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        {contactInfo.map(renderContactInfo)}
      </View>

      {/* Office Hours */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Office Hours</Text>
        <View style={styles.officeHoursContainer}>
          {officeHours.map(renderOfficeHour)}
        </View>
      </View>

      {/* Contact Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Send us a Message</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Subject</Text>
            <TextInput
              style={styles.textInput}
              placeholder="What's this about?"
              value={formData.subject}
              onChangeText={(value) => handleInputChange('subject', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Message *</Text>
            <TextInput
              style={[styles.textInput, styles.messageInput]}
              placeholder="Tell us how we can help you..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={formData.message}
              onChangeText={(value) => handleInputChange('message', value)}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Social Media */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Follow Us</Text>
        <View style={styles.socialContainer}>
          {socialLinks.map(renderSocialLink)}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <GetIcon iconName="phone" size={24} color={Colors.MT_PRIMARY_1} />
            <Text style={styles.quickActionText}>Call Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <GetIcon iconName="message" size={24} color="#4CAF50" />
            <Text style={styles.quickActionText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <GetIcon iconName="locationPin" size={24} color="#FF9800" />
            <Text style={styles.quickActionText}>Visit Us</Text>
          </TouchableOpacity>
        </View>
      </View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: 'white',
  },
  headerTop: {
    position: 'absolute',
    top: 5,
    left: 10,
    zIndex: 1,
  },
  drawerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
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

export default ContactUsScreen;
