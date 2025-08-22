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
import {useTranslation} from 'react-i18next';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import Colors from '../../constants/Colors';
import HeaderComponent from './components/HeaderComponent';
import Images from '../../constants/Images';
import Roles from '../../constants/Roles';
import LanguageSwitcherButton from './LanguageSwitcherButton';

type Props = NativeStackScreenProps<AuthStackParamList, 'PartnerLoginScreen'>;

const PartnerLoginScreen: React.FC<Props> = ({navigation}) => {
  const {t} = useTranslation();

  const translations = {
    appTitle: t('screens.partnerLoginScreen.appTitle'),
    welcomePartner: t('screens.partnerLoginScreen.welcomePartner'),
    signInToDashboard: t('screens.partnerLoginScreen.signInToDashboard'),
    continueToLogin: t('screens.partnerLoginScreen.continueToLogin'),
    getStartedFree: t('screens.partnerLoginScreen.getStartedFree'),
    securePartnerAccess: t('screens.partnerLoginScreen.securePartnerAccess'),
  };

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
      {/* Language Switcher */}

      {!isIOS && <HeaderComponent title={translations.appTitle} />}

      <View style={styles.mainContent}>
        <View style={styles.languageSwitcherContainer}>
          <LanguageSwitcherButton textColor={Colors.MT_PRIMARY_1} />
        </View>
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
            <Text style={styles.welcomeTitle}>
              {translations.welcomePartner}
            </Text>
            <View style={styles.titleUnderline} />
          </View>
          <Text style={styles.subtitle}>{translations.signInToDashboard}</Text>
        </View>

        {/* Login Button Section */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={isIOS ? styles.simpleIOSButton : styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}>
            <View style={isIOS ? null : styles.solidButton}>
              <Text
                style={isIOS ? styles.simpleIOSButtonText : styles.buttonText}>
                {translations.continueToLogin}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.freeLink}
            onPress={() =>
              navigation.navigate('SignUpScreen', {role: Roles.PARTNER})
            }
            activeOpacity={0.6}>
            <Text style={styles.freeLinkText}>
              {translations.getStartedFree}
            </Text>
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <View style={styles.divider} />
            <Text style={styles.infoText}>
              {translations.securePartnerAccess}
            </Text>
            <View style={styles.divider} />
          </View>
        </View>
      </View>

      <View style={styles.bottomAccent}>
        <View style={styles.solidAccent} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MT_SECONDARY_3,
  },
  languageSwitcherContainer: {
    // position: 'absolute',
    // top: Platform.OS === 'ios' ? 60 : 20,
    // right: 20,
    // zIndex: 1000,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 40 : 20, // Add space for language switcher
  },
  logoSection: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingTop: 20,
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
  solidButton: {
    backgroundColor: Colors.MT_PRIMARY_1,
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
  // iOS button styles
  simpleIOSButton: {
    borderRadius: 12,
    backgroundColor: Colors.MT_PRIMARY_1,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    minHeight: 50,
    zIndex: 1,
    elevation: 0,
    borderWidth: 2,
    borderColor: Colors.MT_PRIMARY_2,
  },
  simpleIOSButtonText: {
    color: Colors.MT_SECONDARY_3,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  freeLink: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  freeLinkText: {
    color: Colors.MT_PRIMARY_1,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
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
  solidAccent: {
    flex: 1,
    backgroundColor: Colors.MT_PRIMARY_2,
  },
});

export default PartnerLoginScreen;
