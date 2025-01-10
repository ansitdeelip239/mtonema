import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {PropertyModel} from '../../types';
// import {ActivityIndicator} from 'react-native-paper';
import {api} from '../../utils/api';
import url from '../../constants/api';
import { User } from '../../types';
import { useAuth } from '../../hooks/useAuth';

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
  const {user,setDataUpdated,dataUpdated} = useAuth();
  if (!property) {return null; }

  const sanitizedDescription = property.Discription
    ? stripHtmlTags(property.Discription)
    : 'Not available';

    const enquiryNow = async() => {
      try {
          const request = {
             UserID:user?.ID,
              PropertyID:property.ID,
          };
          const response = await api.post<User>(
                    `${url.ContactProperty}`,request
                  );
          if(response.Success)
          {
              Alert.alert('Success', 'Our Team contact you soon');
              setDataUpdated(!dataUpdated);
          }
          else
          {
              throw new Error(response.Message);
          }
      } catch (error) {
          if(error instanceof Error)
          {
              Alert.alert('Error', error.message);
          }
      }
        };

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
          {/* Enquiry Now Button */}
    {/* Enquiry Now Button */}
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.enquiryButton} onPress={enquiryNow}>
        <Text style={styles.enquiryButtonText}>Enquiry Now</Text>
      </TouchableOpacity>
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
  buttonContainer: {
    alignItems: 'center', // Center the button horizontally
    marginBottom: 16, // Add some space at the bottom
  },
  enquiryButton: {
    backgroundColor: '#cc0e74',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%', // 80% of the modal width
    borderRadius: 8, // Optional: Add rounded corners
  },
  enquiryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
