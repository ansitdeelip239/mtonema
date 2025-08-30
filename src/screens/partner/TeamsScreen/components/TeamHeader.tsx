import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { useTranslation } from 'react-i18next';

interface TeamHeaderProps {
  memberCount: number;
}

const TeamHeader: React.FC<TeamHeaderProps> = React.memo(({memberCount}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.titleContainer}>
      <Text style={styles.subtitle}>
        {memberCount} {memberCount === 1 ? t('teams.labels.member', 'member') : t('teams.labels.members', 'members')}
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
