import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';
import GetIcon from '../../../../components/GetIcon';

const ContentEmptyState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.emptyContainer}>
      <GetIcon iconName="notes" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {t('contentTemplate.emptyState.title', 'No Content Templates')}
      </Text>
      <Text style={styles.emptySubtitle}>
        {t('contentTemplate.emptyState.subtitle', 'You haven\'t created any content templates yet.')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default ContentEmptyState;
