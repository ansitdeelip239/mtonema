import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import {AuthStackParamList} from '../../navigator/AuthNavigator';
import AuthService from '../../services/AuthService';
import {useAuth} from '../../hooks/useAuth';
import {User} from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'EmailScreen'>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailScreen: React.FC<Props> = ({navigation, route}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const {storeUser} = useAuth();
  const {role} = route.params;

  const validateEmail = useCallback((emailToValidate: string) => {
    if (!emailToValidate) {
      setEmailError('Email is required');
      return false;
    }

    if (!EMAIL_REGEX.test(emailToValidate)) {
      setEmailError('Invalid email format');
      return false;
    }

    setEmailError('');
    return true;
  }, []);

  const checkEmail = useCallback(
    async (emailToCheck: string) => {
      try {
        // Clear previous errors
        setEmailError('');

        // Validate email format first
        if (!validateEmail(emailToCheck)) {
          return false;
        }

        const response = await AuthService.verifyLoginInput(emailToCheck);

        // Check if email matches the expected role
        if (response && response.data?.Role !== role) {
          console.log('response', response.data, role);

          setEmailError('*Email not found');
          return false;
        }

        console.log('response', response);
        console.log('response.data', response.data);

        if (!response.Success) {
          setEmailError(response.Message || 'Email verification failed');
          return false;
        }

        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred';

        setEmailError(errorMessage);
        return false;
      }
    },
    [role, validateEmail],
  );

  const handleContinue = useCallback(async () => {
    // Validate email before proceeding
    if (!validateEmail(email)) {
      return;
    }

    try {
      setIsLoading(true);
      const isValidEmail = await checkEmail(email);

      if (isValidEmail) {
        // Store user data and navigate to password screen
        const response = await AuthService.verifyLoginInput(email);
        storeUser(response.data as User);
        navigation.navigate('PasswordScreen', {email});
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Something went wrong. Please try again.',
        visibilityTime: 3000,
        autoHide: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, validateEmail, checkEmail, storeUser, navigation]);

  const onChangeHandler = useCallback(
    async (value: string) => {
      setEmail(value);
      // Optionally validate on each change
      validateEmail(value);
      // Call checkEmail on each change
      await checkEmail(value);
    },
    [validateEmail, checkEmail],
  );

  return (
    <KeyboardAvoidingView
      style={styles.mainScreen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.upperPart}>
        <Image
          source={require('../../assets/Images/houselogo.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.lowerPart}>
        <View style={styles.txtpadding}>
          <Text style={styles.label}>Email or Mobile</Text>
          <TextInput
            placeholder="Email or Mobile"
            value={email}
            onChangeText={onChangeHandler}
            style={[styles.input]}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </View>

        <View style={styles.btnsection}>
          <TouchableOpacity
            style={[styles.button, styles.spacing]}
            onPress={handleContinue}
            disabled={isLoading || !email}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
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

      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: '#cc0e74', // Pinkish Background
  },
  button: {
    backgroundColor: '#cc0e74',
    padding: 15,
    borderRadius: 30,
    marginVertical: 10,
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 50, // Add this to maintain consistent height
  },
  color: {
    backgroundColor: '#790c5a',
  },
  txtpadding: {
    paddingLeft: 10,
    width: '95%',
  },
  btnsection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  upperPart: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cc0e74',
    borderBottomRightRadius: 60,
  },
  lowerPart: {
    flex: 3,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 70,
    paddingVertical: 60,
  },
  image: {
    width: '70%',
    height: '100%',
  },
  label: {
    fontSize: 16,
    color: '#880e4f',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#880e4f',
    padding: 5,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  // button:{
  //   backgroundColor: '#cc0e74',
  //   padding: 15,
  //   borderRadius: 30,
  //   marginVertical: 10,
  //   width: '95%',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: {width: 0, height: 2},
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 5,
  // },
  spacing: {
    marginBottom: 10, // Adds space below each button
  },
  // spacing1: {
  //   marginBottom: 45, // Adds space below the input
  // },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmailScreen;
