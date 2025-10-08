import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

interface UserHeaderProps {
  userCount: number;
}

const UserHeader: React.FC<UserHeaderProps> = React.memo(({userCount}) => {
  const {t} = useTranslation();

  return (
    <View style={styles.titleContainer}>
      <Text style={styles.subtitle}>
        {userCount} {userCount === 1 ? t('users.labels.user', 'user') : t('users.labels.users', 'users')}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
});

export default UserHeader;