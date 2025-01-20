import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigator/AuthNavigator';
import AuthService from '../../services/AuthService';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<AuthStackParamList, 'SellerSignupScreen'>;

const SellerSignupScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sellerData, setSellerData] = useState({
    Name: '',
    Email: '',
    Phone: '',
    Location: '',
    TermsChecked:'true',
  });

  const handleInputChange = (key: string, value: string) => {
    setSellerData({ ...sellerData, [key]: value });
  };

  const handleContinue = async () => {
    console.log('seller signup button pressed');
    console.log('User entered data:', sellerData); // Log user-entered data

    try {
      setIsLoading(true);
      const response = await AuthService.RegisterSeller(
        sellerData.Email,
        sellerData.Name,
        sellerData.Phone,
        sellerData.Location,
        sellerData.TermsChecked as any,
      );
      console.log('API Response:', response); // Log API response

      if (response.Success) {
        // Navigate to OTP screen if the API call is successful
        navigation.navigate('OtpScreen', { email: sellerData.Email });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.Message || 'Sign up failed. Please try again.',
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.mainScreen}>
      {/* Logo Section */}
      <View style={styles.upperPart}>
        <Image
          source={require('../../assets/Images/houselogo.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      {/* Input Section / Lower Part */}
      <View style={[styles.lowerPart]}>
        <View style={styles.txtpadding}>
          <Text style={[styles.label]}>Name</Text>
          <TextInput
            style={[styles.input, styles.spacing1]}
            value={sellerData.Name}
            onChangeText={text => handleInputChange('Name', text)}
          />
        </View>
        <View style={styles.txtpadding}>
          <Text style={[styles.label]}>Email</Text>
          <TextInput
            style={[styles.input, styles.spacing1]}
            value={sellerData.Email}
            onChangeText={text => handleInputChange('Email', text)}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.txtpadding}>
          <Text style={[styles.label]}>Mobile</Text>
          <TextInput
            style={[styles.input, styles.spacing1]}
            value={sellerData.Phone}
            onChangeText={text => handleInputChange('Phone', text)}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.txtpadding}>
          <Text style={[styles.label]}>Location</Text>
          <TextInput
            style={[styles.input, styles.spacing1]}
            value={sellerData.Location}
            onChangeText={text => handleInputChange('Location', text)}
          />
        </View>
        <View style={styles.btnsection}>
          <TouchableOpacity
            style={[styles.button, styles.spacing]}
            onPress={handleContinue}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.spacing, styles.color]}
            onPress={navigation.goBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Toast Component */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: '#cc0e74', // Pinkish Background
  },
  txtpadding: {
    paddingLeft: 10,
    width: '95%',
  },
  btnsection: {
    justifyContent: 'center', // Centers vertically
    alignItems: 'center',
  },
  upperPart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cc0e74', // Same as main background
    borderBottomRightRadius: 60,
  },
  lowerPart: {
    flex: 3,
    backgroundColor: '#ffffff', // White background for lower part
    borderTopLeftRadius: 70,
    paddingVertical: 60,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontSize: 20,
    color: '#880e4f', // Dark pink
    marginBottom: 0,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#880e4f',
    padding: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#cc0e74', // Matching pink button
    padding: 15,
    borderRadius: 30,
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  spacing: {
    marginBottom: 10, // Adds space below each button
  },
  color: {
    backgroundColor: '#790c5a',
  },
  spacing1: {
    marginBottom: 35, // Adds space below each button
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#880e4f',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#cc0e74',
    padding: 15,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default SellerSignupScreen;
