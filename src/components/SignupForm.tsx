import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  validateEmail,
  validateLocation,
  validateName,
  validatePhone,
} from '../utils/formvalidation';
import LocationComponent from './LocationComponenet';
import {SignUpRequest} from '../types';
import Colors from '../constants/Colors';
import { navigationRef } from '../navigator/NavigationRef';

const SignupForm = ({
  handleSignup,
  loading,
}: {
  handleSignup: (formData: SignUpRequest) => void;
  loading: boolean;
}) => {
  const [sellerData, setSellerData] = useState({
    Name: '',
    Email: '',
    Phone: '+91-', // Initialize the prefix value
    Location: '',
  });
  // const [locationQuery, setLocationQuery] = useState('');
  // const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  // const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    Name: '',
    Email: '',
    Phone: '',
    Location: '',
  });

  const handleInputChange = (key: string, value: string) => {
    setSellerData({...sellerData, [key]: value});
    if (key === 'Phone') {
      if (!value.startsWith('+91-')) {
        setSellerData(prev => ({...prev, [key]: '+91-'}));
        return;
      }

      // Edit only after the prefix
      const numbers = value
        .slice(4)
        .replace(/[^0-9]/g, '')
        .slice(0, 10);
      const formattedPhone = `+91-${numbers}`;
      setSellerData(prev => ({...prev, [key]: formattedPhone}));
      setErrors(prev => ({
        ...prev,
        Phone: validatePhone(formattedPhone) ? '' : 'Invalid phone number',
      }));
      return;
    }
    setSellerData({...sellerData, [key]: value});

    // Validate input only if the field is not empty
    let errorMessage = '';
    if (value.trim() === '') {
      errorMessage = 'This field is required';
    } else {
      switch (key) {
        case 'Name':
          errorMessage = validateName(value)
            ? ''
            : 'Name contains invalid characters';
          break;
        case 'Email':
          errorMessage = validateEmail(value) ? '' : 'Invalid email address';
          break;
        case 'Phone':
          errorMessage = validatePhone(value) ? '' : 'Invalid phone number';
          break;
        case 'Location':
          errorMessage = validateLocation(value) ? '' : 'Invalid location';
          break;
        default:
          break;
      }
    }

    setErrors({...errors, [key]: errorMessage});
  };

  const clearInputField = (key: string) => {
    setSellerData({...sellerData, [key]: key === 'Phone' ? '+91-' : ''});
    setErrors({...errors, [key]: ''});
  };
  const handleLocationChange = (location: string) => {
    setSellerData({...sellerData, Location: location});
    setErrors({
      ...errors,
      Location: validateLocation(location) ? '' : 'Invalid location',
    });
  };
  // Update the handleSignUp function
  const onSignUp = () => {
    // Check for empty values first
    const emptyFields = Object.entries(sellerData).reduce(
      (acc, [key, value]) => {
        if (value.trim() === '' || (key === 'Phone' && value === '+91-')) {
          acc[key] = `${key} is required`;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    if (Object.keys(emptyFields).length > 0) {
      setErrors({...errors, ...emptyFields});
      return;
    }

    // Proceed with validation checks
    const isNameValid = validateName(sellerData.Name);
    const isEmailValid = validateEmail(sellerData.Email);
    const isPhoneValid = validatePhone(sellerData.Phone);
    const isLocationValid = validateLocation(sellerData.Location);

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isLocationValid) {
      setErrors({
        Name: !isNameValid ? 'Name contains invalid characters' : '',
        Email: !isEmailValid ? 'Invalid email address' : '',
        Phone: !isPhoneValid ? 'Invalid phone number' : '',
        Location: !isLocationValid ? 'Invalid location' : '',
      });
      return;
    }

    const formDataToSubmit = {
      ...sellerData,
      Phone: stripPhonePrefix(sellerData.Phone),
    };

    // If all validations pass, proceed with signup
    handleSignup(formDataToSubmit);
  };

  const stripPhonePrefix = (phone: string): string => {
    return phone.replace('+91-', '');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      style={styles.container}>
      {/* Name Input */}
      <View style={styles.inputGroup}>
        {/* <Text style={styles.label}>Name</Text> */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'Name' && styles.inputFocused,
              errors.Name !== '' && styles.inputError, // Apply error style if there's an error
            ]}
            value={sellerData.Name}
            onChangeText={text => handleInputChange('Name', text)}
            placeholder="Enter Your Name"
            placeholderTextColor={Colors.placeholderColor}
            onFocus={() => setFocusedInput('Name')}
            onBlur={() => setFocusedInput(null)}
          />
          {sellerData.Name !== '' && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => clearInputField('Name')}>
              <Text style={styles.clearButtonText}>X</Text>
            </TouchableOpacity>
          )}
        </View>
        {errors.Name !== '' && (
          <Text style={styles.errorText}>{errors.Name}</Text>
        )}
      </View>

      {/* Email Input */}
      <View style={styles.inputGroup}>
        {/* <Text style={styles.label}>Email</Text> */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'Email' && styles.inputFocused,
              errors.Email !== '' && styles.inputError, // Apply error style if there's an error
            ]}
            value={sellerData.Email}
            onChangeText={text => handleInputChange('Email', text)}
            keyboardType="email-address"
            placeholder="Enter Your E-mail"
            placeholderTextColor={Colors.placeholderColor}
            onFocus={() => setFocusedInput('Email')}
            onBlur={() => setFocusedInput(null)}
          />
          {sellerData.Email !== '' && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => clearInputField('Email')}>
              <Text style={styles.clearButtonText}>X</Text>
            </TouchableOpacity>
          )}
        </View>
        {errors.Email !== '' && (
          <Text style={styles.errorText}>{errors.Email}</Text>
        )}
      </View>

      <LocationComponent onLocationChange={handleLocationChange} />

      {/* Mobile Input */}
      <View style={styles.inputGroup}>
        {/* <Text style={styles.label}>Mobile</Text> */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'Phone' && styles.inputFocused,
              errors.Phone !== '' && styles.inputError,
            ]}
            value={sellerData.Phone}
            onChangeText={text => handleInputChange('Phone', text)}
            keyboardType="number-pad"
            placeholder="+91-"
            placeholderTextColor={Colors.placeholderColor}
            onFocus={() => setFocusedInput('Phone')}
            onBlur={() => setFocusedInput(null)}
            maxLength={14} // +91- + 10 digits = 14 characters
          />
          {sellerData.Phone !== '+91-' && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => clearInputField('Phone')}>
              <Text style={styles.clearButtonText}>X</Text>
            </TouchableOpacity>
          )}
        </View>
        {errors.Phone !== '' && (
          <Text style={styles.errorText}>{errors.Phone}</Text>
        )}
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        {loading ? (
          <View style={styles.button}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={onSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, styles.button]}
          onPress={() => navigationRef.current?.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    // backgroundColor: '#ffffff',
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputFocused: {
    borderColor: '#cc0e74',
    borderWidth: 1.5,
  },
  inputError: {
    borderColor: 'red',
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#888',
  },
  suggestionsContainer: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 1,
    backgroundColor: '#f9f9f9',
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#cc0e74',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default SignupForm;
