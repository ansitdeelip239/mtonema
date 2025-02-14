import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import GetIcon from '../../components/GetIcon';
import Roles from '../../constants/Roles';
import Images from '../../constants/Images';
import {BackgroundWrapper} from '../../components/BackgroundWrapper';

type Props = NativeStackScreenProps<AuthStackParamList, 'MainScreen'>;

export const MainScreen: React.FC<Props> = ({navigation}) => {
  const onLogin = (role: string[]) => {
    navigation.navigate('EmailScreen', {role});
  };

  const onBuyerSignup = () => {
    navigation.navigate('SignUpScreen', {
      role: Roles.BUYER,
    });
  };

  const onSellerSignup = () => {
    navigation.navigate('SignUpScreen', {
      role: Roles.SELLER,
    });
  };

  return (
    <BackgroundWrapper>
      <View style={styles.mainScreen}>
        <View style={styles.upperPart}>
          <Image
            source={Images.DNCR_LOGO}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.lowerPart}>
          <Text style={styles.promptText}>Already have an account?</Text>
          <TouchableOpacity
            style={[styles.button, styles.spacing]}
            onPress={() => onLogin(['User', 'Seller'])}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <Text style={styles.promptText}>New here? Create an account!</Text>
          <TouchableOpacity
            style={[styles.button, styles.spacing]}
            onPress={onBuyerSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.combinedButtonContainer}>
            <TouchableOpacity
              style={styles.listPropertyButton}
              onPress={onSellerSignup}>
              <Text style={styles.listPropertyText}>
                Want to list your property?
              </Text>
            </TouchableOpacity>

            <View>
              <TouchableOpacity
                style={styles.button2}
                onPress={() => onLogin(['Partner'])}>
                <GetIcon iconName="partner3" color="white" size="40" />
                <Text style={styles.buttonText2}>Login as partner</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  upperPart: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderBottomRightRadius: 60,
  },
  lowerPart: {
    flex: 5,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderTopLeftRadius: 70,
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  image: {
    width: '80%',
    height: '100%',
  },
  spacing: {
    marginTop: 5,
    marginBottom: 45,
  },
  promptText: {
    fontSize: 16,
    color: '#cc0e74',
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#cc0e74',
    padding: 16,
    borderRadius: 15,
    marginVertical: 10,
    width: '100%',
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
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  listPropertyButton: {
    backgroundColor: '#cc0e74',
    padding: 15,
    borderRadius: 15,
    width: '78%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  listPropertyText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  button2: {
    backgroundColor: '#cc0e74',
    padding: 6,
    borderRadius: 15,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText2: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: 30,
  },
});
