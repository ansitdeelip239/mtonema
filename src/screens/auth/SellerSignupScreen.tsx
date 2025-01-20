import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView, // Import KeyboardAvoidingView
  ScrollView, // Import ScrollView
  Platform, // Import Platform to handle iOS/Android differences
} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import AuthService from '../../services/AuthService';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<AuthStackParamList, 'SellerSignupScreen'>;

const SellerSignupScreen: React.FC<Props> = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sellerData, setSellerData] = useState({
    Name: '',
    Email: '',
    Phone: '',
    Location: '',
    TermsChecked: 'true',
  });

  const [errors, setErrors] = useState({
    Name: false,
    Email: false,
    Phone: false,
    Location: false,
  });

  const handleInputChange = (key: string, value: string) => {
    setSellerData({...sellerData, [key]: value});
    // Clear errors when the user starts typing
    setErrors({...errors, [key]: false});
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {...errors};

    if (!sellerData.Name.trim()) {
      newErrors.Name = true;
      valid = false;
    }
    if (
      !sellerData.Email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sellerData.Email)
    ) {
      newErrors.Email = true;
      valid = false;
    }
    if (!sellerData.Phone.trim() || !/^\d{10}$/.test(sellerData.Phone)) {
      newErrors.Phone = true;
      valid = false;
    }
    if (!sellerData.Location.trim()) {
      newErrors.Location = true;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleContinue = async () => {
    if (!validateForm()) {
      return;
    }

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

      if (response.Success && response.Message !== 'Email already exist') {
        // Navigate to OTP screen only if the API call is successful and email does not exist
        navigation.navigate('OtpScreen', {email: sellerData.Email});
      } else {
        // Show error message if email already exists or signup fails
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
      style={styles.mainScreen} // Take up the full screen
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust offset if needed
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer} // Make the content scrollable
        keyboardShouldPersistTaps="handled" // Ensure taps outside the keyboard dismiss it
      >
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
              style={[
                styles.input,
                styles.spacing1,
                errors.Name && styles.inputError, // Apply red border if error
              ]}
              value={sellerData.Name}
              onChangeText={text => handleInputChange('Name', text)}
            />
          </View>
          <View style={styles.txtpadding}>
            <Text style={[styles.label]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                styles.spacing1,
                errors.Email && styles.inputError, // Apply red border if error
              ]}
              value={sellerData.Email}
              onChangeText={text => handleInputChange('Email', text)}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.txtpadding}>
            <Text style={[styles.label]}>Location</Text>
            <TextInput
              style={[
                styles.input,
                styles.spacing1,
                errors.Location && styles.inputError, // Apply red border if error
              ]}
              value={sellerData.Location}
              onChangeText={text => handleInputChange('Location', text)}
            />
          </View>
          <View style={styles.txtpadding}>
            <Text style={[styles.label]}>Mobile</Text>
            <TextInput
              style={[
                styles.input,
                styles.spacing1,
                errors.Phone && styles.inputError, // Apply red border if error
              ]}
              value={sellerData.Phone}
              onChangeText={text => handleInputChange('Phone', text)}
              keyboardType="phone-pad"
            />
          </View>
          {/* Buttons Section */}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: '#cc0e74', // Pinkish Background
  },
  scrollContainer: {
    flexGrow: 1, // Allow the content to grow and make the screen scrollable
  },
  txtpadding: {
    paddingLeft: 15,
    width: '95%',
  },
  btnsection: {
    justifyContent: 'center', // Centers vertically
    alignItems: 'center',
    paddingBottom: 20, // Add padding to ensure buttons are visible
  },
  upperPart: {
    height: 150, // Set a fixed height for the upper section
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cc0e74', // Same as main background
    borderBottomRightRadius: 60,
  },
  lowerPart: {
    flex: 1, // Take up remaining space
    backgroundColor: '#ffffff', // White background for lower part
    borderTopLeftRadius: 70,
    paddingVertical: 40, // Add padding to the lower part
  },
  image: {
    width: 150, // Set a fixed width for the logo
    height: 150, // Set a fixed height for the logo
  },
  label: {
    fontSize: 20,
    color: '#880e4f', // Dark pink
    marginBottom: 0,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1, // Add border to all sides
    borderColor: '#880e4f', // Default border color
    borderRadius: 10, // Optional: Add rounded corners
    padding: 15, // Increase padding for better appearance
    fontSize: 16,
    backgroundColor: '#FFFFFF', // White background for input
  },
  inputError: {
    borderColor: 'red', // Red border for errors
  },
  button: {
    backgroundColor: '#cc0e74', // Matching pink button
    padding: 15,
    borderRadius: 30,
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
});

export default SellerSignupScreen;
