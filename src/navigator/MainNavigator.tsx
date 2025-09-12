import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import SellerNavigator from './SellerNavigator';
import BuyerNavigator from './BuyerNavigator';
import PartnerNavigator from './PartnerNavigator';
import {PartnerProvider} from '../context/PartnerProvider';
import Roles from '../constants/Roles';
import GetIcon from '../components/GetIcon';
import SubscriptionGuard from '../components/SubscriptionGuard';
import config from '../config';
import {useTranslation} from 'react-i18next';
import {useAuth} from '../context/AuthProvider';

const MainNavigator = () => {
  const {user, logout} = useAuth();
  const {t} = useTranslation();

  // Translation object with all keys used in this component
  const translations = React.useMemo(
    () => ({
      logout: {
        title: t('logout.title', 'Logout'),
        confirm: t('logout.confirm', 'Are you sure you want to logout?'),
        action: t('logout.action', 'Logout'),
      },
      common: {
        cancel: t('common.actions.cancel', 'Cancel'),
      },
      auth: {
        accessDenied: t('auth.accessDenied', 'Access Denied'),
        adminUnauthorized: t(
          'auth.adminUnauthorized',
          'Your email {email} is not authorized for admin access.',
        ),
        contactAdmin: t(
          'auth.contactAdmin',
          'Please contact the administrator for access.',
        ),
        buyerAccess: t('auth.buyerAccess', 'Buyer Access'),
        buyerNotSupported: t(
          'auth.buyerNotSupported',
          'Buyer features are not yet supported in this version.',
        ),
        contactSupport: t(
          'auth.contactSupport',
          'Please contact support for assistance.',
        ),
      },
    }),
    [t],
  );

  // Check if user has admin role and email is in the allowed list
  const isAuthorizedAdmin =
    user?.role === Roles.ADMIN &&
    user?.email &&
    config.allowed_admins.includes(user.email);

  // Check if user is an unauthorized admin
  const isUnauthorizedAdmin =
    user?.role === Roles.ADMIN &&
    user?.email &&
    !config.allowed_admins.includes(user.email);

  const handleLogout = () => {
    Alert.alert(translations.logout.title, translations.logout.confirm, [
      {
        text: translations.common.cancel,
        style: 'cancel',
      },
      {
        text: translations.logout.action,
        onPress: logout,
        style: 'destructive',
      },
    ]);
  };

  // Handle unauthorized admin access
  if (isUnauthorizedAdmin) {
    return (
      <View style={styles.container}>
        <View style={styles.unauthorizedContainer}>
          <GetIcon iconName="help" size={64} color="#ff6b6b" />
          <Text style={styles.unauthorizedTitle}>
            {translations.auth.accessDenied}
          </Text>
          <Text style={styles.unauthorizedMessage}>
            {translations.auth.adminUnauthorized.replace('{email}', user.email)}
          </Text>
          <Text style={styles.contactMessage}>
            {translations.auth.contactAdmin}
          </Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}>
            <Text style={styles.logoutButtonText}>
              {translations.logout.action}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <>
      {user?.role === Roles.BUYER ? (
        <BuyerNavigator />
      ) : user?.role === Roles.SELLER ? (
        <SellerNavigator />
      ) : user?.role === Roles.PARTNER ||
        user?.role === Roles.TEAM ||
        isAuthorizedAdmin ? (
        <SubscriptionGuard>
          <PartnerProvider>
            <PartnerNavigator />
          </PartnerProvider>
        </SubscriptionGuard>
      ) : (
        // Fallback for any unhandled user roles
        <View style={styles.container}>
          <View style={styles.unauthorizedContainer}>
            <GetIcon iconName="user" size={64} color="#ccc" />
            <Text style={styles.unauthorizedTitle}>
              {translations.auth.buyerAccess}
            </Text>
            <Text style={styles.unauthorizedMessage}>
              {translations.auth.buyerNotSupported}
            </Text>
            <Text style={styles.contactMessage}>
              {translations.auth.contactSupport}
            </Text>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}>
              <Text style={styles.logoutButtonText}>
                {translations.logout.action}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  unauthorizedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  unauthorizedMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  contactMessage: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MainNavigator;
