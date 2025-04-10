import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Client} from '../../../../types';

interface GroupsCardProps {
  client: Client;
}

const GroupsCard: React.FC<GroupsCardProps> = ({client}) => {
  if (!client.groups || client.groups.length === 0) {
    return null;
  }

  return (
    <View style={styles.infoCard}>
      <Text style={styles.sectionTitle}>Groups</Text>
      <View style={styles.groupsContainer}>
        {client.groups.map((group, index) => (
          <View
            key={`group-${group.id}-${group.name}-${index}`}
            style={[
              styles.groupBadge,
              {backgroundColor: `${group.groupColor}20`},
            ]}>
            <Text style={[styles.groupText, {color: group.groupColor}]}>
              {group.name}
            </Text>
          </View>
        ))}
      </View>
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
  groupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  groupBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  groupText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default GroupsCard;
