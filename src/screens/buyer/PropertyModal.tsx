import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { PropertyModel } from '../../types';
import { api } from '../../utils/api';
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

const PropertyModal = ({ property, visible, onClose }: PropertyModalProps) => {
  const { user, setDataUpdated, dataUpdated } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  if (!property) {
    return null;
  }

  const sanitizedDescription = property.Discription
    ? stripHtmlTags(property.Discription)
    : 'Not available';

  // Determine which image array to use
  const images = property.ImageURLType || property.ImageURL || [];

  const enquiryNow = async () => {
    try {
      const request = {
        UserID: user?.ID,
        PropertyID: property.ID,
      };
      const response = await api.post<User>(`${url.ContactProperty}`, request);
      if (response.Success) {
        Alert.alert('Success', 'Our Team will contact you soon');
        setDataUpdated(!dataUpdated);
      } else {
        throw new Error(response.Message);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const handleNextImage = () => {
    const nextIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(nextIndex);
    scrollViewRef.current?.scrollTo({
      x: Dimensions.get('window').width * nextIndex,
      animated: true,
    });
  };

  const handlePreviousImage = () => {
    const prevIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    setCurrentImageIndex(prevIndex);
    scrollViewRef.current?.scrollTo({
      x: Dimensions.get('window').width * prevIndex,
      animated: true,
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / Dimensions.get('window').width);
    setCurrentImageIndex(newIndex);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        {images.length > 0 && (
          <View style={styles.imageContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScroll}
            >
              {images.map((image:any, index:any) => (
                <Image
                  key={index}
                  source={{ uri: image.ImageUrl || image }} // Handle both cases
                  style={styles.propertyImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

            <View style={styles.navigationButtons}>
              <TouchableOpacity style={styles.navButton} onPress={handlePreviousImage}>
                <Text style={styles.navButtonText}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navButton} onPress={handleNextImage}>
                <Text style={styles.navButtonText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Dot Indicators */}
            <View style={styles.dotContainer}>
              {images.map((_:any, index:any) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentImageIndex ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          </View>
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
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  propertyImage: {
    width: Dimensions.get('window').width,
    height: 250,
  },
  navigationButtons: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    top: '50%',
    transform: [{ translateY: -25 }],
  },
  navButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#cc0e74', // Highlight color for active dot
  },
  inactiveDot: {
    backgroundColor: '#ccc', // Default color for inactive dots
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  enquiryButton: {
    backgroundColor: '#cc0e74',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    borderRadius: 8,
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
