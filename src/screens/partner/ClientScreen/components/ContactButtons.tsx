import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import GetIcon from '../../../../components/GetIcon';
import {Client} from '../../../../types';

interface ContactButtonsProps {
  client: Client;
  handleContact: (type: 'phone' | 'whatsapp' | 'email') => void;
}

const ContactButtons: React.FC<ContactButtonsProps> = ({
  client,
  handleContact,
}) => {
  if (!client.mobileNumber && !client.whatsappNumber && !client.emailId) {
    return null;
  }

  return (
    <View style={styles.contactButtons}>
      {client.mobileNumber && (
        <TouchableOpacity
          key="contact-phone"
          style={styles.contactButton}
          onPress={() => handleContact('phone')}>
          <GetIcon iconName="phone" size="24" color="#0066cc" />
          <Text style={styles.contactText}>Call</Text>
        </TouchableOpacity>
      )}
      {client.whatsappNumber && (
        <TouchableOpacity
          key="contact-whatsapp"
          style={styles.contactButton}
          onPress={() => handleContact('whatsapp')}>
          <GetIcon iconName="whatsapp" size="24" color="#0066cc" />
          <Text style={styles.contactText}>WhatsApp</Text>
        </TouchableOpacity>
      )}
      {client.emailId && (
        <TouchableOpacity
          key="contact-email"
          style={styles.contactButton}
          onPress={() => handleContact('email')}>
          <GetIcon iconName="contactus" size="24" color="#0066cc" />
          <Text style={styles.contactText}>Email</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactButton: {
    alignItems: 'center',
  },
  contactText: {
    fontSize: 12,
    color: '#0066cc',
  },
});

export default ContactButtons;
