import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {PropertyModel} from '../../types';

// Utility function to strip HTML tags
const stripHtmlTags = (html: string): string => {
  return html.replace(/<\/?[^>]+(>|$)/g, '').trim();
};

interface PropertyModalProps {
  property: PropertyModel | null;
  visible: boolean;
  onClose: () => void;
}

const PropertyModal = ({property, visible, onClose}: PropertyModalProps) => {
  if (!property) return null;

  const sanitizedDescription = property.Discription
    ? stripHtmlTags(property.Discription)
    : 'Not available';

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        {property.ImageURL && (
          <Image
            source={{uri: property.ImageURL[0].ImageUrl}}
            style={styles.propertyImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            {property.Location || property.City?.MasterDetailName}
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            <Text style={styles.detail}>
              Type: {property.PropertyType?.MasterDetailName}
            </Text>
            <Text style={styles.detail}>
              For: {property.PropertyFor?.MasterDetailName}
            </Text>
            <Text style={styles.detail}>
              Price: ₹{property.Price} {property.Rate?.MasterDetailName}
            </Text>
            <Text style={styles.detail}>
              Area: {property.Area} {property.Size?.MasterDetailName}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <Text style={styles.detail}>
              Furnishing: {property.Furnishing?.MasterDetailName}
            </Text>
            <Text style={styles.detail}>
              Ready to Move: {property.readyToMove}
            </Text>
            <Text style={styles.detail}>Description: {sanitizedDescription}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seller Information</Text>
            <Text style={styles.detail}>Name: {property.SellerName}</Text>
            <Text style={styles.detail}>Contact: {property.SellerPhone}</Text>
            <Text style={styles.detail}>
              Email: {property.SellerEmail || 'Not available'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 40,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  propertyImage: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c5282',
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
    color: '#4a5568',
  },
});

export default PropertyModal;
