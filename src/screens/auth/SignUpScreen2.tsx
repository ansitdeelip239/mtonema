import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  View,
} from 'react-native';
import {Button} from 'react-native-paper';
import {BackgroundWrapper} from '../../components/BackgroundWrapper';
import {MaterialTextInput} from '../../components/MaterialTextInput';
import useForm from '../../hooks/useForm';
import SignUpFormSchema, {
  SignupFormType,
  signupSubmissionSchema,
} from '../../schema/SignUpFormSchema';
import {z} from 'zod';
import Colors from '../../constants/Colors';
import {useKeyboard} from '../../hooks/useKeyboard';
import {useDialog} from '../../hooks/useDialog';
import AuthService from '../../services/AuthService';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Roles, {RoleTypes} from '../../constants/Roles';
import {AuthStackParamList} from '../../navigator/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUpScreen'>;

const SignUpScreen: React.FC<Props> = ({navigation, route}) => {
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormType, string>>
  >({});
  const {keyboardVisible} = useKeyboard();
  const {showError} = useDialog();

  const initialState: SignupFormType = {
    name: '',
    email: '',
    location: '',
    phone: '',
  };

  const validateField = (field: keyof SignupFormType, value: string) => {
    try {
      const fieldSchema = SignUpFormSchema.pick({[field]: true} as Record<
        typeof field,
        true
      >);
      fieldSchema.parse({[field]: value});
      setErrors(prev => ({...prev, [field]: undefined}));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors[0]?.message || 'Invalid input';
        setErrors(prev => ({...prev, [field]: fieldError}));
      }
      return false;
    }
  };

  const {
    formInput,
    handleInputChange,
    loading,
    onSubmit: handleSubmit,
  } = useForm<SignupFormType>({
    initialState,
    onSubmit: async formData => {
      try {
        const role = (route.params?.role || Roles.BUYER) as
          | RoleTypes['BUYER']
          | RoleTypes['SELLER'];
        const validatedData = SignUpFormSchema.parse(formData);
        const signupData = signupSubmissionSchema(role).parse(validatedData);

        const response = await AuthService.userSignUp(signupData);

        if (response.success || response.httpStatus === 409) {
          await AuthService.otpVerification(formData.email);
          navigation.navigate('OtpScreen', {email: formData.email});
        } else {
          showError(response.message);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Partial<Record<keyof SignupFormType, string>> = {};
          error.errors.forEach(err => {
            if (err.path[0]) {
              newErrors[err.path[0] as keyof SignupFormType] = err.message;
            }
          });
          setErrors(newErrors);
        }
        showError('Please check your input and try again');
      }
    },
  });

  const handleFieldChange = (
    field: keyof SignupFormType,
    value: string | boolean,
  ) => {
    if (typeof value === 'string') {
      validateField(field, value);
      handleInputChange(field, value);
    }
  };

  return (
    <BackgroundWrapper>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContainer,
              // eslint-disable-next-line react-native/no-inline-styles
              {paddingBottom: keyboardVisible ? 60 : 120},
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/Images/dncr_pink.png')}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            <MaterialTextInput<SignupFormType>
              style={styles.input}
              label="Full Name*"
              field="name"
              formInput={formInput}
              setFormInput={handleFieldChange}
              mode="outlined"
              placeholder="Enter your full name"
              errorMessage={errors.name}
            />

            <MaterialTextInput<SignupFormType>
              style={styles.input}
              label="Email*"
              field="email"
              formInput={formInput}
              setFormInput={handleFieldChange}
              mode="outlined"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              errorMessage={errors.email}
            />

            <MaterialTextInput<SignupFormType>
              style={styles.input}
              label="Location*"
              field="location"
              formInput={formInput}
              setFormInput={handleFieldChange}
              mode="outlined"
              placeholder="Enter your location"
              errorMessage={errors.location}
            />

            <MaterialTextInput<SignupFormType>
              style={styles.input}
              label="Phone Number*"
              field="phone"
              formInput={formInput}
              setFormInput={handleFieldChange}
              mode="outlined"
              placeholder="Enter your phone number"
              keyboardType="number-pad"
              maxLength={10}
              errorMessage={errors.phone}
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              buttonColor={Colors.main}
              textColor="white"
              loading={loading}
              style={styles.button}>
              Sign Up
            </Button>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    flexGrow: 1,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  image: {
    width: 180,
    height: 180,
  },
});

export default SignUpScreen;
