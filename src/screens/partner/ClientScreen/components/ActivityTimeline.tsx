import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import GetIcon from '../../../../components/GetIcon';
import {ClientActivityDataModel} from '../../../../types';
import {formatDate} from '../../../../utils/dateUtils';
import Colors from '../../../../constants/Colors';

const getActivityIcon = (activityType: string) => {
  const type = activityType.toLowerCase();
  if (type.includes('phone call')) {
    return 'phone';
  }
  if (type.includes('whatsapp message')) {
    return 'whatsapp';
  }
  if (type.includes('meeting')) {
    return 'meeting';
  }
  if (type.includes('client created')) {
    return 'userPlus';
  }
  return 'notes';
};

const getActivityColor = (activityType: string) => {
  const type = activityType.toLowerCase();
  if (type.includes('phone call')) {
    return Colors.MT_PRIMARY_1;
  }
  if (type.includes('whatsapp message')) {
    return '#25D366'; // WhatsApp green
  }
  return '#666'; // Default gray for notes
};

interface ActivityTimelineProps {
  activity: ClientActivityDataModel;
  isFirst?: boolean;
  isLast?: boolean;
  onPress: (activity: ClientActivityDataModel) => void;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activity,
  isFirst = false,
  isLast = false,
  onPress,
}) => {
  const activityColor = getActivityColor(activity.activityType.name);
  const hasDescription = activity.description && activity.description !== '-';

  // Format date and time separately for different styling
  const dateString = formatDate(activity.createdOn, 'MMM d');
  const timeString = formatDate(activity.createdOn, 'h:mm a');

  return (
    <TouchableOpacity
      style={styles.touchableContainer}
      onPress={() => onPress(activity)}>
      <View style={styles.timelineSection}>
        {/* Line coming from above (only if it's not the first item) */}
        {!isFirst && (
          <View style={[styles.verticalLineTop, styles.lineColor]} />
        )}

        {/* Icon container */}
        <View style={[styles.iconContainer, {backgroundColor: activityColor}]}>
          <GetIcon
            iconName={getActivityIcon(activity.activityType.name)}
            size="16"
            color="white"
          />
        </View>

        {/* Line extending below (except for last item) */}
        {!isLast && (
          <View style={[styles.verticalLineBottom, styles.lineColor]} />
        )}
      </View>

      <View style={styles.contentSection}>
        {/* Date and time with different styling */}
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateText}>{dateString}</Text>
          <Text style={styles.timeText}> {timeString}</Text>
        </View>

        {/* Activity Type */}
        <Text style={styles.activityType} numberOfLines={1}>
          {activity.activityType.name}
        </Text>

        {/* Description (if exists) */}
        {hasDescription && (
          <Text style={styles.activityDescription} numberOfLines={2}>
            {activity.description}
          </Text>
        )}

        {/* Created by */}
        <View style={styles.createdByContainer}>
          <View style={styles.userIconContainer}>
            <GetIcon iconName="user" size={12} color="white" />
          </View>
          <Text style={styles.createdByText}>by {activity.createdBy}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingTop: 0,
    backgroundColor: 'white',
  },
  timelineSection: {
    alignItems: 'center',
    width: 40,
    marginRight: 12,
    position: 'relative',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, // Ensure icon appears above the lines
  },
  verticalLineTop: {
    position: 'absolute',
    top: -8, // Extend upward beyond the top padding
    height: 16, // Half above the icon
    width: 2,
    alignSelf: 'center',
    zIndex: 1,
  },
  lineColor: {
    backgroundColor: '#e0e0e0',
  },
  verticalLineBottom: {
    position: 'absolute',
    top: 32, // Start from the bottom of the icon
    bottom: -8, // Extend downward to connect to the next icon
    width: 2,
    alignSelf: 'center',
    zIndex: 1,
  },
  contentSection: {
    flex: 1,
    paddingBottom: 8,
  },
  // New style for centering content when there's no description
  contentSectionCentered: {
    justifyContent: 'center',
    paddingBottom: 0,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityType: {
    fontSize: 13,
    fontWeight: '700', // Bold
    color: '#000', // Black
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    color: '#777', // Slightly gray
    lineHeight: 18,
    marginBottom: 4,
  },
  assignedTo: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  createdByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  userIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    backgroundColor: '#999', // Gray color for icon
  },
  createdByText: {
    fontSize: 12,
    color: '#777', // Gray
    fontWeight: '400',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700', // Bold date
    color: '#333',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '400', // Regular time
    color: '#333',
  },
});

export default ActivityTimeline;
