import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ContactedPropertyModel} from '../../../../../types/admin';

interface Props {
  property: ContactedPropertyModel;
}

const ContactedPropertyCard: React.FC<Props> = ({property}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>
          {new Date(property.CreatedOn).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.label}>Buyer Details</Text>
        </View>
        <Text style={styles.name}>{property.BuyerName}</Text>
        <Text style={styles.location}>{property.BuyerLocation}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.label}>Seller Details</Text>
        </View>
        <Text style={styles.name}>{property.SellerName}</Text>
        <Text style={styles.location}>{property.SellerLocation}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.label}>Property Location</Text>
        </View>
        <Text style={styles.location}>{property.PropertyLocation}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
});

export default React.memo(ContactedPropertyCard);
