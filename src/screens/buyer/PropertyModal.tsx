import React, {useState, useRef} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
} from 'react-native';
import {PropertyModel} from '../../types';
import EnquiryButton from '../common/EnquiryButton';
import {useAuth} from '../../hooks/useAuth';
import BuyerService from '../../services/BuyerService';
import GetIcon from '../../components/GetIcon';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {SellerBottomTabParamList} from '../../types/navigation';
import {usePropertyForm} from '../../context/PropertyFormContext';
import Colors from '../../constants/Colors';
import Toast from 'react-native-toast-message';
import {formatCurrency} from '../../utils/currency';
import Roles from '../../constants/Roles';

// Utility function to strip HTML tags
const stripHtmlTags = (html: string): string => {
  return html.replace(/<\/?[^>]+(>|$)/g, '').trim();
};

interface PropertyModalProps {
  property: PropertyModel | null;
  visible: boolean;
  onClose: () => void;
  navigation?: BottomTabNavigationProp<
    SellerBottomTabParamList,
    'Home',
    undefined
  >;
  isRecommended: boolean;
}

interface ConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.confirmationModalContainer}>
        <View style={styles.confirmationModalContent}>
          <Text style={styles.confirmationModalText}>
            Are you sure you want to delete your property?
          </Text>
          <View style={styles.confirmationModalButtons}>
            <TouchableOpacity
              onPress={onConfirm}
              style={[styles.confirmationModalButton, styles.yesButton]}>
              <Text style={styles.yesButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.confirmationModalButton, styles.noButton]}>
              <Text style={styles.noButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const PropertyModal = ({
  property,
  visible,
  onClose,
  navigation,
  isRecommended,
}: PropertyModalProps) => {
  const {user, dataUpdated, setDataUpdated} = useAuth();
  const {editPropertyData} = usePropertyForm();
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  if (!property) {
    return null;
  }

  const sanitizedDescription = property.Discription
    ? stripHtmlTags(property.Discription)
    : 'Not available';

  // Determine which image array to use
  const images = property.ImageURLType || property.ImageURL || [];

  const handleNextImage = () => {
    const nextIndex =
      currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(nextIndex);
    scrollViewRef.current?.scrollTo({
      x: Dimensions.get('window').width * nextIndex,
      animated: true,
    });
  };

  const handlePreviousImage = () => {
    const prevIndex =
      currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    setCurrentImageIndex(prevIndex);
    scrollViewRef.current?.scrollTo({
      x: Dimensions.get('window').width * prevIndex,
      animated: true,
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(
      contentOffsetX / Dimensions.get('window').width,
    );
    setCurrentImageIndex(newIndex);
  };

  const handleDeleteConfirmation = () => {
    setConfirmationModalVisible(true);
  };

  // const handleEdit = () => {

  //   editPropertyData(property);
  //   onClose();
  //   navigation.navigate('AddProperty');
  // };
  const handleEdit = () => {
    setIsLoading(true);
    setTimeout(() => {
      editPropertyData(property);
      onClose();
      navigation?.navigate('AddProperty');
      setIsLoading(false);
    }, 1500);
  };

  const handleDelete = async () => {
    try {
      const response = await BuyerService.deleteProperty(property.ID);
      if (response?.Success) {
        setDataUpdated(!dataUpdated);
        onClose();
        Toast.show({
          type: 'success',
          text1: 'Property Deleted Successfully',
        });
        console.log('Property deleted successfully');
      }
    } catch (error) {
      console.error((error as Error).message);
      Toast.show({
        type: 'error',
        text1: 'Failed to Delete Property',
      });
    } finally {
      setConfirmationModalVisible(false);
    }
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
              onMomentumScrollEnd={handleScroll}>
              {images.map((image: any, index: any) => (
                <Image
                  key={index}
                  source={{uri: image.ImageUrl || image}} // Handle both cases
                  style={styles.propertyImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={handlePreviousImage}>
                <Text style={styles.navButtonText}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navButton}
                onPress={handleNextImage}>
                <Text style={styles.navButtonText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Dot Indicators */}
            <View style={styles.dotContainer}>
              {images.map((_: any, index: any) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentImageIndex
                      ? styles.activeDot
                      : styles.inactiveDot,
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
              {/* Amount: {formatCurrency(item.Price.toString())} */}
              Price: {formatCurrency(String(property.Price))}
              {/* Price: ₹{property.Price} {property.Rate?.MasterDetailName} */}
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
            <Text style={styles.detail}>
              Description: {sanitizedDescription}
            </Text>
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
        {user?.Role === Roles.BUYER && isRecommended ? (
          <View style={styles.buttonContainer}>
            <EnquiryButton property={property} />
          </View>
        ) : null}
        {user?.Role === Roles.SELLER ? (
          <>
            <View style={styles.buttonContainer1}>
              <TouchableOpacity onPress={handleDeleteConfirmation}>
                <GetIcon iconName="delete" color="white" size="20" />
              </TouchableOpacity>
              {/* <Text  style={styles.enquiryButtonText2}>
              DELETE PROPERTY
            </Text> */}
            </View>
            <View style={styles.buttonContainer2}>
              <TouchableOpacity onPress={handleEdit} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <GetIcon iconName="edit" color="white" size="20" />
                )}
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={handleEdit}>
                <GetIcon iconName="edit" color="white" size="20" />
              </TouchableOpacity> */}
            </View>
          </>
        ) : null}
      </ScrollView>

      <ConfirmationModal
        visible={isConfirmationModalVisible}
        onConfirm={handleDelete}
        onCancel={() => setConfirmationModalVisible(false)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  enquiryButtonText2: {
    color: 'white', // White text color
    fontSize: 16, // Font size
    fontWeight: 'bold', // Bold text
    textAlign: 'center', // Center text
  },
  buttonContainer1: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingVertical: 12,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 50,
    position: 'absolute',
    top: '40%',
    right: '25%',
  },
  buttonContainer2: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingVertical: 12,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 50,
    position: 'absolute',
    top: '40%',
    left: '82%',
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
    transform: [{translateY: -25}],
    paddingHorizontal: 8,
  },
  navButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 35,
    height: 35,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    lineHeight: 31,
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
    right: 12,
    top: 10,
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
  confirmationModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  confirmationModalContent: {
    width: '90%',
    height: '25%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationModalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 35,
    textAlign: 'center',
  },
  confirmationModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmationModalButton: {
    width: '44%', // Adjust width to make buttons larger
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yesButton: {
    backgroundColor: Colors.main,
  },
  noButton: {
    backgroundColor: 'white', // White background for No button
    borderWidth: 1,
    borderColor: '#ccc', // Light border for No button
  },
  yesButtonText: {
    color: 'white', // White text for Yes button
    fontSize: 16,
    fontWeight: 'bold',
  },
  noButtonText: {
    color: 'black', // Black text for No button
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PropertyModal;
