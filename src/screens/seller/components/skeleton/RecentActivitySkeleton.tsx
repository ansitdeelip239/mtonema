import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Skeleton, SkeletonCard} from '../Skeleton';

export const RecentActivitySkeleton: React.FC = () => (
  <View style={styles.container}>
    <Skeleton width={170} height={24} style={styles.titleSkeleton} />

    <SkeletonCard>
      <View style={styles.header}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <Skeleton width={140} height={16} style={styles.headerTitle} />
      </View>
      <View style={styles.list}>
        <View style={styles.propertyItem}>
          <Skeleton width={32} height={32} borderRadius={16} />
          <View style={styles.propertyInfo}>
            <Skeleton width={120} height={14} style={styles.propertyName} />
            <Skeleton width={100} height={11} />
          </View>
          <Skeleton width={60} height={14} />
        </View>
        <View style={styles.propertyItem}>
          <Skeleton width={32} height={32} borderRadius={16} />
          <View style={styles.propertyInfo}>
            <Skeleton width={120} height={14} style={styles.propertyName} />
            <Skeleton width={100} height={11} />
          </View>
          <Skeleton width={60} height={14} />
        </View>
        <View style={styles.propertyItem}>
          <Skeleton width={32} height={32} borderRadius={16} />
          <View style={styles.propertyInfo}>
            <Skeleton width={120} height={14} style={styles.propertyName} />
            <Skeleton width={100} height={11} />
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    marginLeft: 12,
  },
  list: {
    gap: 12,
  },
  propertyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyInfo: {
    marginLeft: 12,
    flex: 1,
  },
  propertyName: {
    marginBottom: 2,
  },
});
