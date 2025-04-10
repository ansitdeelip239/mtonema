import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {ClientActivityDataModel} from '../../../../types';
import ActivityTimeline from './ActivityTimeline';
import Colors from '../../../../constants/Colors';

interface RecentActivitiesCardProps {
  activities: ClientActivityDataModel[];
  onAddActivity: () => void;
  onActivityPress: (activity: ClientActivityDataModel) => void;
}

const RecentActivitiesCard: React.FC<RecentActivitiesCardProps> = ({
  activities,
  onAddActivity,
  onActivityPress,
}) => {
  const renderActivities = () => {
    if (!activities || activities.length === 0) {
      return <Text style={styles.noActivityText}>No activities yet</Text>;
    }

    const sortedActivities = activities
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime(),
      )
      .slice(0, 5);

    return sortedActivities.map((activity, index) => (
      <ActivityTimeline
        key={`activity-${activity.id}`}
        activity={activity}
        isLast={index === sortedActivities.length - 1}
        onPress={onActivityPress}
      />
    ));
  };

  return (
    <View style={styles.infoCard}>
      <View style={styles.activityHeader}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        <TouchableOpacity
          style={styles.addActivityButton}
          onPress={onAddActivity}>
          <Text style={styles.addActivityButtonText}>Add Activity</Text>
        </TouchableOpacity>
      </View>
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
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addActivityButton: {
    backgroundColor: Colors.main,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  addActivityButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  noActivityText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default RecentActivitiesCard;
