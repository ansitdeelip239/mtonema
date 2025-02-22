import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import GetIcon from '../../../../components/GetIcon';
import {ClientActivityDataModel} from '../../../../types';
import {formatDate} from '../../../../utils/dateUtils';

const getActivityIcon = (activityType: string) => {
  const type = activityType.toLowerCase();
  if (type.includes('phone number')) {
    return 'phone';
  }
  if (type.includes('message')) {
    return 'message';
  }
  return 'notes';
};

interface ActivityTimelineProps {
  activity: ClientActivityDataModel;
  isLast?: boolean;
  onPress: (activity: ClientActivityDataModel) => void;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activity,
  isLast = false,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.touchableContainer}
    onPress={() => onPress(activity)}>
    <View style={styles.timelineSection}>
      <View style={styles.iconContainer}>
        <GetIcon
          iconName={getActivityIcon(activity.activityType.name)}
          size="16"
          color="white"
        />
      </View>
      {!isLast && <View style={styles.verticalLine} />}
    </View>
    <View style={styles.contentSection}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityType} numberOfLines={1}>
          {activity.activityType.name}
        </Text>
        <Text style={styles.activityDate}>
          {formatDate(activity.createdOn, 'PPp')}
        </Text>
      </View>
      <Text style={styles.activityDescription} numberOfLines={2}>
        {activity.description}
      </Text>
      <Text style={styles.assignedTo} numberOfLines={1}>
        Assigned to: {activity.assignedTo.name}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  touchableContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: 'white',
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
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e0e0e0',
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
    flex: 1,
    marginRight: 8,
  },
  activityDate: {
    fontSize: 12,
    color: '#666',
  },
  activityDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
  assignedTo: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default ActivityTimeline;
