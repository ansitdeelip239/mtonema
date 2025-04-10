import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Client} from '../../../../types';

interface ContactInfoCardProps {
  client: Client;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({client}) => {
  const contactFields = [
    {label: 'Mobile', value: client.mobileNumber},
    {label: 'WhatsApp', value: client.whatsappNumber},
    {label: 'Email', value: client.emailId},
  ].filter(field => field.value);

  if (contactFields.length === 0) {
    return null;
  }

  return (
    <View style={styles.infoCard}>
      <Text style={styles.sectionTitle}>Contact Information</Text>
      {contactFields.map(field => (
        <View key={field.label} style={styles.infoRow}>
          <Text style={styles.infoLabel}>{field.label}:</Text>
          <Text style={styles.infoValue}>{field.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 80,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
  },
});

export default ContactInfoCard;
