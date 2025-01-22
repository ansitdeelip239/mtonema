import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import AuthService from '../../services/AuthService';
import Toast from 'react-native-toast-message';
import BuyerService from '../../services/BuyerService';

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

  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch location suggestions from your backend API
  const searchLocationSuggestion = async (keyword: string) => {
    try {
      const response = await BuyerService.getPlaces(keyword, 'India');
      console.log(response);

      // Check if response is defined and has the expected structure
      if (response && response.predictions) {
        // Extract the descriptions from the predictions array
        const suggestions = response.predictions.map(
          (prediction: {description: string}) => prediction.description,
        );
        setLocationSuggestions(suggestions); // Update location suggestions
        setShowSuggestions(true); // Show the dropdown
      } else {
        setLocationSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error(error);
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle input changes for the Location field
  const handleInputChange = (key: string, value: string) => {
    if (key === 'Phone') {
      // Allow only numeric values
      const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters

      // Check if the length exceeds 14 digits
      if (numericValue.length > 10) {
        Toast.show({
          type: 'error',
          text1: 'Warning',
          text2: 'Mobile number cannot be greater than 10 digits.',
        });
        return;
      }

      setSellerData({...sellerData, [key]: numericValue});
    } else if (key === 'Location') {
      setLocationQuery(value);
      setSellerData({...sellerData, [key]: value});
      if (value.length >= 1) {
        searchLocationSuggestion(value);
      } else {
        setLocationSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSellerData({...sellerData, [key]: value});
    }

    // Clear errors when the user starts typing
    setErrors({...errors, [key]: false});
  };

  // Handle location suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    setSellerData({...sellerData, Location: suggestion}); // Update the Location field
    setLocationQuery(suggestion); // Update the search query
    setShowSuggestions(false); // Hide the dropdown
  };

  // Clear input field
  const clearInputField = (key: string) => {
    setSellerData({...sellerData, [key]: ''});
    if (key === 'Location') {
      setLocationQuery('');
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      style={styles.mainScreen}>
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
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                errors.Name && styles.inputError, // Apply red border if error
              ]}
              value={sellerData.Name}
              onChangeText={text => handleInputChange('Name', text)}
              placeholder="Enter Your Name"
            />
            {sellerData.Name !== '' && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => clearInputField('Name')}>
                <Text style={styles.clearButtonText}>X</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.txtpadding}>
          <Text style={[styles.label]}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                errors.Email && styles.inputError, // Apply red border if error
              ]}
              value={sellerData.Email}
              onChangeText={text => handleInputChange('Email', text)}
              keyboardType="email-address"
               placeholder="Enter Your E-mail"
            />
            {sellerData.Email !== '' && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => clearInputField('Email')}>
                <Text style={styles.clearButtonText}>X</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.txtpadding}>
          <Text style={[styles.label]}>Location</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                errors.Location && styles.inputError, // Apply red border if error
              ]}
              value={locationQuery}
              onChangeText={text => handleInputChange('Location', text)}
              placeholder="Search Location"
            />
            {locationQuery !== '' && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => clearInputField('Location')}>
                <Text style={styles.clearButtonText}>X</Text>
              </TouchableOpacity>
            )}
          </View>
          {showSuggestions && (
            <FlatList
              data={locationSuggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionSelect(item)}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsContainer}
            />
          )}
        </View>
        <View style={styles.txtpadding}>
          <Text style={[styles.label]}>Mobile</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                errors.Phone && styles.inputError, // Apply red border if error
              ]}
              value={sellerData.Phone}
              onChangeText={text => handleInputChange('Phone', text)}
              keyboardType="phone-pad"
               placeholder="Enter Your Mobile Number"
            />
            {sellerData.Phone !== '' && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => clearInputField('Phone')}>
                <Text style={styles.clearButtonText}>X</Text>
              </TouchableOpacity>
            )}
          </View>
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
              <Text style={styles.buttonText}>Sign Up</Text>
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: '#cc0e74', // Pinkish Background
  },
  upperPart: {
    flex: 1, // Take up 1/5th of the screen
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cc0e74', // Same as main background
    borderBottomRightRadius: 60, // Rounded corner
  },
  lowerPart: {
    flex: 4, // Take up 4/5th of the screen
    backgroundColor: '#ffffff', // White background for the form
    borderTopLeftRadius: 70, // Rounded corner
    paddingVertical: 60, // Add vertical padding
  },
  image: {
    width: 150, // Adjust as needed
    height: 150, // Adjust as needed
  },
  spacing: {
    marginBottom: 10, // Add space below each button
  },
  txtpadding: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20, // Add spacing between fields
  },
  btnsection: {
    justifyContent: 'center', // Centers vertically
    alignItems: 'center',
    marginTop: 20, // Add spacing above the buttons
  },
  label: {
    fontSize: 18,
    color: '#880e4f', // Dark pink
    marginBottom: 10,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#880e4f',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF', // White background for input
  },
  inputError: {
    borderColor: 'red', // Red border for errors
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#880e4f', // Dark pink
  },
  button: {
    backgroundColor: '#cc0e74', // Matching pink button
    padding: 15,
    borderRadius: 30,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15, // Add spacing between buttons
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  color: {
    backgroundColor: '#cc0e74', // Darker pink for the back button
  },
  suggestionsContainer: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#880e4f',
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: '#FFFFFF',
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SellerSignupScreen;
