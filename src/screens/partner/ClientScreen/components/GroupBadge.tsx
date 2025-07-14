import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface GroupBadgesProps {
  groups: Array<{
    name: string;
    groupColor: string;
    id: number;
  }>;
}

const GroupBadges: React.FC<GroupBadgesProps> = ({groups}) => {
  // Maximum number of badges to display
  const MAX_VISIBLE_BADGES = 5;
  const visibleGroups = groups.slice(0, MAX_VISIBLE_BADGES);
  const remainingCount = Math.max(0, groups.length - MAX_VISIBLE_BADGES);

  return (
    <View style={styles.badgeContainer}>
      {visibleGroups.map((group, index) => (
        <View
          key={index}
          style={[
            styles.badge,
            {
              backgroundColor: group.groupColor,
            },
          ]}>
          <Text style={styles.badgeText}>{group.name}</Text>
        </View>
      ))}

      {remainingCount > 0 && (
        <View style={[styles.badge, styles.moreBadge]}>
          <Text style={styles.badgeText}>+{remainingCount} more</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white', // Set text color to white for all badges
  },
  moreBadge: {
    backgroundColor: '#666', // Darker gray for the "more" badge
  },
});

export default GroupBadges;
