/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import GetIcon from '../../../../components/GetIcon';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import { useTranslation } from 'react-i18next';
import { TeamMember } from '../../../../types';

interface TeamMemberCardProps {
  item: TeamMember;
  onEdit?: (member: TeamMember) => void;
  onDelete?: (member: TeamMember) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = React.memo(
  ({item, onEdit, onDelete}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { t } = useTranslation();

    const handleEdit = () => {
      console.log('Edit clicked for member:', item);
      onEdit?.(item);
    };

    const handleDeletePress = () => {
      setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
      setIsDeleting(true);
      try {
        await onDelete?.(item);
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Delete error:', error);
      } finally {
        setIsDeleting(false);
      }
    };

    const handleCancelDelete = () => {
      setShowDeleteModal(false);
    };

    return (
      <>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <Text style={styles.name}>{item.name}</Text>
              <View
                style={[
                  styles.statusBadge,
                  {backgroundColor: item.isActive ? '#e8f5e8' : '#ffe8e8'},
                ]}>
                <View
                  style={[
                    styles.statusDot,
                    {backgroundColor: item.isActive ? '#4caf50' : '#f44336'},
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    {color: item.isActive ? '#4caf50' : '#f44336'},
                  ]}>
                  {item.isActive ? t('teams.status.active', 'Active') : t('teams.status.inactive', 'Inactive')}
                </Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleEdit}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <GetIcon iconName="edit" size={18} color="#64748b" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleDeletePress}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <GetIcon iconName="delete" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('teams.labels.email', 'Email')}:</Text>
              <Text style={styles.value}>{item.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('teams.labels.phone', 'Phone')}:</Text>
              <Text style={styles.value}>{item.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('teams.labels.role', 'Role')}:</Text>
              <Text style={[styles.value, styles.roleText]}>{item.role}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('teams.labels.location', 'Location')}:</Text>
              <Text style={styles.value}>{item.location}</Text>
            </View>
          </View>
        </View>

        <ConfirmationModal
          visible={showDeleteModal}
          title={t('teams.modals.deleteMember.title', 'Delete Team Member')}
          message={t('teams.modals.deleteMember.message', 'Are you sure you want to delete {{name}}? This action cannot be undone.', { name: item.name })}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isLoading={isDeleting}
        />
      </>
    );
  },
);

TeamMemberCard.displayName = 'TeamMemberCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardBody: {
    padding: 16,
    paddingTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    width: 70,
  },
  value: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    fontWeight: '400',
  },
  roleText: {
    color: '#007bff',
    fontWeight: '500',
  },
});

export default TeamMemberCard;
