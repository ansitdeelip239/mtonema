import React, {useCallback, useState, useMemo} from 'react';
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
import {validateEmail} from '../../utils/formvalidation';
import Colors from '../../constants/Colors';
type Props = NativeStackScreenProps<AuthStackParamList, 'EmailScreen'>;

const EmailScreen: React.FC<Props> = ({navigation, route}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<{ message: string; isClickable?: boolean }>({ message: '', isClickable: false });
  const {storeUser,setNavigateToPostProperty} = useAuth();
  const {role} = route.params;

  const isEmailValid = useMemo(() => validateEmail(email), [email]);

  const checkEmail = useCallback(
    async (emailToCheck: string) => {
      try {
        // Clear previous errors
        setEmailError({ message: '', isClickable: false });

        // Validate email format first
        if (!isEmailValid) {
          setEmailError({ message: 'Invalid email format', isClickable: false });
          return false;
        }

        const response = await AuthService.verifyLoginInput(emailToCheck);
 console.log(response.Message);
        // Check if email matches the expected role
        if (response && !role.includes(response.data?.Role as string)) {
          setEmailError({ message: '*Email not found', isClickable: false });
          return false;
        }

        // Check if email is not verified
        if (response && response.data?.Status === 2) {
          setEmailError({ message: 'Email is not verified. Please verify your email.', isClickable: true });
          return false;
        }

        if (!response.Success) {
          setEmailError({ message: response.Message || 'Email verification failed', isClickable: false });
          return false;
        }

        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred';

        setEmailError({ message: errorMessage, isClickable: false });
        return false;
      }
    },
    [role, isEmailValid],
  );

const handleContinue = useCallback(async () => {
  if (!isEmailValid) {
    setEmailError({message: 'Invalid email format', isClickable: false});
    return;
  }

  try {
    setIsLoading(true);
    const isValidEmail = await checkEmail(email);

    if (isValidEmail) {
      // Store user data and navigate to password screen
      const response = await AuthService.verifyLoginInput(email);
      console.log('API Response:', response.data, 'Role: ', role);

      storeUser(response.data as User);
      navigation.navigate('PasswordScreen', {email});
    } else if (emailError.isClickable) {
      // If email is unverified, navigate to OTP screen
      navigation.navigate('OtpScreen', {email});
    }
    setNavigateToPostProperty(false);
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
}, [email, isEmailValid, checkEmail, storeUser, navigation, role, emailError,setNavigateToPostProperty]);

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
            placeholderTextColor={Colors.placeholderColor}
            value={email}
            onChangeText={setEmail}
            style={[styles.input, !isEmailValid && styles.inputError]}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {emailError.message ? (
            <Text style={styles.errorText}>
              {emailError.message}
              {emailError.isClickable}
            </Text>
          ) : null}
        </View>

        <View style={styles.btnsection}>
          <TouchableOpacity
            style={[styles.button, styles.spacing]}
            onPress={handleContinue}
            disabled={isLoading || !isEmailValid}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>
                {emailError.message && emailError.isClickable
                  ? 'Verify Email Now'
                  : 'Continue'}
              </Text>
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
    color: '#000000',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  inputError: {
    borderBottomColor: 'red',
  },
  spacing: {
    marginBottom: 10, // Adds space below each button
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  verifyNowText: {
    color: 'blue',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default EmailScreen;
