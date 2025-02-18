import React, {useCallback, useState, useMemo} from 'react';
import {
  View,
  Text,
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
import {validateEmail} from '../../utils/formvalidation';
import Colors from '../../constants/Colors';
import {useDialog} from '../../hooks/useDialog';
import {TextInput} from 'react-native-paper';

type Props = NativeStackScreenProps<AuthStackParamList, 'EmailScreen'>;

const EmailScreen: React.FC<Props> = ({navigation, route}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<{
    message: string;
    isClickable?: boolean;
  }>({message: '', isClickable: false});
  const {setNavigateToPostProperty} = useAuth();
  const {showError} = useDialog();
  const isEmailValid = useMemo(() => validateEmail(email), [email]);
  const {role} = route.params;

  const checkEmail = useCallback(
    async (emailToCheck: string) => {
      try {
        setEmailError({message: '', isClickable: false});

        const response = await AuthService.verifyLoginInput(emailToCheck);
        console.log(response.Message);

        if (!response.Success) {
          setEmailError({
            message: response.Message || 'Email verification failed',
            isClickable: false,
          });
          return false;
        }

        if (response && !role.includes(response.data?.Role as string)) {
          showError('Email not found');
          return false;
        }

        if (response && response.data?.Status === 2) {
          setEmailError({
            message: 'Email is not verified. Click Verify Now to proceed.',
            isClickable: true,
          });
          return false;
        }

        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred';
        setEmailError({message: errorMessage, isClickable: false});
        return false;
      }
    },
    [role, showError],
  );

  const handleOtpVerification = useCallback(
    async (skipEmailCheck = false) => {
      if (!isEmailValid) {
        setEmailError({message: 'Invalid email format', isClickable: false});
        return;
      }

      setIsLoading(true);
      try {
        // Skip email check for verify now button
        if (!skipEmailCheck) {
          const isValidEmail = await checkEmail(email);

          if (!isValidEmail) {
            //Temporarily disabled for email restriction
            // return;
          }
        }

        const response = await AuthService.OtpVerification(email);
        if (response.Success) {
          console.log('API Response:', response);

          navigation.navigate('OtpScreen', {email});
          if (!skipEmailCheck) {
            setNavigateToPostProperty(false);
          }
        } else {
          showError(response.Message || 'Failed to send OTP. Please try again');
        }
      } catch (error) {
        showError('An error occurred while sending OTP.');
      } finally {
        setIsLoading(false);
      }
    },
    [
      email,
      isEmailValid,
      checkEmail,
      navigation,
      setNavigateToPostProperty,
      showError,
    ],
  );

  const handleVerifyNow = useCallback(async () => {
    handleOtpVerification(true);
  }, [handleOtpVerification]);

  const handleContinue = useCallback(async () => {
    handleOtpVerification();
  }, [handleOtpVerification]);

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
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>LOGIN</Text>
        </View>
        <View style={styles.txtpadding}>
          <TextInput
            label="Email"
            placeholder="Please Enter user email"
            mode="outlined"
            placeholderTextColor={Colors.placeholderColor}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={[styles.input, !isEmailValid && styles.inputError]}
            theme={{
              roundness: 8,
              colors: {
                background: 'white',
                primary: '#880e4f',
                text: '#000',
                placeholder: Colors.placeholderColor,
              },
            }}
          />
          {emailError.message ? (
            <Text style={styles.errorText}>{emailError.message}</Text>
          ) : null}
        </View>

        <View style={styles.btnsection}>
          {emailError.isClickable ? (
            <TouchableOpacity
              style={[styles.button, styles.spacing, styles.verifyButton]}
              onPress={handleVerifyNow}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Verify Now</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.button,
                styles.spacing,
                !isEmailValid && styles.disabledButton,
              ]}
              onPress={handleContinue}
              disabled={!isEmailValid || isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </TouchableOpacity>
          )}

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
  disabledButton: {
    backgroundColor: Colors.main,
    opacity: 0.6,
  },
  titleContainer: {
    left: 150,
    bottom: 30,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#880e4f',
    letterSpacing: 1,
  },
  verifyButton: {
    backgroundColor: Colors.main,
  },
  mainScreen: {
    flex: 1,
    backgroundColor: '#cc0e74',
  },
  button: {
    backgroundColor: '#cc0e74',
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 50,
  },
  color: {
    backgroundColor: Colors.main,
  },
  txtpadding: {
    paddingLeft: 25,
    width: '95%',
    marginBottom: 40,
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
  input: {
    backgroundColor: 'transparent',
    fontSize: 16,
    color: '#000000',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  inputError: {
    borderColor: 'red',
  },
  spacing: {
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmailScreen;
