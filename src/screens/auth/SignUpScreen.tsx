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
} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import AuthService from '../../services/AuthService'; // Import the AuthService
import Toast from 'react-native-toast-message'; // Import Toast

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUpScreen'>;

const SignUpScreen: React.FC<Props> = ({navigation}) => {
  const [signupData, setSignupData] = useState({
    Name: '',
    Email: '',
    Location: '',
    Phone: '',
  });

  const [errors, setErrors] = useState({
    Name: false,
    Email: false,
    Location: false,
    Phone: false,
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes dynamically
  const handleInputChange = (key: string, value: string) => {
    setSignupData({...signupData, [key]: value});
    // Clear errors when the user starts typing
    setErrors({...errors, [key]: false});
  };

  // Validate the form
  const validateForm = () => {
    let valid = true;
    const newErrors = {...errors};

    if (!signupData.Name.trim()) {
      newErrors.Name = true;
      valid = false;
    }
    if (
      !signupData.Email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.Email)
    ) {
      newErrors.Email = true;
      valid = false;
    }
    if (!signupData.Location.trim()) {
      newErrors.Location = true;
      valid = false;
    }
    if (!signupData.Phone.trim() || !/^\d{10}$/.test(signupData.Phone)) {
      newErrors.Phone = true;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle form submission
  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const response = await AuthService.signUp(signupData);
      console.log('API Response:', response);

      // Check if the message is "Email already exist"
      const isEmailExists = response.Message === 'Email already exist';

      if (isEmailExists) {
        // Show error toast for "Email already exist"
        Toast.show({
          type: 'error', // Use 'error' type for red background
          text1: 'Error',
          text2:
            response.Message ||
            'Email already exists. Please use a different email.',
        });
      } else if (response.Success) {
        // Show success toast for successful registration
        Toast.show({
          type: 'success',
          text1: 'Registration Success',
          text2: response.Message || 'Check your Mail for next step',
        });

        // Clear the form data
        setSignupData({
          Name: '',
          Email: '',
          Location: '',
          Phone: '',
        });

        // Delay navigation by 4 seconds
        setTimeout(() => {
          navigation.navigate('MainScreen');
        }, 4000); // 4 seconds delay
      } else {
        // Show error toast for other errors
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
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
          <TextInput
            style={[
              styles.input,
              errors.Name && styles.inputError, // Apply red border if error
            ]}
            value={signupData.Name}
            onChangeText={text => handleInputChange('Name', text)}
          />
        </View>
        <View style={styles.txtpadding}>
          <Text style={[styles.label]}>Email</Text>
          <TextInput
            style={[
              styles.input,
              errors.Email && styles.inputError, // Apply red border if error
            ]}
            value={signupData.Email}
            onChangeText={text => handleInputChange('Email', text)}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.txtpadding}>
          <Text style={[styles.label]}>Location</Text>
          <TextInput
            style={[
              styles.input,
              errors.Location && styles.inputError, // Apply red border if error
            ]}
            value={signupData.Location}
            onChangeText={text => handleInputChange('Location', text)}
          />
        </View>
        <View style={styles.txtpadding}>
          <Text style={[styles.label]}>Phone</Text>
          <TextInput
            style={[
              styles.input,
              errors.Phone && styles.inputError, // Apply red border if error
            ]}
            value={signupData.Phone}
            onChangeText={text => handleInputChange('Phone', text)}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.btnsection}>
          <TouchableOpacity
            style={[styles.button, styles.spacing]}
            onPress={handleSignup}
            disabled={loading}>
            {loading ? (
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
      {/* Toast Component with Custom Configuration */}
      <Toast config={toastConfig} />
    </KeyboardAvoidingView>
  );
};

// Custom Toast Configuration
const toastConfig = {
  success: ({text1, text2}: {text1?: string; text2?: string}) => (
    <View style={styles.customToastSuccess}>
      <Text style={styles.customToastText1}>{text1}</Text>
      <Text style={styles.customToastText2}>{text2}</Text>
    </View>
  ),
  error: ({text1, text2}: {text1?: string; text2?: string}) => (
    <View style={styles.customToastError}>
      <Text style={styles.customToastText1}>{text1}</Text>
      <Text style={styles.customToastText2}>{text2}</Text>
    </View>
  ),
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
  input: {
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
    backgroundColor: '#790c5a', // Darker pink for the back button
  },
  customToastSuccess: {
    width: '90%',
    padding: 15,
    backgroundColor: '#4CAF50', // Green background for success
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customToastError: {
    width: '90%',
    padding: 15,
    backgroundColor: '#FF5252', // Red background for error
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customToastText1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
  },
  customToastText2: {
    fontSize: 16,
    color: '#FFFFFF', // White text
    marginTop: 5,
  },
});

export default SignUpScreen;
