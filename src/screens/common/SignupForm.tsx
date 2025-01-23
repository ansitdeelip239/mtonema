import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Keyboard,
} from 'react-native';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateLocation,
} from '../../utils/formvalidation';

const SignupForm = () => {
  const [sellerData, setSellerData] = useState({
    Name: '',
    Email: '',
    Phone: '+91-', // Initialize the prefix value
    Location: '',
  });

  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    Name: '',
    Email: '',
    Phone: '',
    Location: '',
  });

  const handleInputChange = (key: string, value: string) => {
    setSellerData({ ...sellerData, [key]: value });
    if (key === 'Phone') {
      if (!value.startsWith('+91-')) {
        setSellerData((prev) => ({ ...prev, [key]: '+91-' }));
        return;
      }

      // Edit only after the prefix
      const numbers = value
        .slice(4)
        .replace(/[^0-9]/g, '')
        .slice(0, 10);
      const formattedPhone = `+91-${numbers}`;
      setSellerData((prev) => ({ ...prev, [key]: formattedPhone }));
      setErrors((prev) => ({
        ...prev,
        Phone: validatePhone(formattedPhone) ? '' : 'Invalid phone number',
      }));
      return;
    }
    setSellerData({ ...sellerData, [key]: value });
    if (key === 'Location') {
      setLocationQuery(value);
    }

    // Validate input only if the field is not empty
    let errorMessage = '';
    if (value.trim() === '') {
      errorMessage = 'This field is required';
    } else {
      switch (key) {
        case 'Name':
          errorMessage = validateName(value) ? '' : 'Name contains invalid characters';
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

    setErrors({ ...errors, [key]: errorMessage });
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSellerData({ ...sellerData, Location: suggestion });
    setLocationQuery(suggestion);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const clearInputField = (key: string) => {
    setSellerData({ ...sellerData, [key]: key === 'Phone' ? '+91-' : '' });
    if (key === 'Location') {
      setLocationQuery('');
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
    setErrors({ ...errors, [key]: '' });
  };

  const handleSignUp = () => {
    const isNameValid = sellerData.Name.trim() !== '' && validateName(sellerData.Name);
    const isEmailValid = sellerData.Email.trim() !== '' && validateEmail(sellerData.Email);
    const isPhoneValid = sellerData.Phone.trim() !== '' && validatePhone(sellerData.Phone);
    const isLocationValid = sellerData.Location.trim() !== '' && validateLocation(sellerData.Location);

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isLocationValid) {
      setErrors({
        Name: sellerData.Name.trim() === '' ? 'Name is required' : !validateName(sellerData.Name) ? 'Name contains invalid characters' : '',
        Email: sellerData.Email.trim() === '' ? 'Email is required' : !validateEmail(sellerData.Email) ? 'Invalid email address' : '',
        Phone: sellerData.Phone.trim() === '' ? 'Phone is required' : !validatePhone(sellerData.Phone) ? 'Invalid phone number' : '',
        Location: sellerData.Location.trim() === '' ? 'Location is required' : !validateLocation(sellerData.Location) ? 'Invalid location' : '',
      });
      return;
    }

    console.log('Sign Up Pressed', sellerData);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      style={styles.container}>
      {/* Name Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'Name' && styles.inputFocused,
              errors.Name !== '' && styles.inputError, // Apply error style if there's an error
            ]}
            value={sellerData.Name}
            onChangeText={(text) => handleInputChange('Name', text)}
            placeholder="Enter Your Name"
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
        {errors.Name !== '' && <Text style={styles.errorText}>{errors.Name}</Text>}
      </View>

      {/* Email Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'Email' && styles.inputFocused,
              errors.Email !== '' && styles.inputError, // Apply error style if there's an error
            ]}
            value={sellerData.Email}
            onChangeText={(text) => handleInputChange('Email', text)}
            keyboardType="email-address"
            placeholder="Enter Your E-mail"
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
        {errors.Email !== '' && <Text style={styles.errorText}>{errors.Email}</Text>}
      </View>

      {/* Location Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'Location' && styles.inputFocused,
              errors.Location !== '' && styles.inputError, // Apply error style if there's an error
            ]}
            value={locationQuery}
            onChangeText={(text) => handleInputChange('Location', text)}
            placeholder="Search Location"
            onFocus={() => {
              setFocusedInput('Location');
              if (locationQuery.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              setFocusedInput(null);
              setShowSuggestions(false);
            }}
          />
          {locationQuery !== '' && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => clearInputField('Location')}>
              <Text style={styles.clearButtonText}>X</Text>
            </TouchableOpacity>
          )}
        </View>
        {showSuggestions && locationQuery.length > 0 && locationSuggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              keyboardShouldPersistTaps="always"
              data={locationSuggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionSelect(item)}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        {errors.Location !== '' && <Text style={styles.errorText}>{errors.Location}</Text>}
      </View>

      {/* Mobile Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mobile</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'Phone' && styles.inputFocused,
              errors.Phone !== '' && styles.inputError, // Apply error style if there's an error
            ]}
            value={sellerData.Phone}
            onChangeText={(text) => handleInputChange('Phone', text)}
            keyboardType="number-pad"
            placeholder="+91-"
            placeholderTextColor="#888"
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
        {errors.Phone !== '' && <Text style={styles.errorText}>{errors.Phone}</Text>}
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.button]}
          onPress={() => console.log('Back Pressed')}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
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
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputFocused: {
    borderColor: '#cc0e74',
    borderWidth: 1.5,
  },
  inputError: {
    borderColor: 'red', // Apply red border for errors
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
    marginTop: 5,
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
