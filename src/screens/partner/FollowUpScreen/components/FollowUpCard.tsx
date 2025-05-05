import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Card} from 'react-native-paper';
import {FollowUpType} from '../../../../types';
import {formatFollowUpDate, formatTime} from '../../../../utils/dateUtils';
import GetIcon from '../../../../components/GetIcon';
import Colors from '../../../../constants/Colors';
import {useTheme} from '../../../../context/ThemeProvider';
import GroupBadges from '../../ClientScreen/components/GroupBadge';

interface FollowUpCardProps {
  item: FollowUpType;
  filterType?: string;
}

const FollowUpCard: React.FC<FollowUpCardProps> = ({item, filterType}) => {
  // Helper function to convert UTC date to local time
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

  return (
    <Card style={styles.followUpCard}>
      <Card.Content>
        <View style={styles.followUpHeader}>
          <View style={styles.clientSection}>
            <Text style={styles.clientName}>{item.client.clientName}</Text>
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
                  <GetIcon iconName="time" size={14} color={theme.primaryColor} />
                  <Text style={[styles.followUpTime, {color: theme.primaryColor}]}>
                    {formatTime(localFollowUpDate)}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        <View style={styles.groupsContainer}>
          {item.client.groups && item.client.groups.length > 0 ? (
            <GroupBadges groups={item.client.groups} />
          ) : (
            <Text style={styles.noGroupText}>No Group</Text>
          )}
        </View>

        <Text style={styles.notes}>{item.client.notes || 'No notes'}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  followUpCard: {
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: Colors.white,
  },
  followUpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  clientSection: {
    flex: 1,
    marginRight: 8,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  timeContainer: {
    alignItems: 'flex-end',
    minWidth: 80, // ensure minimum width for time section
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
  notes: {
    fontSize: 14,
    color: '#444',
    marginTop: 6,
  },
  groupsContainer: {
    marginVertical: 4,
  },
  noGroupText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  // Removed groupTag and groupText styles as they're no longer needed
});

export default FollowUpCard;
