import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface TeamHeaderProps {
  memberCount: number;
}

const TeamHeader: React.FC<TeamHeaderProps> = React.memo(({memberCount}) => {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.subtitle}>
        {memberCount} member{memberCount !== 1 ? 's' : ''}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
});

export default TeamHeader;
