import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {getLighterColor} from '../../../../utils/colorUtils';

interface GroupBadgesProps {
  groups: Array<{
    name: string;
    groupColor: string;
    id: number;
  }>;
}

const GroupBadges: React.FC<GroupBadgesProps> = ({groups}) => (
  <View style={styles.badgeContainer}>
    {groups.map((group, index) => (
      <View
        key={index}
        style={[
          styles.badge,
          {
            backgroundColor: getLighterColor(group.groupColor),
            borderColor: group.groupColor,
          },
        ]}>
        <Text style={[styles.badgeText, {color: group.groupColor}]}>
          {group.name}
        </Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default GroupBadges;
