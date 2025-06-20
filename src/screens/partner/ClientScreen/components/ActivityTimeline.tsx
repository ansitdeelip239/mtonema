import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import GetIcon, {IconEnum} from '../../../../components/GetIcon';
import {ClientActivityDataModel} from '../../../../types';
import {formatDate} from '../../../../utils/dateUtils';
import Colors from '../../../../constants/Colors';

const getActivityIcon = (activityType: string): IconEnum => {
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
  if (type.includes('assigned')) {
    return 'user';
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
  isClickable?: boolean;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activity,
  isFirst = false,
  isLast = false,
  onPress,
  isClickable = true,
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const activityColor = getActivityColor(activity.activityType.name);
  const hasDescription = activity.description && activity.description !== '-';

  // Format date and time separately for different styling
  const dateString = formatDate(activity.createdOn, 'MMM d');
  const timeString = formatDate(activity.createdOn, 'h:mm a');

  const handlePress = () => {
    if (isClickable) {
      onPress(activity);
    }
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  // Check if description needs truncation (rough estimation)
  const needsTruncation = hasDescription && activity.description.length > 100;

  return (
    <TouchableOpacity
      style={styles.touchableContainer}
      onPress={handlePress}
      disabled={!isClickable}
      activeOpacity={isClickable ? 0.7 : 1}>
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

        {/* Description with fold/unfold functionality */}
        {hasDescription && (
          <View style={styles.descriptionContainer}>
            <Text
              style={styles.activityDescription}
              numberOfLines={isDescriptionExpanded ? undefined : 2}>
              {activity.description}
            </Text>
            {needsTruncation && (
              <TouchableOpacity
                style={styles.foldUnfoldButton}
                onPress={toggleDescription}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <View
                  style={[
                    styles.chevronContainer,
                    isDescriptionExpanded && styles.chevronRotated,
                  ]}>
                  <GetIcon iconName="chevronRight" size={12} color="#666" />
                </View>
                <Text style={styles.foldUnfoldText}>
                  {isDescriptionExpanded ? 'Show less' : 'Show more'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Created by */}
        <View style={styles.createdByContainer}>
          <View style={styles.userIconContainer}>
            <GetIcon iconName="user" size={12} color="white" />
          </View>
          <View style={styles.createdByTextContainer}>
            <View style={styles.createdByNameRow}>
              <Text style={styles.createdByLabel}>by </Text>
              <Text style={styles.createdByName}>
                {JSON.parse(activity.createdBy).Name}
              </Text>
            </View>
            <Text style={styles.createdByEmail}>
              ({JSON.parse(activity.createdBy).Email})
            </Text>
          </View>
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
  activityType: {
    fontSize: 13,
    fontWeight: '700', // Bold
    color: '#000', // Black
    marginBottom: 4,
  },
  descriptionContainer: {
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    color: '#777', // Slightly gray
    lineHeight: 18,
  },
  foldUnfoldButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingVertical: 2,
  },
  chevronContainer: {
    transform: [{rotate: '90deg'}], // Point down when collapsed
  },
  chevronRotated: {
    transform: [{rotate: '270deg'}], // Point up when expanded
  },
  foldUnfoldText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
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
  createdByTextContainer: {
    flexDirection: 'column',
  },
  createdByNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createdByLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
  },
  createdByName: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  createdByEmail: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
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
