import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {api} from '../../utils/api';
import url from '../../constants/api';
import {useAuth} from '../../hooks/useAuth';
import {PropertyModel} from '../../types';


interface EnquiryButtonProps {
  property: PropertyModel;
  buttonStyle?: object; // Add this prop for custom button styles
  textStyle?: object; // Add this prop for custom text styles
}

const EnquiryButton = ({
  property,
  buttonStyle,
  textStyle,
}: EnquiryButtonProps) => {
  const {user, setDataUpdated, dataUpdated} = useAuth();
  const [loading, setLoading] = useState(false); // State for loader

  const enquiryNow = async () => {
    setLoading(true); // Start loader
    try {
      const request = {
        UserID: user?.id,
        PropertyID: property.ID,
      };
      const response = await api.post(`${url.ContactProperty}`, request);
      if (response.success) {
        Alert.alert('Success', 'Our Team will contact you soon');
        setDataUpdated(!dataUpdated);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <TouchableOpacity
      style={[styles.enquiryButton, buttonStyle]} // Apply default and custom button styles
      onPress={enquiryNow}
      disabled={loading} // Disable button when loading
    >
      {loading ? (
        <ActivityIndicator color="#fff" /> // Show loader when loading
      ) : (
        <Text style={[styles.enquiryButtonText, textStyle]}>Enquiry Now</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});

export default EnquiryButton;
