import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
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
    Phone: '+91',
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
      if (!value.startsWith('+91')) {
        processedValue = '+91';
      } else {
        processedValue = value
          .slice(3)
          .replace(/[^0-9]/g,'')
          .slice(0, 10);
        processedValue = `+91${processedValue}`;
      }
    }

    // Update seller data
    setSellerData(prev => ({...prev, [key]: processedValue}));

    // Validate input
    let errorMessage = '';
    if (
      processedValue.trim() === '' ||
      (key === 'Phone' && processedValue === '+91')
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
          errorMessage = validatePhone(processedValue)
            ? ''
            : 'Invalid phone number (10 digits required)';
          break;
      }
    }

    // Update errors
    setErrors(prev => ({...prev, [key]: errorMessage}));
  };

  const clearInputField = (key: string) => {
    setSellerData(prev => ({...prev, [key]: key === 'Phone' ? '+91' : ''}));
    setErrors(prev => ({...prev, [key]: ''}));
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
        sellerData.Phone === '+91'
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
    if (hasErrors) {return;}

    // Prepare data for submission
    const formDataToSubmit = {
      ...sellerData,
      Phone: sellerData.Phone.replace('+91', ''),
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
          right={
            sellerData.Name !== '' && (
              <TextInput.Icon
                // eslint-disable-next-line react/no-unstable-nested-components
                icon={()=>(
                  <Image style={styles.crossicon}
                  source={require('../assets/Icon/crossicon.png')}/>
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
          right={
            sellerData.Email !== '' && (
              <TextInput.Icon
  // eslint-disable-next-line react/no-unstable-nested-components
  icon={()=> (
    <Image style={styles.crossicon}
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

      {/* Phone Input */}
      <View style={styles.inputGroup}>
        <TextInput
          label="Phone"
          value={sellerData.Phone}
          onChangeText={text => handleInputChange('Phone', text)}
          mode="outlined"
          keyboardType="number-pad"
          maxLength={14}
          error={!!errors.Phone}
          right={
            sellerData.Phone !== '+91' && (
              <TextInput.Icon
              // eslint-disable-next-line react/no-unstable-nested-components
              icon={()=> (
                <Image style={styles.crossicon}
                  source={require('../assets/Icon/crossicon.png')}
                />
              )}
                onPress={() => clearInputField('Phone')}
              />
            )
          }
        />
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
  buttonLabel:{
    fontSize: 18, // Increase font size
    fontWeight: 'bold', // Apply font weight
  },
  crossicon:{
    width: 24,
    height: 24,
  },
  inputGroup: {
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 5,
    gap: 15,
    padding:10,
    height: 200,
    width: '100%',
  },
  button: {
    justifyContent: 'center',
    backgroundColor:'#cc0e74',
    width: '100%',
    height:'30%',
    fontWeight:'bold',
  },
});

export default SignupForm;
