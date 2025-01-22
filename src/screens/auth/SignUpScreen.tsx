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
  Keyboard,
} from 'react-native';
import React, {useState,useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import AuthService from '../../services/AuthService';
import Toast from 'react-native-toast-message';
import BuyerService from '../../services/BuyerService';

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
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Track focus state for each input field
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          setKeyboardVisible(true);
        },
      );
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          setKeyboardVisible(false);
        },
      );
      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, []);

  const searchLocationSuggestion = async (keyword: string) => {
    try {
      const response = await BuyerService.getPlaces(keyword, 'India');
      if (response?.predictions) {
        const suggestions = response.predictions.map(
          (prediction: {description: string}) => prediction.description,
        );
        setLocationSuggestions(suggestions);
        setShowSuggestions(true);
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

  const handleInputChange = (key: string, value: string) => {
    if (key === 'Name') {
      // Check for special characters using a regular expression
      const specialCharacterRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
      if (specialCharacterRegex.test(value)) {
        // Show a warning if special characters are found
        Toast.show({
          type: 'error',
          text1: 'Warning',
          text2: 'Special characters are not allowed in the Name field.',
        });
        return; // Prevent updating the state
      }
    }

    if (key === 'Phone') {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length > 10) {
        Toast.show({
          type: 'error',
          text1: 'Warning',
          text2: 'Mobile number cannot be greater than 10 digits.',
        });
        return;
      }
      setSignupData({...signupData, [key]: numericValue});
    } else if (key === 'Location') {
      setSignupData({...signupData, [key]: value});
      if (value.length >= 1) {
        searchLocationSuggestion(value);
      } else {
        setLocationSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSignupData({...signupData, [key]: value});
    }
    setErrors({...errors, [key]: false});
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSignupData({...signupData, Location: suggestion});
    setShowSuggestions(false);
  };

  const clearInputField = (key: string) => {
    setSignupData({...signupData, [key]: ''});
    if (key === 'Location') {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

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

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    console.log('signup button pressed');
    console.log('User entered data:', signupData);

    try {
      setLoading(true);
      const response = await AuthService.signUp(signupData);
      console.log('API Response:', response);

      if (response.Success && response.Message !== 'Email already exist') {
        // Navigate to OTP screen with email
        navigation.navigate('OtpScreen', {email: signupData.Email});
      } else {
        // Show error message if email exists or signup fails
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      style={styles.mainScreen}>
      {/* Logo Section */}
      {!isKeyboardVisible && (
      <View style={styles.upperPart}>
        <Image
          source={require('../../assets/Images/houselogo.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      )}
      {/* Input Section / Lower Part */}
      <View style={[styles.lowerPart]}>
        <View style={[
                styles.lowerPart,
                isKeyboardVisible && styles.lowerPartKeyboardVisible,
              ]}>
       {/* Name Input */}
       <View style={styles.txtpadding}>
          <Text style={[styles.label]}>Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                errors.Name && styles.inputError,
                focusedInput === 'Name' && styles.inputFocused,
              ]}
              value={signupData.Name}
              onChangeText={text => handleInputChange('Name', text)}
              placeholder="Enter Your Name"
              onFocus={() => setFocusedInput('Name')}
              onBlur={() => setFocusedInput(null)}
            />
            {signupData.Name !== '' && (
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
                errors.Email && styles.inputError,
                focusedInput === 'Email' && styles.inputFocused, // Apply black border when focused
              ]}
              value={signupData.Email}
              onChangeText={text => handleInputChange('Email', text)}
              keyboardType="email-address"
              placeholder="Enter Your E-mail"
              onFocus={() => setFocusedInput('Email')} // Set focus state
              onBlur={() => setFocusedInput(null)} // Clear focus state
            />
            {signupData.Email !== '' && (
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
                errors.Location && styles.inputError,
                focusedInput === 'Location' && styles.inputFocused, // Apply black border when focused
              ]}
              value={signupData.Location}
              onChangeText={text => handleInputChange('Location', text)}
              placeholder="Search Location"
              onFocus={() => setFocusedInput('Location')} // Set focus state
              onBlur={() => setFocusedInput(null)} // Clear focus state
            />
            {signupData.Location !== '' && (
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
          <Text style={[styles.label]}>Phone</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                errors.Phone && styles.inputError,
                focusedInput === 'Phone' && styles.inputFocused, // Apply black border when focused
              ]}
              value={signupData.Phone}
              onChangeText={text => handleInputChange('Phone', text)}
              keyboardType="phone-pad"
              placeholder="Enter Your Phone Number"
              onFocus={() => setFocusedInput('Phone')} // Set focus state
              onBlur={() => setFocusedInput(null)} // Clear focus state
            />
            {signupData.Phone !== '' && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => clearInputField('Phone')}>
                <Text style={styles.clearButtonText}>X</Text>
              </TouchableOpacity>
            )}
          </View>
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
      </View>
      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: '#cc0e74',
  },
  lowerPartKeyboardVisible: {
    paddingTop: 20,
  },
  upperPart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cc0e74',
    borderBottomRightRadius: 60,
  },
  lowerPart: {
    flex: 4,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 70,
    paddingVertical: 20,
  },
  image: {
    width: 150,
    height: 150,
  },
  spacing: {
    marginBottom: 10,
  },
  txtpadding: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
  },
  btnsection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    color: '#880e4f',
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
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: 'red',
  },
  inputFocused: {
    borderColor: '#cc0e74', // Black border when focused
    borderWidth: 1.9,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#880e4f',
  },
  button: {
    backgroundColor: '#cc0e74',
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
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  color: {
    backgroundColor: '#cc0e74',
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

export default SignUpScreen;
