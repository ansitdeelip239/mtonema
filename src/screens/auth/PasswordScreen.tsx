import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigator/AuthNavigator';
import AuthService from '../../services/AuthService';
import { useAuth } from '../../hooks/useAuth';
import Toast from 'react-native-toast-message';
import Colors from '../../constants/Colors';
import { useDialog } from '../../hooks/useDialog';
import GetIcon from '../../components/GetIcon';

type Props = NativeStackScreenProps<AuthStackParamList, 'PasswordScreen'>;

const PasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { email } = route.params;
  const { storeToken, login } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { showError } = useDialog();

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

  const validatePassword = (pass: string): boolean => pass.length >= 5;

  const handleContinue = async () => {
    if (!password.trim()) {
      showToast('error', 'Please enter your password');
      return;
    }

    if (!validatePassword(password)) {
      showError('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      const response = await AuthService.verifyPassword(email, password);

      if (response.Success) {
        await storeToken(response.data);
        await login(response.data);
        showToast('success', 'Login successful!');
      } else {
        showError('Please enter a valid Password');
      }
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      showError('An error occurred while verifying the password. Please try again.');
    }
     finally {
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
          <TextInput
            label="Password"
            mode="outlined"
            placeholder="Please enter password"
            placeholderTextColor={Colors.placeholderColor}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            returnKeyType="done"
            autoCapitalize="none"
            autoCorrect={false}
            right={
              <TextInput.Icon
              // eslint-disable-next-line react/no-unstable-nested-components
              icon={() => (
                <GetIcon
                  iconName={showPassword ? 'eye' : 'crosseye'}
                  size="25"
                  color={Colors.black}
                />
              )}
              onPress={() => setShowPassword(!showPassword)}
            />
              // <GetIcon iconName="back" size="24" color={Colors.SECONDARY_3} />
            }
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
        </View>

        {/* Forget Password Link */}
        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('ForgetPassword')}>
          <Text style={styles.forgotText}>Forget Password?</Text>
        </TouchableOpacity>

        {/* Buttons Section */}
        <View style={styles.btnsection}>
        <TouchableOpacity
  style={[
    styles.button,
    styles.spacing,
    // eslint-disable-next-line react-native/no-inline-styles
    {
      backgroundColor: isLoading || !validatePassword(password) ? '#e0a1c2' : '#cc0e74',
    },
  ]}
  onPress={handleContinue}
  disabled={isLoading || !validatePassword(password)}
>
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

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingHorizontal: 15,
    width: '100%',
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
  input: {
    backgroundColor: 'white',
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#cc0e74',
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
    backgroundColor: Colors.main,
  },
});

export default PasswordScreen;
