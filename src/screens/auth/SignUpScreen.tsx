import React, {useState, useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import SignupForm from '../../components/SignupForm';
import AuthService from '../../services/AuthService';
import Toast from 'react-native-toast-message';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Image,
  FlatList,
  Keyboard,
} from 'react-native';
import {useAuth} from '../../hooks/useAuth';
import {
  signupSubmissionSchema,
  SignupBody,
  SignupFormType,
} from '../../schema/SignUpFormSchema';
import {useDialog} from '../../hooks/useDialog';
import Roles from '../../constants/Roles';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUpScreen'>;

const SignUpScreen: React.FC<Props> = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const emailExistMessage = ['Email already exist', 'Email already exists'];
  const {setNavigateToPostProperty} = useAuth();
  const {showError} = useDialog();
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

  const handleSignup = async (formData: SignupFormType) => {
    try {
      setLoading(true);
      const userrole =
        route.params.role === Roles.BUYER ? Roles.BUYER : Roles.SELLER;

      // Convert formDataWithRole (with Role) to SignupBody using apiSubmissionSchema
      const signupBody: SignupBody =
        signupSubmissionSchema(userrole).parse(formData);

      const response = await AuthService.UserSignUp(signupBody);
      console.log('API Response:', response);

      if (response.success && !emailExistMessage.includes(response.message)) {
        await AuthService.OtpVerification(formData.email);
        setNavigateToPostProperty(true);
        navigation.navigate('OtpScreen', {email: formData.email});
      } else {
        showError(response.message);
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
    <ImageBackground
      source={require('../../assets/Images/bgimg1.png')} // Path to your background image
      style={styles.backgroundImage}
      resizeMode="cover" // Adjust the resizeMode as needed
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust this value as needed
      >
        <FlatList
          data={[]} // No data since we're not rendering a list
          ListHeaderComponent={
            <>
              {/* Upper Part: Logo */}
              {!isKeyboardVisible && (
                <View style={styles.upperPart}>
                  <Image
                    source={require('../../assets/Images/dncr_pink.png')}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
              )}
              {/* Form */}
              <SignupForm
                handleSignup={(formData: SignupFormType) =>
                  handleSignup(formData)
                }
                loading={loading}
              />
            </>
          }
          renderItem={null} // No items to render
          keyExtractor={(item, index) => index.toString()} // Fixed keyExtractor
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled" // Ensure taps outside the keyboard dismiss it
        />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flexGrow: 1, // Ensure the container expands to fill the available space
    overflow: 'hidden',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  upperPart: {
    alignItems: 'center',
  },
  image: {
    width: 180, // Adjust the width as needed
    height: 180, // Adjust the height as needed
  },
});
