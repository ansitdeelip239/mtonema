import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import AuthService from '../../services/AuthService';
import {useAuth} from '../../hooks/useAuth';

type Props = NativeStackScreenProps<AuthStackParamList, 'PasswordScreen'>;

const PasswordScreen: React.FC<Props> = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {email} = route.params;
  const {storeToken, login} = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleContinue = async () => {
    console.log('Sign In button pressed');
    console.log('Email:', email);
    console.log('Password:', password);

    try {
      setIsLoading(true);
      const response = await AuthService.verifyPassword(email, password);
      if (response.Success) {
        storeToken(response.data);
        login(response.data);
      } else {
        throw response.Message;
      }
    } catch (error) {
      console.error('Error during sign-in:', (error as Error).message);
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
              placeholder="Password"
              style={styles.input}
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
            onPress={navigation.goBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: '#cc0e74', // Pinkish Background
  },
  forgotPassword: {
    alignSelf: 'flex-end', // Align to the right
    marginTop: 10, // Add space above the "Forget Password" link
    marginRight: 15, // Add some right margin
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
    justifyContent: 'center', // Centers vertically
    alignItems: 'center',
    marginTop: 30, // Add space above the buttons
  },
  upperPart: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cc0e74', // Same as main background
    borderBottomRightRadius: 60,
  },
  lowerPart: {
    flex: 3,
    backgroundColor: '#ffffff', // White background for lower part
    borderTopLeftRadius: 70,
    paddingVertical: 50, // Reduce padding to create more space
    paddingHorizontal: 5, // Add horizontal padding
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontSize: 20,
    color: '#880e4f', // Dark pink
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8, // Adjust padding to avoid extra space
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#880e4f',
    paddingBottom: 8, // Add padding to the container instead of the input
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
    marginBottom: 10, // Adds space below each button
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
