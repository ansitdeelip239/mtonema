import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import GetIcon from '../../../../components/GetIcon';
import {Client} from '../../../../types';
import {formatFollowUpDate, formatTime} from '../../../../utils/dateUtils';

interface FollowUpCardProps {
  client: Client;
  onPress: () => void;
}

const FollowUpCard: React.FC<FollowUpCardProps> = ({client, onPress}) => {
  // Helper function to convert UTC date to local time
  const getLocalDate = (dateString: string) => {
    if (!dateString) {
      return null;
    }

    // Parse the date string into year, month, day, hours, minutes
    const [datePart, timePart] = dateString.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart
      ? timePart.split(':').map(Number)
      : [0, 0];

    // Create a date object in local time zone with the UTC components
    return new Date(Date.UTC(year, month - 1, day, hours, minutes));
  };

  // Get local follow-up date
  const localFollowUpDate = client?.followUp?.date
    ? getLocalDate(client.followUp.date)
    : null;

  // Calculate days difference for proper display
  const getDaysText = () => {
    if (!localFollowUpDate) {
      return '';
    }

    // Create date objects for today and the follow-up date that ignore time
    const today = new Date();
    const followUpDay = new Date(localFollowUpDate);

    // Reset hours to compare dates only, not times
    today.setHours(0, 0, 0, 0);
    followUpDay.setHours(0, 0, 0, 0);

    // Calculate difference in days
    const diffTime = followUpDay.getTime() - today.getTime();
    const daysLeft = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return 'Overdue';
    } else if (daysLeft === 0) {
      return 'Today';
    } else {
      return daysLeft === 1 ? '1 day' : `${daysLeft} days`;
    }
  };

  const isSomedayFollowUp =
    client?.followUp?.status === 'Pending' && !client?.followUp?.date;

  const hasFollowUp = client?.followUp?.status === 'Pending';

  const isOverdue = localFollowUpDate
    ? localFollowUpDate.getTime() < new Date().getTime()
    : false;

  const isToday = localFollowUpDate ? getDaysText() === 'Today' : false;

  return (
    <TouchableOpacity
      style={[
        styles.infoCard,
        styles.followUpCard,
        // Apply the activeFollowUpCard style for both date-based and someday follow-ups
        (localFollowUpDate || isSomedayFollowUp) && styles.activeFollowUpCard,
        // Add overdue style if follow-up is overdue
        isOverdue && styles.overdueFollowUpCard,
      ]}
      onPress={onPress}>
      <View style={styles.followUpHeader}>
        <Text style={[styles.sectionTitle, isOverdue && styles.overdueText]}>
          {localFollowUpDate
            ? isOverdue
              ? 'Follow Up Overdue'
              : isToday
              ? 'Follow Up Today'
              : `Follow Up in ${getDaysText()}`
            : isSomedayFollowUp
            ? 'Follow Up: Someday'
            : 'No Follow Up Scheduled'}
        </Text>
        <View style={styles.scheduleButton}>
          {hasFollowUp ? (
            <GetIcon iconName="edit" size={20} color="#0066cc" />
          ) : (
            <GetIcon iconName="plus" size={20} color="#0066cc" />
          )}
        </View>
      </View>
      {localFollowUpDate ? (
        <View style={styles.followUpDateContainer}>
          <Text style={[styles.infoValue, isOverdue && styles.overdueText]}>
            {formatFollowUpDate(localFollowUpDate)}
          </Text>
          <Text style={[styles.followUpTime, isOverdue && styles.overdueText]}>
            {formatTime(localFollowUpDate)}
          </Text>
        </View>
      ) : isSomedayFollowUp ? (
        <Text style={styles.infoValue}>To be scheduled later</Text>
      ) : (
        <Text style={styles.infoValue}>No date set</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  followUpCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  },
  activeFollowUpCard: {
    borderWidth: 1,
    borderColor: '#0066cc',
    backgroundColor: '#e6f0ff',
    shadowColor: '#0066cc',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  overdueFollowUpCard: {
    borderWidth: 1,
    borderColor: '#e74c3c',
    backgroundColor: '#ffe5e5',
    shadowColor: '#e74c3c',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  overdueText: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
  },
  followUpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  followUpDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  followUpTime: {
    fontSize: 14,
    color: '#1a1a1a',
    textAlign: 'right',
  },
});

export default FollowUpCard;
