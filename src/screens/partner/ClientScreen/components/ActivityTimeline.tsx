import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GetIcon from '../../../../components/GetIcon';
import {ClientActivityDataModel} from '../../../../types';
import {formatDate} from '../../../../utils/dateUtils';

const getActivityIcon = (activityType: string) => {
  const type = activityType.toLowerCase();
  if (type.includes('call')) {
    return 'phone';
  }

  if (type.includes('message') || type.includes('whatsapp')) {
    return 'message';
  }

  return 'notes';
};

const ActivityTimeline: React.FC<{
  activity: ClientActivityDataModel;
  isLast?: boolean;
}> = ({activity, isLast = false}) => (
  <View style={styles.container}>
    <View style={styles.timelineSection}>
      <View style={styles.iconContainer}>
        <GetIcon
          iconName={getActivityIcon(activity.ActivityType.Name)}
          size="16"
          color="white"
        />
      </View>
      {!isLast && <View style={styles.verticalLine} />}
    </View>
    <View style={styles.contentSection}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityType}>{activity.ActivityType.Name}</Text>
        <Text style={styles.activityDate}>
          {formatDate(activity.CreatedOn, 'PPp')}
        </Text>
      </View>
      <Text style={styles.activityDescription}>{activity.Description}</Text>
      <Text style={styles.assignedTo}>
        Assigned to: {activity.AssignedTo.Name}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  timelineSection: {
    alignItems: 'center',
    width: 40,
    marginRight: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  contentSection: {
    flex: 1,
    paddingBottom: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066cc',
  },
  activityDate: {
    fontSize: 12,
    color: '#666',
  },
  activityDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  assignedTo: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default ActivityTimeline;
