// import { View, Text } from 'react-native'
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import SellerNavigator from './SellerNavigator';
import BuyerNavigator from './BuyerNavigator';
import {useAuth} from '../hooks/useAuth';
import {BuyerProvider} from '../context/BuyerProvider';
import PartnerNavigator from './PartnerNavigator';
import {PartnerProvider} from '../context/PartnerProvider';
import {PropertyFormProvider} from '../context/PropertyFormContext';
import Roles from '../constants/Roles';
import {BottomTabProvider} from '../context/BottomTabProvider';
import GetIcon from '../components/GetIcon';

const MainNavigator = () => {
  const {user, logout} = useAuth();

  // Array of allowed admin emails
  const allowedAdminEmails = [
    'info@dncrproperty.com',
    'shashi225@gmail.com',
    // 'atique159@gmail.com',
    // 'ansitdeelip239@gmail.com',
  ];

  // Check if user has admin role and email is in the allowed list
  const isAuthorizedAdmin =
    user?.role === Roles.ADMIN &&
    user?.email &&
    allowedAdminEmails.includes(user.email);

  // Check if user is an unauthorized admin
  const isUnauthorizedAdmin =
    user?.role === Roles.ADMIN &&
    user?.email &&
    !allowedAdminEmails.includes(user.email);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: logout,
          style: 'destructive',
        },
      ]
    );
  };

  // Handle unauthorized admin access
  if (isUnauthorizedAdmin) {
    return (
      <View style={styles.container}>
        <View style={styles.unauthorizedContainer}>
          <GetIcon iconName="help" size={64} color="#ff6b6b" />
          <Text style={styles.unauthorizedTitle}>Access Denied</Text>
          <Text style={styles.unauthorizedMessage}>
            Your admin account ({user.email}) is not authorized to access this application.
          </Text>
          <Text style={styles.contactMessage}>
            Please contact the system administrator for access permissions.
          </Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <>
      {user?.role === Roles.BUYER ? (
        <BuyerProvider>
          <BuyerNavigator />
        </BuyerProvider>
      ) : user?.role === Roles.SELLER ? (
        <PropertyFormProvider>
          <SellerNavigator />
        </PropertyFormProvider>
      ) : user?.role === Roles.PARTNER ||
        user?.role === Roles.TEAM ||
        isAuthorizedAdmin ? (
        <BottomTabProvider>
          <PartnerProvider>
            <PartnerNavigator />
          </PartnerProvider>
        </BottomTabProvider>
      ) : (
        // Fallback for any unhandled user roles
        <View style={styles.container}>
          <View style={styles.unauthorizedContainer}>
            <GetIcon iconName="user" size={64} color="#ccc" />
            <Text style={styles.unauthorizedTitle}>Unknown User Role</Text>
            <Text style={styles.unauthorizedMessage}>
              Your account role is not recognized or supported.
            </Text>
            <Text style={styles.contactMessage}>
              Please contact support for assistance.
            </Text>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}>
              <Text style={styles.logoutButtonText}>Logout</Text>
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
