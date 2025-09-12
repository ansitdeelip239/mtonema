import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
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
import LanguageSwitcherButton from './LanguageSwitcherButton';
import {useTranslation} from 'react-i18next';
import {isCurrentLanguageRTL} from '../../i18n';

const {width} = Dimensions.get('window');

type Props = NativeStackScreenProps<AuthStackParamList, 'MainScreen'>;

export const MainScreen: React.FC<Props> = ({navigation}) => {
  const {masterData} = useMaster();
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState<'buyerSeller' | 'partner'>(
    'partner',
  );
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const isRTL = isCurrentLanguageRTL();
  const isIOS = Platform.OS === 'ios';

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

  const onPartnerLogin = () => {
    navigation.navigate('EmailScreen', {
      role: [Roles.PARTNER, Roles.ADMIN, Roles.TEAM],
      location: null,
    });
  };

  const onPartnerSignup = () => {
    navigation.navigate('PartnerSignUpScreen', {role: Roles.PARTNER});
  };

  const switchTab = (tab: 'buyerSeller' | 'partner') => {
    if (tab === activeTab) {
      return;
    }

    // Fixed animation logic for proper indicator positioning
    const toValue = tab === 'buyerSeller' ? 1 : 0;

    Animated.timing(slideAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setActiveTab(tab);
  };

  const tabSelectorWidth = width - 40;
  const tabIndicatorWidth = (tabSelectorWidth - 4) / 2;

  // Fixed indicator positioning for RTL
  const getIndicatorTransform = () => {
    if (isRTL) {
      return slideAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [2, tabIndicatorWidth + 2],
      });
    } else {
      return slideAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [2, tabIndicatorWidth + 2],
      });
    }
  };

  // Fixed content transform for RTL
  const getBuyerSellerContentTransform = () => {
    if (isRTL) {
      return slideAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, 0],
      });
    } else {
      return slideAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [width, 0],
      });
    }
  };

  const getPartnerContentTransform = () => {
    if (isRTL) {
      return slideAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width],
      });
    } else {
      return slideAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -width],
      });
    }
  };

  return (
    <BackgroundWrapper>
      <View style={styles.mainScreen}>
        {!isIOS && (
          <HeaderComponent title={t('app.title')} showBackButton={false} />
        )}
        <View style={styles.languageSwitcherContainer}>
          <LanguageSwitcherButton textColor={Colors.MT_PRIMARY_1} />
        </View>
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
            {/* Modern Tab Selector */}
            <View style={styles.tabSelectorContainer}>
              <View
                style={[
                  styles.tabSelector,
                  isRTL && {flexDirection: 'row-reverse'},
                ]}>
                <Animated.View
                  style={[
                    styles.tabIndicator,
                    {
                      transform: [
                        {
                          translateX: getIndicatorTransform(),
                        },
                      ],
                    },
                  ]}
                />
                <TouchableOpacity
                  style={styles.tabButton}
                  onPress={() => switchTab('partner')}>
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'partner' && styles.activeTabText,
                    ]}>
                    {t('auth.mainScreen.partnerTab')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.tabButton}
                  onPress={() => switchTab('buyerSeller')}>
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'buyerSeller' && styles.activeTabText,
                    ]}>
                    {t('auth.mainScreen.buyerSellerTab')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.tabContentContainer}>
                {/* Partner Content */}
                <Animated.View
                  style={[
                    styles.partnerTabContent,
                    {
                      transform: [
                        {
                          translateX: getPartnerContentTransform(),
                        },
                      ],
                    },
                  ]}>
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      {t('auth.mainScreen.alreadyHaveAccount')}
                    </Text>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={onPartnerLogin}
                      activeOpacity={0.8}>
                      <View
                        style={[
                          styles.buttonContentRow,
                          isRTL && {flexDirection: 'row-reverse'},
                        ]}>
                        <GetIcon iconName="partner3" color="white" size="20" />
                        <Text style={styles.buttonText}>
                          {t('auth.signIn.continueToLogin')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      {t('auth.mainScreen.newHere')}
                    </Text>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={onPartnerSignup}
                      activeOpacity={0.8}>
                      <View style={styles.buttonContentRow}>
                        <Text style={styles.secondaryButtonText}>
                          {t('auth.signIn.getStartedFree')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.infoContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.infoText}>
                      {t('auth.signIn.securePartnerAccess')}
                    </Text>
                    <View style={styles.divider} />
                  </View>
                </Animated.View>
                {/* Buyer/Seller Content */}
                <Animated.View
                  style={[
                    styles.tabContent,
                    {
                      transform: [
                        {
                          translateX: getBuyerSellerContentTransform(),
                        },
                      ],
                    },
                  ]}>
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      {t('auth.mainScreen.alreadyHaveAccount')}
                    </Text>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={onBuyerSellerLogin}
                      activeOpacity={0.8}>
                      <Text style={styles.buttonText}>
                        {t('auth.mainScreen.logIn')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      {t('auth.mainScreen.newHere')}
                    </Text>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={onBuyerSignup}
                      activeOpacity={0.8}>
                      <View
                        style={[
                          styles.buttonContentRow,
                          isRTL && {flexDirection: 'row-reverse'},
                        ]}>
                        <Text style={styles.buttonText}>
                          {t('auth.mainScreen.signUpAsBuyer')}
                        </Text>
                        <GetIcon iconName="home" color="white" size="18" />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      {t('auth.mainScreen.wantToListProperty')}
                    </Text>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={onSellerSignup}
                      activeOpacity={0.8}>
                      <View
                        style={[
                          styles.buttonContentRow,
                          isRTL && {flexDirection: 'row-reverse'},
                        ]}>
                        <GetIcon
                          iconName="property"
                          color={Colors.MT_PRIMARY_1}
                          size="18"
                        />
                        <Text style={styles.secondaryButtonText}>
                          {t('auth.mainScreen.signUpAsSeller')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </BackgroundWrapper>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  languageSwitcherContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 10,
    gap: 40,
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
  cardContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // Modern Tab Selector Styles
  tabSelectorContainer: {
    marginBottom: 0,
    zIndex: 1,
  },
  tabSelector: {
    position: 'relative',
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
    borderRadius: 25,
    padding: 2,
    flexDirection: 'row',
    marginBottom: -12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabIndicator: {
    position: 'absolute',
    top: 2,
    width: (width - 44) / 2,
    height: 44,
    backgroundColor: Colors.MT_PRIMARY_1,
    borderRadius: 22,
    ...Platform.select({
      ios: {
        shadowColor: Colors.MT_PRIMARY_1,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.MT_SECONDARY_2,
  },
  activeTabText: {
    color: 'white',
  },
  // Card Styles
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabContentContainer: {
    position: 'relative',
    minHeight: 300,
    overflow: 'hidden',
  },
  tabContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    justifyContent: 'center',
  },
  partnerTabContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: Colors.MT_PRIMARY_1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.MT_PRIMARY_1,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Colors.MT_PRIMARY_1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.MT_PRIMARY_1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: Colors.MT_SECONDARY_2,
    fontWeight: '500',
    marginHorizontal: 16,
    textAlign: 'center',
  },
  divider: {
    width: 50,
    height: 1,
    backgroundColor: Colors.MT_PRIMARY_2,
    opacity: 0.4,
  },
});
