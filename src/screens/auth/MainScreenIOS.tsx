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
import Colors from '../../constants/Colors';
import {useMaster} from '../../context/MasterProvider';
import {MasterDetailModel} from '../../types';
import HeaderComponent from './components/HeaderComponent';
import LanguageSwitcherButton from './LanguageSwitcherButton';
import {useTranslation} from 'react-i18next';
import {isCurrentLanguageRTL} from '../../i18n';

type Props = NativeStackScreenProps<AuthStackParamList, 'MainScreen'>;

export const MainScreenIOS: React.FC<Props> = ({navigation}) => {
  const {masterData} = useMaster();
  const {t} = useTranslation();
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

  return (
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
            <View style={styles.card}>
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
            </View>
          </View>
        </ScrollView>
      </View>
  );
};

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
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
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
});

export default MainScreenIOS;