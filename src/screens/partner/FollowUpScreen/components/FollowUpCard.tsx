import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {FollowUpType} from '../../../../types';
import {formatFollowUpDate, formatTime} from '../../../../utils/dateUtils';
import GetIcon from '../../../../components/GetIcon';
import {useTheme} from '../../../../context/ThemeProvider';
import GroupBadges from '../../ClientScreen/components/GroupBadge';
import {parseHtmlToText} from '../../../../utils/parseHtmlToText';
import { getPastelColor } from '../../../../utils/getPastelColor';

interface FollowUpCardProps {
  item: FollowUpType;
  filterType?: string;
  onPress?: () => void;
}

const FollowUpCard: React.FC<FollowUpCardProps> = ({
  item,
  filterType,
  onPress,
}) => {
  const {theme} = useTheme();

  const getLocalDate = (dateString: string) => {
    if (!dateString) {
      return null;
    }

    try {
      // Append 'Z' to indicate UTC time if it doesn't already have a timezone indicator
      const utcDateString = dateString.endsWith('Z')
        ? dateString
        : `${dateString}Z`;

      // Create a date directly from the UTC string - JS will automatically convert to local time
      const localDate = new Date(utcDateString);

      // Check if date is valid
      if (isNaN(localDate.getTime())) {
        console.warn('Invalid date string:', dateString);
        return new Date(); // Fallback to current date
      }

      return localDate;
    } catch (error) {
      console.error('Error parsing date:', error);
      return new Date(); // Fallback to current date if parsing fails
    }
  };

  // Get local follow-up date
  const localFollowUpDate = item.followUpDate
    ? getLocalDate(item.followUpDate)
    : null;

  // Parse HTML notes to plain text
  const parsedNotes = parseHtmlToText(item.client.notes || '');

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity onPress={handleCardPress} activeOpacity={0.7}>
      <View style={styles.followUpCard}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.avatar,
                {backgroundColor: getPastelColor(item.client.clientName)},
              ]}>
              <Text style={styles.avatarText}>
                {item.client.clientName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.nameStatusContainer}>
              <Text style={styles.clientName}>{item.client.clientName}</Text>
              <View style={styles.statusRow}>
                <Text style={styles.timeText}>Follow Up</Text>
              </View>
            </View>
            <View style={styles.timeContainer}>
              {localFollowUpDate && (
                <>
                  {filterType !== 'today' && (
                    <Text style={styles.followUpDate}>
                      {formatFollowUpDate(localFollowUpDate)}
                    </Text>
                  )}
                  <View style={styles.timeWrapper}>
                    <GetIcon
                      iconName="time"
                      size={14}
                      color={theme.primaryColor}
                    />
                    <Text
                      style={[
                        styles.followUpTime,
                        {color: theme.primaryColor},
                      ]}>
                      {formatTime(localFollowUpDate)}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.cardContent}>
          {/* Groups */}
          {item.client.groups && item.client.groups.length > 0 && (
            <View style={styles.groupsContainer}>
              <GroupBadges groups={item.client.groups} />
            </View>
          )}

          {/* Notes */}
          {parsedNotes && <Text style={styles.notes}>{parsedNotes}</Text>}

          {/* Assigned Users */}
          {item.assignedUsers && item.assignedUsers.length > 0 && (
            <View style={styles.assignedContainer}>
              <Text style={styles.assignedLabel}>Assigned:</Text>
              <View style={styles.assignedBadgesWrapper}>
                {item.assignedUsers.map(user => (
                  <View key={user.id} style={styles.assignedBadge}>
                    <Text style={styles.assignedBadgeText}>{user.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  followUpCard: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  nameStatusContainer: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  timeContainer: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2,
  },
  followUpDate: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  followUpTime: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  groupsContainer: {
    marginVertical: 4,
  },
  notes: {
    fontSize: 14,
    color: '#444',
    marginTop: 6,
    marginBottom: 8,
  },
  assignedContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  assignedLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 6,
    fontWeight: '500',
    marginTop: 2,
  },
  assignedBadgesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    gap: 4,
  },
  assignedBadge: {
    backgroundColor: '#e6f0fa',
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#b3d4fc',
  },
  assignedBadgeText: {
    color: '#0066cc',
    fontWeight: '500',
    fontSize: 11,
  },
  // Legacy styles (to be removed)
  followUpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  clientSection: {
    flex: 1,
    marginRight: 8,
  },
  horizontalRule: {
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    marginVertical: 8,
    marginHorizontal: -8,
  },
  assignedUsersContainerWrapper: {
    marginTop: 2,
    marginBottom: 4,
  },
  assignedUsersLabel: {
    fontSize: 13,
    color: '#555',
    fontWeight: 'bold',
    marginBottom: 2,
    marginLeft: 2,
  },
  assignedUsersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginLeft: 2,
  },
  assignedUsersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  assignedUserBadge: {
    backgroundColor: '#e6f2ff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#b3d4fc',
  },
  assignedUserName: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '500',
  },
  noAssignedUserText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginLeft: 2,
  },
  noGroupText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default FollowUpCard;
