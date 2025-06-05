import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {ClientActivityDataModel} from '../../../../types';
import ActivityTimeline from './ActivityTimeline';
import GetIcon from '../../../../components/GetIcon';
import {useTheme} from '../../../../context/ThemeProvider';

interface RecentActivitiesCardProps {
  activities?: ClientActivityDataModel[];
  onAddActivity: () => void;
  onActivityPress: (activity: ClientActivityDataModel) => void;
}

const RecentActivitiesCard: React.FC<RecentActivitiesCardProps> = ({
  activities,
  onAddActivity,
  onActivityPress,
}) => {
  const {theme} = useTheme();

  const renderActivities = () => {
    if (!activities || activities.length === 0) {
      return (
        <View>
          {renderAddButton(true)}
          <Text style={styles.noActivityText}>No activities yet</Text>
        </View>
      );
    }

    const sortedActivities = activities
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime(),
      )
      .slice(0, 5);

    return (
      <View>
        {renderAddButton(false)}
        {sortedActivities.map((activity, index) => (
          <ActivityTimeline
            key={activity.id}
            activity={activity}
            isFirst={index === 0}
            isLast={index === sortedActivities.length - 1}
            onPress={onActivityPress}
          />
        ))}
      </View>
    );
  };

  const renderAddButton = (isLast: boolean) => {
    return (
      <TouchableOpacity
        style={styles.addButtonContainer}
        onPress={onAddActivity}>
        <View style={styles.timelineSection}>

          <View
            style={[
              styles.iconContainer,
              {backgroundColor: theme.primaryColor},
            ]}>
            <GetIcon iconName="plus" size="16" color="white" />
          </View>

          {!isLast && (
            <View style={[styles.extendedVerticalLine, styles.lineColor]} /> // Use extended line
          )}
        </View>

        <View style={styles.contentSection}>
          <Text style={[styles.addActivityText, {color: theme.primaryColor}]}>Add Activity</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.infoCard}>
      <Text style={styles.sectionTitle}>Recent Activities</Text>
      {renderActivities()}
    </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  touchableContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  addButtonContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingBottom: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  verticalLineBottom: {
    position: 'absolute',
    top: 32,
    bottom: -8,
    width: 2,
    alignSelf: 'center',
    zIndex: 1,
  },
  lineColor: {
    backgroundColor: '#e0e0e0',
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
  },
  addActivityText: {
    fontSize: 14,
    fontWeight: '900',
  },
  noActivityText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  extendedVerticalLine: {
    position: 'absolute',
    top: 32,
    bottom: -16,
    width: 2,
    alignSelf: 'center',
    zIndex: 1,
  },
});

export default RecentActivitiesCard;
