import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import GetIcon from '../../../../components/GetIcon';
import {Client} from '../../../../types';
import {formatFollowUpDate, formatTime} from '../../../../utils/dateUtils';
import {useTranslation} from 'react-i18next';

interface FollowUpCardProps {
  client: Client;
  isLoading?: boolean;
  onPress: () => void;
}

const FollowUpCard: React.FC<FollowUpCardProps> = ({
  client,
  isLoading = false,
  onPress,
}) => {
  const {t} = useTranslation();

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
      return t('time.overdue', 'Overdue');
    } else if (daysLeft === 0) {
      // Calculate time difference in hours and minutes
      const timeRemainingMs =
        localFollowUpDate.getTime() - new Date().getTime();
      const hoursLeft = Math.floor(timeRemainingMs / (1000 * 60 * 60));
      const minutesLeft = Math.floor(
        (timeRemainingMs % (1000 * 60 * 60)) / (1000 * 60),
      );

      if (hoursLeft > 0) {
        return t('time.hoursLeft', '{{hours}} hrs', {hours: hoursLeft});
      } else if (minutesLeft > 0) {
        return t('time.minutesLeft', '{{minutes}} mins', {
          minutes: minutesLeft,
        });
      } else {
        return t('time.today', 'Today');
      }
    } else {
      return daysLeft === 1
        ? t('time.oneDay', '1 day')
        : t('time.multipleDays', '{{days}} days', {days: daysLeft});
    }
  };

  const isSomedayFollowUp =
    client?.followUp?.status === 'Pending' && !client?.followUp?.date;

  const hasFollowUp = client?.followUp?.status === 'Pending';

  const isOverdue = localFollowUpDate
    ? localFollowUpDate.getTime() < new Date().getTime()
    : false;

  const isToday = localFollowUpDate
    ? getDaysText() === t('time.today', 'Today')
    : false;

  const isLessThanOneHour = localFollowUpDate
    ? localFollowUpDate.getTime() - new Date().getTime() < 1000 * 60 * 60
    : false;

  // Get follow-up title based on status
  const getFollowUpTitle = () => {
    if (localFollowUpDate) {
      if (isOverdue) {
        return t('followUp.status.overdue', 'Follow Up Overdue');
      } else if (isToday) {
        return t('followUp.status.today', 'Follow Up Today');
      } else {
        return t('followUp.status.in', 'Follow Up in {{timeLeft}}', {
          timeLeft: getDaysText(),
        });
      }
    } else if (isSomedayFollowUp) {
      return t('followUp.status.someday', 'Follow Up: Someday');
    } else {
      return t('followUp.status.noScheduled', 'No Follow Up Scheduled');
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.infoCard,
        styles.followUpCard,
        // Apply the activeFollowUpCard style for both date-based and someday follow-ups
        (localFollowUpDate || isSomedayFollowUp) && styles.activeFollowUpCard,
        // Add overdue style if follow-up is overdue
        isOverdue && styles.overdueFollowUpCard,
        // Add yellow style if time remaining is less than 1 hour
        isLessThanOneHour && styles.lessThanOneHourFollowUpCard,
      ]}
      onPress={onPress}
      disabled={isLoading}>
      <View style={styles.followUpHeader}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={styles.loadingText}>
              {t('common.states.loading', 'Loading follow-up...')}
            </Text>
          </View>
        ) : (
          <>
            <Text
              style={[styles.sectionTitle, isOverdue && styles.overdueText]}>
              {getFollowUpTitle()}
            </Text>
            <View style={styles.scheduleButton}>
              {hasFollowUp ? (
                <GetIcon iconName="edit" size={20} color="#0066cc" />
              ) : (
                <GetIcon iconName="plus" size={20} color="#0066cc" />
              )}
            </View>
          </>
        )}
      </View>
      {!isLoading && (
        <>
          {localFollowUpDate ? (
            <View style={styles.followUpDateContainer}>
              <Text style={[styles.infoValue, isOverdue && styles.overdueText]}>
                {formatFollowUpDate(localFollowUpDate)}
              </Text>
              <Text
                style={[styles.followUpTime, isOverdue && styles.overdueText]}>
                {formatTime(localFollowUpDate)}
              </Text>
            </View>
          ) : isSomedayFollowUp ? (
            <Text style={styles.infoValue}>
              {t('followUp.toBeScheduledLater', 'To be scheduled later')}
            </Text>
          ) : (
            <Text style={styles.infoValue}>
              {t('followUp.noDateSet', 'No date set')}
            </Text>
          )}
        </>
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
  lessThanOneHourFollowUpCard: {
    borderWidth: 1,
    borderColor: '#f1c40f',
    backgroundColor: '#fff9e6',
    shadowColor: '#f1c40f',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
});

export default FollowUpCard;
