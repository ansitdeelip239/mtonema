import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import { User } from '../../../../types';

interface UserCardProps {
  item: User;
}

const UserCard: React.FC<UserCardProps> = React.memo(({item}) => {
  const {t} = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return {backgroundColor: '#e8f5e8', textColor: '#4caf50', dotColor: '#4caf50'};
      case 'inactive':
        return {backgroundColor: '#ffe8e8', textColor: '#f44336', dotColor: '#f44336'};
      case 'deleted':
        return {backgroundColor: '#f3f4f6', textColor: '#6b7280', dotColor: '#6b7280'};
      default:
        return {backgroundColor: '#fef3c7', textColor: '#f59e0b', dotColor: '#f59e0b'};
    }
  };

  const statusColors = getStatusColor(item.recordStatus);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{item.name}</Text>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: statusColors.backgroundColor},
            ]}>
            <View
              style={[
                styles.statusDot,
                {backgroundColor: statusColors.dotColor},
              ]}
            />
            <Text
              style={[
                styles.statusText,
                {color: statusColors.textColor},
              ]}>
              {item.recordStatus}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>{t('users.labels.email', 'Email')}:</Text>
          <Text style={styles.value}>{item.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>{t('users.labels.phone', 'Phone')}:</Text>
          <Text style={styles.value}>{item.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>{t('users.labels.role', 'Role')}:</Text>
          <Text style={[styles.value, styles.roleText]}>{item.role}</Text>
        </View>
        {item.location && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t('users.labels.location', 'Location')}:</Text>
            <Text style={styles.value}>{item.location}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.label}>{t('users.labels.listedProperties', 'Listed Properties')}:</Text>
          <Text style={styles.value}>{item.listedProperty}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>{t('users.labels.createdOn', 'Created On')}:</Text>
          <Text style={styles.value}>{formatDate(item.createdOn)}</Text>
        </View>
        {item.platform && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t('users.labels.platform', 'Platform')}:</Text>
            <Text style={styles.value}>{item.platform}</Text>
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    minWidth: 120,
    marginRight: 8,
  },
  value: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
    flexWrap: 'wrap',
  },
  roleText: {
    fontWeight: '500',
    color: '#7c3aed',
    textTransform: 'capitalize',
  },
});

export default UserCard;