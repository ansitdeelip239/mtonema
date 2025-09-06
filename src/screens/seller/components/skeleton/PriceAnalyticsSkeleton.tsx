import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Skeleton, SkeletonCard} from '../Skeleton';

export const PriceAnalyticsSkeleton: React.FC = () => (
  <View style={styles.container}>
    <Skeleton width={150} height={24} style={styles.titleSkeleton} />

    <SkeletonCard>
      <View style={styles.content}>
        <View style={styles.metricContainer}>
          <Skeleton width={32} height={32} borderRadius={16} />
          <Skeleton width={50} height={11} style={styles.labelSkeleton} />
          <Skeleton width={60} height={14} />
        </View>
        <View style={styles.metricContainer}>
          <Skeleton width={32} height={32} borderRadius={16} />
          <Skeleton width={50} height={11} style={styles.labelSkeleton} />
          <Skeleton width={60} height={14} />
        </View>
        <View style={styles.metricContainer}>
          <Skeleton width={32} height={32} borderRadius={16} />
          <Skeleton width={50} height={11} style={styles.labelSkeleton} />
          <Skeleton width={60} height={14} />
        </View>
      </View>
    </SkeletonCard>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  titleSkeleton: {
    marginBottom: 16,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricContainer: {
    alignItems: 'center',
    flex: 1,
  },
  labelSkeleton: {
    marginTop: 8,
    marginBottom: 4,
  },
});
