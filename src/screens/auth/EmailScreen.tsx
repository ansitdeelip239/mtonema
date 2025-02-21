import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import AuthService from '../../services/AuthService';
import {useAuth} from '../../hooks/useAuth';
import Colors from '../../constants/Colors';
import {useDialog} from '../../hooks/useDialog';
import {MaterialTextInput} from '../../components/MaterialTextInput';
import useForm from '../../hooks/useForm';
import {EmailFormData, emailSchema} from '../../schema/LoginSchema';
import {Button} from 'react-native-paper';

type Props = NativeStackScreenProps<AuthStackParamList, 'EmailScreen'>;

const EmailScreen: React.FC<Props> = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<{
    message: string;
    isClickable?: boolean;
  }>({message: '', isClickable: false});

  const {setNavigateToPostProperty} = useAuth();
  const {showError} = useDialog();
  const {role} = route.params;

  const onSubmit = async (_data: EmailFormData) => {
    // This is just to maintain the form submission structure
    // Actual submission is handled by handleOtpVerification
  };

  const {
    formInput,
    handleInputChange,
    loading: formLoading,
  } = useForm<EmailFormData>({
    initialState: {
      email: '',
    },
    onSubmit,
  });

  const checkEmail = useCallback(
    async (emailToCheck: string) => {
      try {
        setEmailError({message: '', isClickable: false});

        const response = await AuthService.verifyLoginInput(emailToCheck);
        console.log(response.message);

        if (!response.success) {
          setEmailError({
            message: response.message || 'Email verification failed',
            isClickable: false,
          });
          return false;
        }

        if (response && !role.includes(response.data?.userType as string)) {
          showError('Email not found');
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
      const validationResult = emailSchema.safeParse(formInput);
      if (!validationResult.success) {
        setEmailError({
          message: validationResult.error.errors[0].message,
          isClickable: false,
        });
        return;
      }

      setIsLoading(true);
      try {
        if (!skipEmailCheck) {
          const isValidEmail = await checkEmail(formInput.email);
          if (!isValidEmail) {
            return;
          }
        }

        const response = await AuthService.otpVerification(formInput.email);
        if (response.success) {
          console.log('API Response:', response);
          navigation.navigate('OtpScreen', {email: formInput.email});
          if (!skipEmailCheck) {
            setNavigateToPostProperty(false);
          }
        } else {
          showError(response.message || 'Failed to send OTP. Please try again');
        }
      } catch (error) {
        showError('An error occurred while sending OTP.');
      } finally {
        setIsLoading(false);
      }
    },
    [formInput, checkEmail, navigation, setNavigateToPostProperty, showError],
  );

  const handleVerifyNow = useCallback(() => {
    handleOtpVerification(true);
  }, [handleOtpVerification]);

  const handleContinue = useCallback(() => {
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
          <MaterialTextInput
            label="Email"
            placeholder="Please Enter user email"
            field="email"
            formInput={formInput}
            setFormInput={handleInputChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            mode="outlined"
            errorMessage={emailError.message}
          />
        </View>

        <View style={styles.btnsection}>
          {emailError.isClickable ? (
            <Button
              mode="contained"
              onPress={handleVerifyNow}
              disabled={isLoading || formLoading}
              loading={isLoading}
              buttonColor={Colors.main}
              textColor={isLoading || formLoading ? Colors.grey : 'white'}
              style={[
                styles.paperButton,
                (isLoading || formLoading) && styles.disabledButton,
              ]}>
              Verify Now
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleContinue}
              disabled={!formInput.email || isLoading || formLoading}
              loading={isLoading}
              buttonColor={Colors.main}
              textColor={
                !formInput.email || isLoading || formLoading
                  ? Colors.grey
                  : 'white'
              }
              style={[
                styles.paperButton,
                (!formInput.email || isLoading || formLoading) &&
                  styles.disabledButton,
              ]}>
              Continue
            </Button>
          )}

          <Button
            mode="contained"
            onPress={navigation.goBack}
            buttonColor={Colors.main}
            textColor={Colors.white}
            // buttonColor={Colors.main}
            style={styles.paperButton}>
            Back
          </Button>
        </View>
      </View>
      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  disabledButton: {
    opacity: 0.7,
    backgroundColor: Colors.main,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
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
    marginBottom: 16,
  },
  btnsection: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
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
  paperButton: {
    width: '90%',
    marginVertical: 8,
    borderRadius: 15,
    paddingVertical: 5,
  },
});

export default EmailScreen;
