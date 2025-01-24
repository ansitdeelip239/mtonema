import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Text,
} from 'react-native';
import {TextInput, Button, HelperText} from 'react-native-paper';
import {
  validateEmail,
  validateLocation,
  validateName,
  validatePhone,
} from '../utils/formvalidation';
import LocationComponent from './LocationComponenet';
import {SignUpRequest} from '../types';
import {navigationRef} from '../navigator/NavigationRef';

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
    Phone: '',
    Location: '',
  });

  const [errors, setErrors] = useState({
    Name: '',
    Email: '',
    Phone: '',
    Location: '',
  });

  const handleInputChange = (key: string, value: string) => {
    let processedValue = value;

    // Special handling for Phone input
    if (key === 'Phone') {
      // Remove non-numeric characters and limit to 10 digits
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    }


    // Update seller data
    setSellerData(prev => ({...prev, [key]: processedValue}));

    // Validate input
    let errorMessage = '';
    if (
      processedValue.trim() === '' ||
      (key === 'Phone' && processedValue === '')
    ) {
      errorMessage = 'This field is required';
    } else {
      switch (key) {
        case 'Name':
          errorMessage = validateName(processedValue)
            ? ''
            : 'Name must contain only letters';
          break;
        case 'Email':
          errorMessage = validateEmail(processedValue)
            ? ''
            : 'Invalid email address';
          break;
          case 'Phone':
        errorMessage = processedValue.length === 10
          ? ''
          : 'Phone number must be 10 digits';
        break;
      }
    }

    // Update errors
    setErrors(prev => ({...prev, [key]: errorMessage}));
  };

  const clearInputField = (key: string) => {
    setSellerData(prev => ({ ...prev, [key]: '' }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const handleLocationChange = (location: string) => {
    handleInputChange('Location', location);
  };

  const onSignUp = () => {
    // Validate all fields before submission
    const newErrors = {
      Name: !sellerData.Name.trim()
        ? 'Name is required'
        : !validateName(sellerData.Name)
        ? 'Name contains invalid characters'
        : '',
      Email: !sellerData.Email.trim()
        ? 'Email is required'
        : !validateEmail(sellerData.Email)
        ? 'Invalid email address'
        : '',
        Phone:
        sellerData.Phone === ''
          ? 'Phone is required'
          : !validatePhone(sellerData.Phone)
          ? 'Invalid phone number'
          : '',
      Location: !sellerData.Location.trim()
        ? ''
        : !validateLocation(sellerData.Location)
        ? 'Invalid location'
        : '',
    };

    // Update errors
    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) {
      return;
    }

    // Prepare data for submission
    const formDataToSubmit = {
      ...sellerData,
      Phone: sellerData.Phone,
    };

    // Submit form
    handleSignup(formDataToSubmit);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* Name Input */}
      <View style={styles.inputGroup}>
        <TextInput
          label="Name"
          value={sellerData.Name}
          onChangeText={text => handleInputChange('Name', text)}
          mode="outlined"
          error={!!errors.Name}
          theme={{
            colors: {
              primary: '#cc0e74', // Label color when focused
              onSurfaceVariant: 'gray', // Label color when not focused
              background: '#f0f0f0', // Background color of the input field
              text: 'black', // Text color of the input field
              error: 'red', // Error message and error state color
            },
          }}
          right={
            sellerData.Name !== '' && (
              <TextInput.Icon
                // eslint-disable-next-line react/no-unstable-nested-components
                icon={() => (
                  <Image
                    style={styles.crossicon}
                    source={require('../assets/Icon/crossicon.png')}
                  />
                )}
                onPress={() => clearInputField('Name')}
              />
            )
          }
        />
        <HelperText type="error" visible={!!errors.Name}>
          {errors.Name}
        </HelperText>
      </View>

      {/* Email Input */}
      <View style={styles.inputGroup}>
        <TextInput
          label="Email"
          value={sellerData.Email}
          onChangeText={text => handleInputChange('Email', text)}
          mode="outlined"
          keyboardType="email-address"
          error={!!errors.Email}
          theme={{
            colors: {
              primary: '#cc0e74', // Label color when focused
              onSurfaceVariant: 'gray', // Label color when not focused
              background: '#f0f0f0', // Background color of the input field
              text: 'black', // Text color of the input field
              error: 'red', // Error message and error state color
            },
          }}
          right={
            sellerData.Email !== '' && (
              <TextInput.Icon
                // eslint-disable-next-line react/no-unstable-nested-components
                icon={() => (
                  <Image
                    style={styles.crossicon}
                    source={require('../assets/Icon/crossicon.png')}
                  />
                )}
                onPress={() => clearInputField('Email')}
              />
            )
          }
        />
        <HelperText type="error" visible={!!errors.Email}>
          {errors.Email}
        </HelperText>
      </View>

      {/* Location Component */}
      <LocationComponent onLocationChange={handleLocationChange} />
      {errors.Location !== '' && (
        <HelperText type="error" visible={true}>
          {errors.Location}
        </HelperText>
      )}

<View style={styles.inputGroup}>
  <View style={styles.phoneInputContainer}>
    <View style={styles.flagContainer}>
      <Image
        source={require('../assets/Images/IndianFlag.png')}
        style={styles.flagImage}
      />
      <Text style={styles.countryCodeText}>+91</Text>
    </View>
    <TextInput
      label="Mobile"
      value={sellerData.Phone}
      onChangeText={text => handleInputChange('Phone', text)}
      mode="outlined"
      keyboardType="number-pad"
      maxLength={10}
      error={!!errors.Phone}
      style={styles.phoneInput}
      placeholder="10 Digit Mobile Number" // Placeholder text
      theme={{
        colors: {
          primary: '#cc0e74', // Label color when focused
          onSurfaceVariant: 'gray', // Label color when not focused
          background: '#f0f0f0', // Background color of the input field
          text: 'black', // Text color of the input field
          error: 'red', // Error message and error state color
        },
      }}
      right={
        sellerData.Phone.length > 0 && (
          <TextInput.Icon
            // eslint-disable-next-line react/no-unstable-nested-components
            icon={() => (
              <Image
                style={styles.crossicon}
                source={require('../assets/Icon/crossicon.png')}
              />
            )}
            onPress={() => clearInputField('Phone')}
          />
        )
      }
    />
  </View>
  <HelperText type="error" visible={!!errors.Phone}>
    {errors.Phone}
  </HelperText>
</View>

      {/* Button Section */}
      <View style={styles.buttonContainer}>
        <Button
          labelStyle={styles.buttonLabel}
          mode="contained"
          onPress={onSignUp}
          loading={loading}
          style={styles.button}>
          Sign Up
        </Button>
        <Button
          labelStyle={styles.buttonLabel}
          mode="contained"
          onPress={() => navigationRef.current?.goBack()}
          style={styles.button}>
          Back
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    width: '100%',
  },
  buttonLabel: {
    fontSize: 18, // Increase font size
    fontWeight: 'bold', // Apply font weight
  },
  crossicon: {
    width: 24,
    height: 24,
  },
  inputGroup: {
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 5,
    gap: 15,
    padding: 10,
    height: 200,
    width: '100%',
  },
  button: {
    justifyContent: 'center',
    backgroundColor: '#cc0e74',
    width: '100%',
    height: '30%',
    fontWeight: 'bold',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  flagContainer: {
    position: 'absolute',
    left: 10,
    top: 21,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  flagImage: {
    width: 20,
    height: 16,
    marginRight: 5,
  },
  countryCodeText: {
    fontSize: 16,
    color: 'black',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingLeft: 52, // Adjust to make space for flag and country code
  },
  crossIcon: {
    width: 20,
    height: 20,
  },
});

export default SignupForm;
