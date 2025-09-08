import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import BuyerSellerHeader from '../../components/BuyerSellerHeader';
import Colors from '../../constants/Colors';
import GetIcon from '../../components/GetIcon';
import {useAuth} from '../../context/AuthProvider';
import AuthService from '../../services/AuthService';

const SellerContactScreen = () => {
  const {user} = useAuth();

  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      id: 'phone',
      title: 'Phone',
      value: '+91 7303062845',
      icon: 'user' as const,
      action: () => Linking.openURL('tel:+917303062845'),
    },
    {
      id: 'email',
      title: 'Email',
      value: 'info@mtone.in',
      icon: 'message' as const,
      action: () => Linking.openURL('mailto:into@mtone.in'),
    },
    {
      id: 'address',
      title: 'Address',
      value: 'C-116 GF, OfficeOn, Sector 2, Noida, Uttar Pradesh - 201301',
      icon: 'home' as const,
      action: () => {
        // Open maps
        const address = 'OfficeOn, Sector 2, Noida, Uttar Pradesh - 201301';
        const url = Platform.select({
          ios: `maps:0,0?q=${address}`,
          android: `geo:0,0?q=${address}`,
        });
        if (url) {
          Linking.openURL(url);
        }
      },
    },
  ];

  const socialLinks = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'user' as const,
      color: '#1877F2',
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: 'message' as const,
      color: '#1DA1F2',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: 'home' as const,
      color: '#E4405F',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: 'settings' as const,
      color: '#0077B5',
    },
  ];

  const handleSubmit = async () => {
    if (!contactForm.subject || !contactForm.message) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User information not available');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await AuthService.getInTouch({
        subject: contactForm.subject,
        message: contactForm.message,
        email: user.email,
        name: user.name,
        phone: user.phone,
        domain: 'deccanrealty.com',
      });

      if (response.success) {
        Alert.alert(
          'Message Sent!',
          'Thank you for contacting us. We will get back to you within 24 hours.',
          [
            {
              text: 'OK',
              onPress: () => setContactForm({subject: '', message: ''}),
            },
          ],
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <BuyerSellerHeader
          title="Contact Us"
          subtitle="Get in touch with support"
        />

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          {contactInfo.map(info => (
            <TouchableOpacity
              key={info.id}
              style={styles.contactCard}
              onPress={info.action}>
              <View style={styles.contactIcon}>
                <GetIcon
                  iconName={info.icon}
                  color={Colors.MT_PRIMARY_1}
                  size="24"
                />
              </View>
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>{info.title}</Text>
                <Text style={styles.contactValue}>{info.value}</Text>
              </View>
              <GetIcon
                iconName="settings"
                color={Colors.MT_SECONDARY_2}
                size="16"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Business Hours */}
        <View style={styles.hoursSection}>
          <Text style={styles.sectionTitle}>Business Hours</Text>
          <View style={styles.hoursCard}>
            <View style={styles.hourItem}>
              <Text style={styles.dayText}>Monday - Friday</Text>
              <Text style={styles.timeText}>9:00 AM - 6:00 PM</Text>
            </View>
            <View style={styles.hourItem}>
              <Text style={styles.dayText}>Saturday</Text>
              <Text style={styles.timeText}>10:00 AM - 4:00 PM</Text>
            </View>
            <View style={styles.hourItem}>
              <Text style={styles.dayText}>Sunday</Text>
              <Text style={styles.timeText}>Closed</Text>
            </View>
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Send us a Message</Text>
          <View style={styles.formCard}>
            <TextInput
              style={styles.input}
              placeholder="Subject"
              placeholderTextColor="#888"
              value={contactForm.subject}
              onChangeText={text =>
                setContactForm({...contactForm, subject: text})
              }
            />

            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Your Message"
              placeholderTextColor="#888"
              value={contactForm.message}
              onChangeText={text =>
                setContactForm({...contactForm, message: text})
              }
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}>
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Social Media */}
        <View style={styles.socialSection}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialContainer}>
            {socialLinks.map(social => (
              <TouchableOpacity
                key={social.id}
                style={[styles.socialButton, {backgroundColor: social.color}]}
                onPress={() =>
                  Alert.alert(
                    'Coming Soon',
                    `${social.name} page will be available soon!`,
                  )
                }>
                <GetIcon iconName={social.icon} color="white" size="20" />
                <Text style={styles.socialText}>{social.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Need immediate assistance? Call us now!
          </Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Linking.openURL('tel:+9118001234567')}>
            <GetIcon iconName="phone" color="white" size="20" />
            <Text style={styles.callButtonText}>Call Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: 'white',
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    opacity: 0.9,
  },
  contactSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  contactCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: Colors.MT_SECONDARY_2,
  },
  hoursSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  hoursCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  hourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 16,
    color: Colors.MT_SECONDARY_2,
  },
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#333',
    marginBottom: 15,
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  socialSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: '48%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  socialText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  footerText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  callButton: {
    backgroundColor: Colors.MT_PRIMARY_1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  callButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SellerContactScreen;
