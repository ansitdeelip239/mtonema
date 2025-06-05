import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import Colors from '../../constants/Colors';
import Images from '../../constants/Images';
import Roles from '../../constants/Roles';
import storageKeys from '../../constants/storageKeys';
import {BackgroundWrapper} from '../../components/BackgroundWrapper';
import LinearGradient from 'react-native-linear-gradient';
import HeaderComponent from './components/HeaderComponent';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'UserTypeSelectionScreen'
>;

const UserTypeSelectionScreen: React.FC<Props> = ({navigation}) => {
  const handleUserTypeSelection = async (isPartner: boolean) => {
    try {
      // Store user type in AsyncStorage
      await AsyncStorage.setItem(
        storageKeys.USER_TYPE_KEY,
        isPartner ? Roles.PARTNER : 'User',
      );

      // Navigate based on selection
      if (isPartner) {
        navigation.replace('PartnerZoneScreen');
      } else {
        navigation.replace('MainScreen');
      }
    } catch (error) {
      console.error('Error saving user type:', error);
    }
  };

  return (
    <BackgroundWrapper>
      <View style={styles.mainScreen}>
        <HeaderComponent title="MT Estates" showBackButton={false} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={Images.MTESTATES_LOGO}
              style={styles.image}
              resizeMode="contain"
            />
            {/* Added App & CRM text below logo */}
            <Text style={styles.appCrmText}>App & CRM</Text>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>Welcome!</Text>
                <Text style={styles.subtitleText}>
                  Will you be using the app as a Partner?
                </Text>
              </View>

              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => handleUserTypeSelection(false)}
                  activeOpacity={0.8}>
                  <LinearGradient
                    colors={[Colors.MT_PRIMARY_1, '#2c7fb8']}
                    style={styles.gradientButton}>
                    <Text style={styles.buttonText}>No, I'm a Buyer/Seller</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => handleUserTypeSelection(true)}
                  activeOpacity={0.8}>
                  <View style={styles.buttonContent}>
                    <Text style={styles.secondaryButtonText}>
                      Yes, I'm a Partner
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 10,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  image: {
    width: '80%',
    height: 160,
  },
  appCrmText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 5,
    marginBottom: 50,
    textAlign: 'center',
    letterSpacing: 1,
    ...Platform.select({
      ios: {
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 2,
      },
      android: {
        elevation: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 1,
      },
    }),
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  primaryButton: {
    borderRadius: 15,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Colors.MT_PRIMARY_1,
    borderRadius: 15,
    padding: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.MT_PRIMARY_1,
  },
});

export default UserTypeSelectionScreen;
