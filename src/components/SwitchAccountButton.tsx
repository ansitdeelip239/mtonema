import React, { useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import GetIcon from './GetIcon';
import { useAuth } from '../hooks/useAuth';

const SwitchAccountButton: React.FC = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    Alert.alert(
      t('auth.switchAccount.title', 'Switch Account'),
      t('auth.switchAccount.confirmMessage', 'Are you sure you want to logout and use a different account?'),
      [
        { text: t('common.actions.cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('auth.switchAccount.logout', 'Logout'),
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            await logout();
            setIsLoggingOut(false);
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.logoutButton}
      onPress={handleLogout}
      disabled={isLoggingOut}
      activeOpacity={0.7}
    >
      {isLoggingOut ? (
        <ActivityIndicator size="small" color="#ff6b6b" />
      ) : (
        <View style={styles.row}>
          <GetIcon iconName="logout" size={18} color="#ff6b6b" />
          <Text style={styles.logoutText}>{t('auth.switchAccount.title', 'Switch Account')}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    backgroundColor: '#fff5f5',
    minWidth: 120,
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 12,
    color: '#ff6b6b',
    fontWeight: '600',
    marginLeft: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SwitchAccountButton;
