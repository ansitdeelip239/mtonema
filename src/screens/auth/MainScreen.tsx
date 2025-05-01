import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import GetIcon from '../../components/GetIcon';
import Roles from '../../constants/Roles';
import Images from '../../constants/Images';
import {BackgroundWrapper} from '../../components/BackgroundWrapper';
import Colors from '../../constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import {useMaster} from '../../context/MasterProvider';
import { MasterDetailModel } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'MainScreen'>;

export const MainScreen: React.FC<Props> = ({navigation}) => {
  const {masterData} = useMaster();

  const onPartnerLogin = () => {
    // Partners and admins go to location selection screen
    navigation.navigate('PartnerZoneScreen', {
      role: [Roles.PARTNER, Roles.ADMIN],
    });
  };

  const onBuyerSellerLogin = () => {
    const individualLocation = masterData?.PartnerLocation?.find(
      location => location.masterDetailName === 'Individual',
    );

    navigation.navigate('EmailScreen', {
      role: [Roles.BUYER, Roles.SELLER],
      location: individualLocation as MasterDetailModel,
    });
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
      <SafeAreaView style={styles.mainScreen}>
        <StatusBar
          backgroundColor={Colors.MT_PRIMARY_1}
          barStyle="light-content"
        />

        {/* Add header here */}
        <LinearGradient
          colors={[Colors.MT_PRIMARY_1, '#1e5799']}
          style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.spacer} />
            <Text style={styles.headerText}>App & CRM</Text>
            <View style={styles.spacer} />
          </View>
        </LinearGradient>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={Images.MTESTATES_LOGO}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <View style={styles.welcomeSection}>
                {/* <Text style={styles.subtitleText}>
                  Find your perfect property
                </Text> */}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Already have an account?
                </Text>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={onBuyerSellerLogin}>
                  <LinearGradient
                    colors={[Colors.MT_PRIMARY_1, '#2c7fb8']}
                    style={styles.gradientButton}>
                    <Text style={styles.buttonText}>Log In</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  New here? Create an account!
                </Text>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={onBuyerSignup}>
                  <LinearGradient
                    colors={[Colors.MT_PRIMARY_1, '#2c7fb8']}
                    style={styles.gradientButton}>
                    <Text style={styles.buttonText}>Sign Up as Buyer</Text>
                    <GetIcon iconName="home" color="white" size="20" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Want to list your property?
                </Text>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={onSellerSignup}>
                  <View style={styles.buttonContent}>
                    <GetIcon
                      iconName="property"
                      color={Colors.MT_PRIMARY_1}
                      size="20"
                    />
                    <Text style={styles.secondaryButtonText}>
                      Sign Up as Seller
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.partnerButton}
                  onPress={onPartnerLogin}>
                  <LinearGradient
                    colors={['#3a7bd5', '#00d2ff']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.gradientPartnerButton}>
                    <GetIcon iconName="partner3" color="white" size="24" />
                    <Text style={styles.partnerButtonText}>
                      Log In as Partner
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  // Add header styles
  spacer: {
    width: 24,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Change from 20:10 to 50:20
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20, // Change from 22 to 20
    fontWeight: 'bold',
    color: 'white',
  },

  // Your existing styles
  mainScreen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 10, // Add space between header and content
  },
  logoContainer: {
    height: 200, // Slightly smaller to account for header
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  image: {
    width: '80%',
    height: 220, // Adjust height slightly
  },

  // Rest of your existing styles remain the same
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
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.MT_PRIMARY_1,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
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
    marginRight: 8,
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
    color: Colors.MT_PRIMARY_1,
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
    width: '100%',
  },
  partnerButton: {
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
  gradientPartnerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 15,
  },
  partnerButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});
