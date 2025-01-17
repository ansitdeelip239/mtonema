import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'MainScreen'>;
export const MainScreen: React.FC<Props> = ({navigation}) => {
  const onLogin = () => {
    navigation.navigate('EmailScreen');
  };
  const onSignup = () => {
    navigation.navigate('SignUpScreen');
  };
  const onListProperty = () => {
    navigation.navigate('ContactScreen');
  };
  return (
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
        <Text style={styles.promptText}>Already Have an Account?</Text>
        <TouchableOpacity
          style={[styles.button, styles.spacing]}
          onPress={onLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <Text style={styles.promptText}>New Here? Create an Account!</Text>
        <TouchableOpacity
          style={[styles.button, styles.spacing]}
          onPress={onSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.listPropertyText, styles.spacing]}
          onPress={onListProperty}>
          <Text style={styles.listPropertyText}>
            Want to List your Property?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainScreen: {
    flex: 2,
    backgroundColor: '#fff', // Pinkish Background
  },
  upperPart: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Same as main background
    borderBottomRightRadius: 60,
  },
  lowerPart: {
    flex: 5,
    justifyContent: 'center',
    backgroundColor: '#ffffff', // White background for lower part
    borderTopLeftRadius: 70,
    paddingVertical: 60,
    paddingLeft: 10,
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
    paddingLeft: 20,
  },
  button: {
    backgroundColor: '#cc0e74', // Matching pink button
    padding: 15,
    borderRadius: 30,
    marginVertical: 10,
    width: '95%',
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
  listPropertyText: {
    marginTop: 80,
    fontSize: 16,
    color: '#cc0e74',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
