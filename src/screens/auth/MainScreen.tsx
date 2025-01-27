import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import GetIcon from '../../components/GetIcon';

type Props = NativeStackScreenProps<AuthStackParamList, 'MainScreen'>;

export const MainScreen: React.FC<Props> = ({navigation}) => {

  const onLogin = (role: string[]) => {
    navigation.navigate('EmailScreen', {role});
  };

  const onBuyerSignup = () => {
    navigation.navigate('SignUpScreen', {
      role: 'User',
    });
  };

  const onSellerSignup = () => {
    navigation.navigate('SignUpScreen', {
      role: 'Seller',
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/Images/bgimg1.png')} // Path to your background image
      style={styles.backgroundImage}
      resizeMode="cover" // Adjust the resizeMode as needed
    >
      <View style={styles.mainScreen}>
        {/* Upper Part: Logo and Title */}
        <View style={styles.upperPart}>
          <Image
            source={require('../../assets/Images/dncr_pink.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Lower Part: Buttons */}
        <View style={styles.lowerPart}>
          {/* "Already Have an Account?" Text and Login Button */}
          <Text style={styles.promptText}>Already have an account?</Text>
          <TouchableOpacity
            style={[styles.button, styles.spacing]}
            onPress={() => onLogin(['User', 'Seller'])}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          {/* "New Here? Create an Account!" Text and Sign Up Button */}
          <Text style={styles.promptText}>New here? Create an account!</Text>
          <TouchableOpacity
            style={[styles.button, styles.spacing]}
            onPress={onBuyerSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Combined View for "Want to List your Property?" and "Login As Partner" */}
          <View style={styles.combinedButtonContainer}>
            {/* First Button */}
            <TouchableOpacity
              style={styles.listPropertyButton}
              onPress={onSellerSignup}>
              <Text style={styles.listPropertyText}>
                Want to list your property?
              </Text>
            </TouchableOpacity>

            {/* Second Button */}
            <View>
              <TouchableOpacity
                style={styles.button2}
                onPress={() => onLogin(['Partner'])}>
                <GetIcon iconName="partner" color="white" size='45' />
                <Text style={styles.buttonText2}>Login as partner</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mainScreen: {
    flex: 1,
    backgroundColor: 'transparent', // Make the main screen transparent
  },
  upperPart: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // Make the upper part transparent
    borderBottomRightRadius: 60,
  },
  lowerPart: {
    flex: 5,
    justifyContent: 'center',
    backgroundColor: 'transparent', // Make the lower part transparent
    borderTopLeftRadius: 70,
    paddingVertical: 60,
    paddingHorizontal: 20, // Added horizontal padding for better spacing
  },
  image: {
    width: '80%',
    height: '100%',
  },
  spacing: {
    marginTop: 5,
    marginBottom: 45, // Adds space below each button
  },
  promptText: {
    fontSize: 16,
    color: '#cc0e74',
    fontWeight: 'bold',
    textAlign: 'left', // Align text to the left
    paddingLeft: 10, // Add some padding to align with the buttons
  },
  button: {
    backgroundColor: '#cc0e74', // Matching pink button
    padding: 15,
    borderRadius: 30,
    marginVertical: 10,
    width: '100%', // Full width
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  combinedButtonContainer: {
    alignItems: 'center', // Center buttons horizontally
    justifyContent: 'center', // Center buttons vertically
    width: '100%', // Take full width of the parent container
  },
  listPropertyButton: {
    backgroundColor: '#cc0e74', // Example button color
    padding: 18, // Increase padding for height
    borderRadius: 50, // Rounded corners
    width: '80%', // Set width to 80% of the parent container
    alignItems: 'center', // Center text horizontally
    justifyContent: 'center', // Center text vertically
    marginBottom: 16, // Add spacing between buttons
  },
  listPropertyText: {
    color: 'white', // Text color
    fontSize: 16, // Increase font size
    fontWeight: 'bold', // Bold text
  },
  button2: {
    backgroundColor: '#cc0e74', // Button background color
    padding: 8, // Increase padding for height
    borderRadius: 50, // Rounded corners
    width: '85%', // Set width to 80% of the parent container
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center', // Center icon and text vertically
    justifyContent: 'center', // Center the entire group horizontally
  },
  buttonText2: {
    color: 'white', // Text color
    fontSize: 18, // Increase font size
    fontWeight: 'bold', // Bold text
    marginLeft: 10, // Add spacing between icon and text
    alignItems: 'center', // Center icon and text vertically
    justifyContent: 'center', // Center the entire group horizontally
    marginEnd:20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#cc0e74',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#cc0e74',
    padding: 10,
    borderRadius: 5,
    width: '50%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
