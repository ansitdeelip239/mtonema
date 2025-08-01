import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import GetIcon from '../../components/GetIcon';
import Roles from '../../constants/Roles';
import Images from '../../constants/Images';
import {BackgroundWrapper} from '../../components/BackgroundWrapper';
import Colors from '../../constants/Colors';
import {useMaster} from '../../context/MasterProvider';
import {MasterDetailModel} from '../../types';
import HeaderComponent from './components/HeaderComponent';

type Props = NativeStackScreenProps<AuthStackParamList, 'MainScreen'>;

export const MainScreen: React.FC<Props> = ({navigation}) => {
  const {masterData} = useMaster();

  // const onPartnerLogin = () => {
  //   // Partners and admins go to location selection screen
  //   navigation.navigate('PartnerZoneScreen');
  // };

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
      <View style={styles.mainScreen}>
        <HeaderComponent title="MT One" showBackButton={false} />

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
            {/* <Text style={styles.appCrmText}>App & CRM</Text> */}
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <View style={styles.welcomeSection}>
                {/* Empty section, can be used later */}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Already have an account?
                </Text>
                <TouchableOpacity
                  style={[styles.primaryButton, styles.solidButton]}
                  onPress={onBuyerSellerLogin}>
                  <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  New here? Create an account!
                </Text>
                <TouchableOpacity
                  style={[styles.primaryButton, styles.solidButton]}
                  onPress={onBuyerSignup}>
                  <View style={styles.buttonContentRow}>
                    <Text style={styles.buttonText}>Sign Up as Buyer</Text>
                    <GetIcon iconName="home" color="white" size="20" />
                  </View>
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

              {/* <View style={styles.section}>
                <TouchableOpacity
                  style={[styles.primaryButton, styles.partnerButtonSolid]}
                  onPress={onPartnerLogin}>
                  <View style={styles.buttonContentRow}>
                    <GetIcon iconName="partner3" color="white" size="24" />
                    <Text style={styles.buttonText}>
                      Log In as Partner
                    </Text>
                  </View>
                </TouchableOpacity>
              </View> */}
            </View>
          </View>
        </ScrollView>
      </View>
    </BackgroundWrapper>
  );
};

// Update styles to remove header-specific styles
const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 10,
    gap: 40, // Added 60 gap between children
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
  // New style for App & CRM text
  appCrmText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 5,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
    // Add subtle text shadow for emphasis
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

  // Card content styles
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
  solidButton: {
    backgroundColor: Colors.MT_PRIMARY_1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerButtonSolid: {
    backgroundColor: '#3a7bd5', // Using the primary color from the original gradient
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 17,
    fontWeight: '600',
    color: Colors.MT_PRIMARY_1,
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
    width: '100%',
  },
});