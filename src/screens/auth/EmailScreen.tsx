import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
// import Colors from '../../constants/Colors';
import AuthService from '../../services/AuthService';
import Toast from 'react-native-toast-message';
import {useAuth} from '../../hooks/useAuth';
import {User} from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'EmailScreen'>;

const EmailScreen: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {storeUser} = useAuth();

  const handleContinue = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Check if the email is valid
    if (!emailRegex.test(email)) {
      // Show toast if email is invalid
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address.',
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await AuthService.verifyLoginInput(email);
      console.log('response', response);
      storeUser(response.data as User);
      if (response.Success) {
        navigation.navigate('PasswordScreen', {email});
      } else {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error',
          text2: 'Invalid email. Please try again.',
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    } catch (error) {
      console.error(error);
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
          <Text style={styles.label}>Email or Mobile</Text>
          <TextInput
            placeholder="Email or Mobile"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, styles.spacing1]}
          />
        </View>
        {/* Buttons Section */}
        <View style={styles.btnsection}>
          <TouchableOpacity
            style={[styles.button, styles.spacing]}
            onPress={handleContinue}
            disabled={isLoading}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.spacing, styles.color]}
            onPress={navigation.goBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Toast Component */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: '#cc0e74', // Pinkish Background
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
  },
  spacing: {
    marginBottom: 10, // Adds space below each button
  },
  spacing1: {
    marginBottom: 45, // Adds space below the input
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmailScreen;
