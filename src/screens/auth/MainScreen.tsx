import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, ImageBackground } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigator/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'MainScreen'>;

export const MainScreen: React.FC<Props> = ({ navigation }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const onLogin = () => {
    navigation.navigate('EmailScreen');
  };

  const onSignup = () => {
    navigation.navigate('SignUpScreen');
  };

  const onListProperty = () => {
    navigation.navigate('SellerSignupScreen');
  };

  const onLoginAsPartner = () => {
    setPopupVisible(true); // Show the popup
  };

  const closePopup = () => {
    setPopupVisible(false); // Hide the popup
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
          <Text style={styles.promptText}>Already Have an Account?</Text>
          <TouchableOpacity
            style={[styles.button, styles.spacing]}
            onPress={onLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          {/* "New Here? Create an Account!" Text and Sign Up Button */}
          <Text style={styles.promptText}>New Here? Create an Account!</Text>
          <TouchableOpacity
            style={[styles.button, styles.spacing]}
            onPress={onSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Combined View for "Want to List your Property?" and "Login As Partner" */}
          <View style={styles.combinedButtonContainer}>
            <TouchableOpacity
              style={styles.listPropertyButton}
              onPress={onListProperty}>
              <Text style={styles.listPropertyText}>Want to List your Property?</Text>
            </TouchableOpacity>
            <View>
              <TouchableOpacity
                style={styles.button2}
                onPress={onLoginAsPartner}>
                <Text style={styles.buttonText2}>Login As Partner</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Popup Modal */}
        <Modal
          visible={isPopupVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closePopup}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>This is under development</Text>
              <TouchableOpacity style={styles.modalButton} onPress={closePopup}>
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    shadowOffset: { width: 0, height: 2 },
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
    alignItems: 'center', // Center the buttons horizontally
    marginTop: 20, // Add some space above the combined buttons
  },
  listPropertyButton: {
    backgroundColor: 'transparent', // No background color
    padding: 10,
    borderRadius: 30,
    width: '70%', // Smaller width
    alignItems: 'center',
    borderWidth: 1, // Add border
    borderColor: '#cc0e74', // Pink border color
  },
  listPropertyText: {
    fontSize: 16,
    color: '#cc0e74',
    fontWeight: 'bold',
  },
  button2: {
    backgroundColor: '#cc0e74',
    padding: 10,
    width: '70%', // Same width as the "Want to List your Property?" button
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10, // No gap between buttons
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText2: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
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
