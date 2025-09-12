import React, {useState, useEffect} from 'react';
import {useSubscription} from '../context/SubscriptionProvider';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../constants/Colors';
import GetIcon from './GetIcon';
import Images from '../constants/Images';
import {useTheme} from '../context/ThemeProvider';
import {navigationRef} from '../navigator/components/NavigationRef';
import PaymentScreen from '../screens/partner/PaymentScreen/PaymentScreen';
import {useTranslation} from 'react-i18next';
import {useAuth} from '../context/AuthProvider';
import Roles from '../constants/Roles';
import CustomDrawerItem from './CustomDrawerItem';

const CustomDrawerContent = (props: any) => {
  const {user, logout} = useAuth();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {isInTrial, isPartnerOrTeam} = useSubscription();
  const [userName, setUserName] = useState(user?.name || '');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Under development modal
  const [logoutModalVisible, setLogoutModalVisible] = useState(false); // Logout confirmation modal
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [premiumModalVisible, setPremiumModalVisible] = useState(false); // Premium upgrade modal

  // Get current route name for active state
  const currentRoute = props.state?.routes[props.state?.index]?.name;

  // const {logoUrl} = useLogoStorage();

  useEffect(() => {
    if (user?.name) {
      setUserName(user.name);
    }
  }, [user?.name]);

  const handleCustomButtonPress = () => {
    props.navigation.closeDrawer();
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    setLogoutModalVisible(false);
    setLoadingModalVisible(true);
    await logout();
    navigationRef.current?.resetRoot({
      index: 0,
      routes: [{name: 'Auth'}],
    });
    setIsLoggingOut(false);
    setLoadingModalVisible(false);
    console.log('Logged Out Successfully');
  };

  const navigateToProfile = () => {
    props.navigation.navigate('Profile Screen');
    props.navigation.closeDrawer();
  };

  const handlePremiumUpgrade = () => {
    props.navigation.closeDrawer();
    setPremiumModalVisible(true);
  };

  const handlePremiumSuccess = () => {
    setPremiumModalVisible(false);
  };

  const navigateToPayments = () => {
    props.navigation.navigate('Payments');
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={styles.drawerScrollView}
      contentContainerStyle={styles.drawerContentContainer}
      showsVerticalScrollIndicator={true}
      bounces={false}>
      <TouchableOpacity onPress={navigateToProfile}>
        <View
          style={[
            styles.profileContainer,
            {backgroundColor: theme.backgroundColor || '#f5f5f5'},
          ]}>
          <Image source={Images.MTESTATES_LOGO} style={styles.logo} />

          <View style={styles.nameContainer}>
            <Text style={[styles.name, {color: theme.textColor || '#333'}]}>
              {userName}
            </Text>
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={navigateToProfile}>
              <GetIcon iconName="edit" color={theme.textColor} size="20" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* Existing Drawer Items */}
      <DrawerItemList {...props} />

      {/* Custom About and FAQ Items */}
      <View style={styles.customItemsContainer}>
        {/* Buy Premium Button - Only show for trial users */}
        {isPartnerOrTeam && isInTrial && (
          <TouchableOpacity
            style={[
              styles.premiumDrawerItem,
              {
                shadowColor: theme.primaryColor || '#000',
              },
            ]}
            onPress={handlePremiumUpgrade}>
            <View style={styles.iconContainer}>
              <GetIcon iconName="premium" color="white" size="25" />
            </View>
            <Text style={styles.premiumItemText}>
              {t('navigation.drawer.buyPremium', 'Buy Premium')}
            </Text>
          </TouchableOpacity>
        )}

        {
          user?.role === Roles.ADMIN &&
          <CustomDrawerItem
            iconName="rupee"
            label={t('navigation.drawer.payments', 'Payments')}
            onPress={navigateToPayments}
            isActive={currentRoute === 'Payments'}
            showForRoles={[Roles.ADMIN, Roles.PARTNER]}
            userRole={user?.role}
          />
        }

        <CustomDrawerItem
          iconName="about"
          label={t('navigation.drawer.helpCenter', 'Help Center')}
          onPress={() => setModalVisible(true)}
        />

        <CustomDrawerItem
          iconName="faq"
          label={t('navigation.drawer.chatWithUs', 'Chat With Us')}
          onPress={() => setModalVisible(true)}
        />
      </View>

      {/* Spacer to push logout button to bottom */}
      <View style={styles.spacer} />

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity
          onPress={handleCustomButtonPress}
          style={[
            styles.logout,
            {
              backgroundColor: theme.primaryColor,
              shadowColor: theme.primaryColor || '#000',
            },
          ]}
          disabled={isLoggingOut}>
          <View style={styles.drawerItem}>
            <GetIcon iconName="logout" color={Colors.white} size="25" />
            <Text style={styles.logouttxt}>
              {t('navigation.drawer.logout', 'Logout')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {t(
                'navigation.drawer.logoutConfirmation',
                'Are you sure you want to logout?',
              )}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.whiteButton}
                onPress={() => setLogoutModalVisible(false)}>
                <Text style={styles.textBlack}>
                  {t('common.actions.cancel', 'Cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.redButton,
                  {backgroundColor: theme.primaryColor},
                ]}
                onPress={confirmLogout}
                disabled={isLoggingOut}>
                <Text style={styles.textWhite}>
                  {t('navigation.drawer.logout', 'Log out')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={loadingModalVisible}
        onRequestClose={() => setLoadingModalVisible(false)}>
        <View style={styles.loadingModalContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>
            {t('navigation.drawer.loggingOut', 'Logging out...')}
          </Text>
        </View>
      </Modal>

      {/* Premium Upgrade Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={premiumModalVisible}
        onRequestClose={() => setPremiumModalVisible(false)}>
        <PaymentScreen
          onPaymentSuccess={handlePremiumSuccess}
          isUpgrade={true}
          onClose={() => setPremiumModalVisible(false)}
        />
      </Modal>

      {/* Under Development Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {t(
                'navigation.drawer.underDevelopment',
                'This feature is under development',
              )}
            </Text>
            <TouchableOpacity
              style={[
                styles.modalSingleButton,
                {backgroundColor: theme.primaryColor},
              ]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.textWhite}>
                {t('common.actions.ok', 'OK')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerScrollView: {
    flex: 1,
  },
  drawerContentContainer: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  flexOne: {
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  customItemsContainer: {
    marginTop: 0,
  },
  premiumDrawerItem: {
    backgroundColor: '#53a20e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginLeft: 4,
  },
  premiumItemText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
    paddingBottom: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  editIconContainer: {
    marginLeft: 10,
    padding: 5,
  },
  logouttxt: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 1,
    textAlign: 'center',
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  spacer: {
    flex: 1,
  },
  logout: {
    paddingVertical: 4,
    borderRadius: 40,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textWhite: {
    color: 'white',
    fontWeight: 'bold',
  },
  textBlack: {
    color: 'black',
  },
  logoutContainer: {
    marginTop: 20,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  loadingModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  redButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalSingleButton: {
    minWidth: 100,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
  },
  whiteButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    backgroundColor: '#FFF',
    borderRadius: 5,
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  touchableHighlight: {
    borderRadius: 50,
    overflow: 'hidden',
    marginLeft: -10,
    width: '100%',
  },
});
export default CustomDrawerContent;
