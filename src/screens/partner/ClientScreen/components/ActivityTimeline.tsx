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
  isFirst?: boolean; // Add isFirst prop
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

  return (
    <TouchableOpacity
      style={styles.touchableContainer}
      onPress={() => onPress(activity)}>
      <View style={styles.timelineSection}>
        {/* Line coming from above (only if it's not the first item) */}
        {!isFirst && <View style={[styles.verticalLineTop, {backgroundColor: '#e0e0e0'}]} />}

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
          <View
            style={[styles.verticalLineBottom, {backgroundColor: '#e0e0e0'}]}
          />
        )}
      </View>

      <View style={styles.contentSection}>
        <View style={styles.activityHeader}>
          <Text
            style={[styles.activityType, {color: activityColor}]}
            numberOfLines={1}>
            {activity.activityType.name}
          </Text>
          <Text style={styles.activityDate}>
            {formatDate(activity.createdOn, 'PPp')}
          </Text>
        </View>
        {activity.description && activity.description !== '-' && (
          <Text style={styles.activityDescription} numberOfLines={2}>
            {activity.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

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
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
    zIndex: 1,
  },
  verticalLineBottom: {
    position: 'absolute',
    top: 32, // Start from the bottom of the icon
    bottom: -8, // Extend downward to connect to the next icon
    width: 2,
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
    zIndex: 1,
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
