import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BuyerBottomTabParamList} from '../../types/navigation';
import ContactScreen, {ContactScreenConfig} from '../../components/ContactScreen';
import {IconEnum} from '../../components/GetIcon';
import {Linking, Platform} from 'react-native';
import {useTranslation} from 'react-i18next';

type Props = NativeStackScreenProps<BuyerBottomTabParamList, 'Contact Us'>;

const ContactUsScreen: React.FC<Props> = ({navigation: _navigation}) => {
  const {t} = useTranslation();
  const config: ContactScreenConfig = {
    title: t('contactUs.title'),
    subtitle: t('contactUs.subtitle'),
    contactInfo: [
      {
        id: 'phone',
        title: t('contactUs.contactInfo.phone'),
        value: '+91 7303062845',
        icon: 'user' as IconEnum,
        action: () => Linking.openURL('tel:+917303062845'),
      },
      {
        id: 'email',
        title: t('contactUs.contactInfo.email'),
        value: 'info@mtone.in',
        icon: 'message' as IconEnum,
        action: () => Linking.openURL('mailto:info@mtone.in'),
      },
      {
        id: 'address',
        title: t('contactUs.contactInfo.address'),
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
      {day: t('contactUs.officeHours.mondayFriday'), hours: t('contactUs.officeHours.hours.weekday')},
      {day: t('contactUs.officeHours.saturday'), hours: t('contactUs.officeHours.hours.saturday')},
      {day: t('contactUs.officeHours.sunday'), hours: t('contactUs.officeHours.hours.sunday')},
    ],
    socialLinks: [
      {name: t('contactUs.socialLinks.facebook'), icon: 'home' as IconEnum, color: '#1877F2'},
      {name: t('contactUs.socialLinks.instagram'), icon: 'search' as IconEnum, color: '#E4405F'},
      {name: t('contactUs.socialLinks.linkedin'), icon: 'user' as IconEnum, color: '#0077B5'},
      {name: t('contactUs.socialLinks.twitter'), icon: 'message' as IconEnum, color: '#1DA1F2'},
    ],
    showBusinessHours: true,
    showSocialMedia: true,
    showQuickActions: true,
    formFields: {
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
    },
    submitButtonText: t('contactUs.buttons.sendMessage'),
  };

  return <ContactScreen config={config} />;
};

export default ContactUsScreen;
