import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import Colors from '../../constants/Colors';
import {getGradientColors} from '../../utils/colorUtils';
import HeaderComponent from './components/HeaderComponent';
import Images from '../../constants/Images';
import Roles from '../../constants/Roles';

type Props = NativeStackScreenProps<AuthStackParamList, 'PartnerLoginScreen'>;

const PartnerLoginScreen: React.FC<Props> = ({navigation}) => {
  // For demo, partnerLocation can be null or a dummy object if needed
  const partnerLocation = null;

  const handleLogin = () => {
    navigation.navigate('EmailScreen', {
      role: [Roles.PARTNER, Roles.ADMIN, Roles.TEAM],
      location: partnerLocation,
    });
  };

  const isIOS = Platform.OS === 'ios';

  return (
    <View style={styles.container}>
      <HeaderComponent
        title="MT One: App & CRM"
        gradientColors={getGradientColors(Colors.MT_PRIMARY_1)}
      />

      {/* Main Content Container */}
      <View style={styles.mainContent}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Image
              source={Images.MTESTATES_LOGO}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.welcomeTitle}>Welcome Partner</Text>
            <View style={styles.titleUnderline} />
          </View>
          <Text style={styles.subtitle}>Sign in to access your dashboard</Text>
        </View>

        {/* Login Button Section */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={isIOS ? styles.loginButtonIOS : styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}>
            <LinearGradient
              colors={[Colors.MT_PRIMARY_1, Colors.MT_SECONDARY_1]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={isIOS ? styles.buttonGradientIOS : styles.buttonGradient}>
              <Text style={isIOS ? styles.buttonTextIOS : styles.buttonText}>
                Continue to Login
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Secondary Info */}
          <View style={styles.infoContainer}>
            <View style={styles.divider} />
            <Text style={styles.infoText}>Secure Partner Access</Text>
            <View style={styles.divider} />
          </View>
        </View>
      </View>

      {/* Bottom Accent */}
      <View style={styles.bottomAccent}>
        <LinearGradient
          colors={[Colors.MT_PRIMARY_2, Colors.MT_SECONDARY_3]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.accentGradient}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MT_SECONDARY_3,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logoSection: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  logoContainer: {
    backgroundColor: Colors.MT_SECONDARY_3,
    borderRadius: 20,
    padding: 20,
  },
  logo: {
    width: 280,
    height: 140,
  },
  welcomeSection: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.MT_PRIMARY_1,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: Colors.MT_PRIMARY_2,
    borderRadius: 2,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.MT_SECONDARY_2,
    textAlign: 'center',
    fontWeight: '400',
    opacity: 0.8,
  },
  buttonSection: {
    flex: 0.3,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  
  // Android/Default button styles
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
    elevation: 8,
  },
  buttonGradient: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.MT_SECONDARY_3,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // iOS-specific button styles
  loginButtonIOS: {
    borderRadius: 14, // Slightly smaller radius for iOS
    overflow: 'visible', // Changed from 'hidden' to allow shadow visibility
    marginBottom: 32,
    shadowColor: '#000000', // Changed to black for better visibility
    shadowOffset: {
      width: 0,
      height: 6, // Increased shadow offset
    },
    shadowOpacity: 0.4, // Increased opacity
    shadowRadius: 10, // Increased radius for more prominent shadow
    // Add a more visible border
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    // Add background color to ensure button is visible
    backgroundColor: 'transparent',
  },
  buttonGradientIOS: {
    borderRadius: 13, // Slightly smaller to account for border
    paddingVertical: 20, // Slightly more padding for iOS
    paddingHorizontal: 36,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56, // Ensure minimum touch target size for iOS
    // Ensure gradient is visible
    overflow: 'hidden',
  },
  buttonTextIOS: {
    color: Colors.MT_SECONDARY_3,
    fontSize: 17, // iOS standard button text size
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.2, // Tighter letter spacing for iOS
  },

  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.MT_PRIMARY_2,
    opacity: 0.4,
  },
  infoText: {
    fontSize: 14,
    color: Colors.MT_SECONDARY_2,
    fontWeight: '500',
    marginHorizontal: 16,
    textAlign: 'center',
  },
  bottomAccent: {
    height: 8,
  },
  accentGradient: {
    flex: 1,
  },
});

export default PartnerLoginScreen;