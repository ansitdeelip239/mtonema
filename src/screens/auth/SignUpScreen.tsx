import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import SignupForm from '../../components/SignupForm';
import {SignUpRequest} from '../../types';
import AuthService from '../../services/AuthService';
import Toast from 'react-native-toast-message';
import { ImageBackground, KeyboardAvoidingView, Platform, StyleSheet ,View ,Image} from 'react-native';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUpScreen'>;

const SignUpScreen: React.FC<Props> = ({navigation, route}) => {
  const {role} = route.params;
  const [loading, setLoading] = useState(false);

  const handleSignup = async (formData: SignUpRequest, isSeller: boolean) => {
    try {
      setLoading(true);
      const response = isSeller
        ? await AuthService.RegisterSeller(formData)
        : await AuthService.signUp(formData);
      console.log('API Response:', response);

      if (response.Success && response.Message !== 'Email already exists') {
        navigation.navigate('OtpScreen', {email: formData.Email});
      } else {
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
    <ImageBackground
      source={require('../../assets/Images/bgimg1.png')} // Path to your background image
      style={styles.backgroundImage}
      resizeMode="cover" // Adjust the resizeMode as needed
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
          {/* Upper Part: Logo */}
          <View style={styles.upperPart}>
            <Image
              source={require('../../assets/Images/dncr_pink.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          {/* Form */}
          <SignupForm
            handleSignup={(formData: SignUpRequest) =>
              handleSignup(formData, role !== 'User')
            }
            loading={loading}
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
