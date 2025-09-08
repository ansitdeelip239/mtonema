import React from 'react';
import ContactScreen, {ContactScreenConfig} from '../../components/ContactScreen';
import {IconEnum} from '../../components/GetIcon';
import {Linking, Platform} from 'react-native';

const SellerContactScreen = () => {
  const config: ContactScreenConfig = {
    title: 'Contact Us',
    subtitle: 'Get in touch with support',
    contactInfo: [
      {
        id: 'phone',
        title: 'Phone',
        value: '+91 7303062845',
        icon: 'user' as IconEnum,
        action: () => Linking.openURL('tel:+917303062845'),
      },
      {
        id: 'email',
        title: 'Email',
        value: 'info@mtone.in',
        icon: 'message' as IconEnum,
        action: () => Linking.openURL('mailto:info@mtone.in'),
      },
      {
        id: 'address',
        title: 'Address',
        value: 'C-116 GF, OfficeOn, Sector 2, Noida, Uttar Pradesh - 201301',
        icon: 'home' as IconEnum,
        action: () => {
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
    ],
    officeHours: [
      {day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM'},
      {day: 'Saturday', hours: '10:00 AM - 4:00 PM'},
      {day: 'Sunday', hours: 'Closed'},
    ],
    socialLinks: [
      {name: 'Facebook', icon: 'user' as IconEnum, color: '#1877F2'},
      {name: 'Twitter', icon: 'message' as IconEnum, color: '#1DA1F2'},
      {name: 'Instagram', icon: 'home' as IconEnum, color: '#E4405F'},
      {name: 'LinkedIn', icon: 'settings' as IconEnum, color: '#0077B5'},
    ],
    showBusinessHours: true,
    showSocialMedia: true,
    showQuickActions: false,
    formFields: {
      name: false,
      email: false,
      phone: false,
      subject: true,
      message: true,
    },
    submitButtonText: 'Send Message',
  };

  return <ContactScreen config={config} />;
};

export default SellerContactScreen;
