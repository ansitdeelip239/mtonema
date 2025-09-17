import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {useTheme} from '../../context/ThemeProvider';
import GetIcon, {IconEnum} from '../../components/GetIcon';
import Colors from '../../constants/Colors';

const ContactItem = ({
  icon,
  title,
  value,
  onPress,
  isLink = false,
  theme
}: {
  icon: IconEnum;
  title: string;
  value: string;
  onPress?: () => void;
  isLink?: boolean;
  theme: any;
}) => (
  <TouchableOpacity
    style={[styles.contactItem, {backgroundColor: '#fff'}]}
    onPress={onPress}
    disabled={!onPress}>
    <View style={styles.contactIcon}>
      <GetIcon iconName={icon} color={theme.primaryColor || Colors.primary} size="24" />
    </View>
    <View style={styles.contactContent}>
      <Text style={[styles.contactTitle, {color: theme.textColor || '#333'}]}>
        {title}
      </Text>
      <Text style={[styles.contactValue, {
        color: isLink ? theme.primaryColor || Colors.primary : theme.textColor || '#666'
      }]}>
        {value}
      </Text>
    </View>
    {onPress && (
      <GetIcon iconName="chevronRight" color={theme.textColor || '#666'} size="20" />
    )}
  </TouchableOpacity>
);

const HelpCenterScreen = () => {
  const {theme} = useTheme();

  const contactDetails = {
    legalEntity: 'MUNA TECHNOLOGIES LLP',
    registeredAddress: 'PLOT NO 114 & 115 KH. NO. 75/6, GROUND FLOOR, STREET NO.07, AJIT VIHAR, VILLAGE BURARI North Delhi DELHI 110084',
    operationalAddress: 'C-116 GF, OfficeOn, Sector 2, Noida, Uttar Pradesh - 201301',
    phone: '+91 7303062845',
    email: 'info@mtone.in',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLZZbFV0TKtPaT2J2Cqyz-bglHSbqsabZt',
  };

  const handlePhoneCall = () => {
    Linking.openURL(`tel:${contactDetails.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${contactDetails.email}`);
  };

  const handleYouTube = () => {
    Linking.openURL(contactDetails.youtubePlaylist);
  };

  return (
    <ScrollView 
      style={[styles.scrollView, {backgroundColor: theme.backgroundColor || '#f5f5f5'}]} 
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <Text style={[styles.sectionTitle, {color: theme.textColor || '#333'}]}>
          Contact Details
        </Text>

        <ContactItem
          icon="home"
          title="Legal Entity Name"
          value={contactDetails.legalEntity}
          theme={theme}
        />

        <ContactItem
          icon="locationPin"
          title="Registered Address"
          value={contactDetails.registeredAddress}
          theme={theme}
        />

        <ContactItem
          icon="locationPin"
          title="Operational Address"
          value={contactDetails.operationalAddress}
          theme={theme}
        />

        <ContactItem
          icon="phone"
          title="Phone"
          value={contactDetails.phone}
          onPress={handlePhoneCall}
          isLink={true}
          theme={theme}
        />

        <ContactItem
          icon="email"
          title="Email"
          value={contactDetails.email}
          onPress={handleEmail}
          isLink={true}
          theme={theme}
        />

        <View style={styles.divider} />

        <Text style={[styles.sectionTitle, {color: theme.textColor || '#333'}]}>
          Tutorials & Resources
        </Text>

        <ContactItem
          icon="playButton"
          title="YouTube Tutorial Playlist"
          value="Watch our comprehensive tutorial series"
          onPress={handleYouTube}
          isLink={true}
          theme={theme}
        />

        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, {color: theme.textColor || '#666'}]}>
            📚 Our YouTube playlist contains step-by-step tutorials to help you get the most out of MT One.
          </Text>
          <Text style={[styles.infoText, {color: theme.textColor || '#666'}]}>
            📞 For immediate assistance, feel free to call us or send an email.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(83, 162, 14, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    opacity: 0.8,
  },
  contactValue: {
    fontSize: 16,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 24,
  },
  infoContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(83, 162, 14, 0.05)',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#53a20e',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default HelpCenterScreen;