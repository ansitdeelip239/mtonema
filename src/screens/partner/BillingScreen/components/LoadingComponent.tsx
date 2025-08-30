import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import { useTranslation } from 'react-i18next';

export const LoadingComponent = React.memo(() => {
  const { t } = useTranslation();

  return (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#6366f1" />
    <Text style={styles.loadingText}>{t('billing.loading.billingInfo', 'Loading billing information...')}</Text>
  </View>
  );
});

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
});
