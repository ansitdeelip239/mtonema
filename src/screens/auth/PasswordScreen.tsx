import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import AuthService from '../../services/AuthService';
import {useAuth} from '../../hooks/useAuth';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<AuthStackParamList, 'PasswordScreen'>;

const PasswordScreen: React.FC<Props> = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {email} = route.params;
  const {storeToken, login} = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    Toast.show({
      type,
      text1: type === 'error' ? 'Error' : 'Success',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
    });
  };

  const validatePassword = (pass: string): boolean => {
    return pass.length >= 6; // Basic validation - password should be at least 6 characters
  };

  const handleContinue = async () => {
    try {
      // First validate password
      if (!password.trim()) {
        showToast('error', 'Please enter your password');
        return;
      }

      if (!validatePassword(password)) {
        showToast('error', 'Password must be at least 6 characters long');
        return;
      }

      setIsLoading(true);
      const response = await AuthService.verifyPassword(email, password);

      if (response.Success) {
        await storeToken(response.data);
        await login(response.data);
        showToast('success', 'Login successful!');
      } else {
        // Handle specific error messages from API
        if (
          response.Message?.toLowerCase().includes('unauthorized') ||
          response.Message?.toLowerCase().includes('invalid')
        ) {
          showToast('error', 'Incorrect password. Please try again.');
        } else {
          showToast(
            'error',
            response.Message || 'Login failed. Please try again.',
          );
        }
      }
    } catch (error) {
      console.error('Error during sign-in:', error);

      // Handle different types of errors
      if (error instanceof Error) {
        if (
          error.message.toLowerCase().includes('unauthorized') ||
          error.message.toLowerCase().includes('invalid')
        ) {
          showToast('error', 'Incorrect password. Please try again.');
        } else if (error.message.toLowerCase().includes('network')) {
          showToast('error', 'Network error. Please check your connection.');
        } else if (error.message.toLowerCase().includes('timeout')) {
          showToast('error', 'Request timed out. Please try again.');
        } else {
          showToast('error', 'Unable to sign in. Please try again.');
        }
      } else {
        showToast('error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.mainScreen}>
      {/* Logo Section */}
      <View style={styles.upperPart}>
        <Image
          source={require('../../assets/Images/houselogo.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Input Section / Lower Part */}
      <View style={styles.lowerPart}>
        <View style={styles.txtpadding}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Enter your password"
              style={styles.input}
              onSubmitEditing={handleContinue}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={
                  showPassword
                    ? require('../../assets/Icon/eye.png')
                    : require('../../assets/Icon/eye-slash.png')
                }
                style={styles.iconImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Forget Password Link */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotText}>Forget Password?</Text>
        </TouchableOpacity>

        {/* Buttons Section */}
        <View style={styles.btnsection}>
          <TouchableOpacity
            style={[styles.button, styles.spacing]}
            onPress={handleContinue}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.spacing, styles.color]}
            onPress={navigation.goBack}
            disabled={isLoading}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Toast Message Component */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  // ... existing styles remain the same
  mainScreen: {
    flex: 1,
    backgroundColor: '#cc0e74',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 15,
  },
  forgotText: {
    fontSize: 16,
    color: '#cc0e74',
  },
  txtpadding: {
    paddingLeft: 15,
    width: '95%',
  },
  btnsection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
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
    paddingVertical: 50,
    paddingHorizontal: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontSize: 20,
    color: '#880e4f',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#880e4f',
    paddingBottom: 8,
  },
  eyeIcon: {
    padding: 10,
  },
  iconImage: {
    width: 24,
    height: 24,
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
    minHeight: 50,
  },
  spacing: {
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  color: {
    backgroundColor: '#790c5a',
  },
});

export default PasswordScreen;
