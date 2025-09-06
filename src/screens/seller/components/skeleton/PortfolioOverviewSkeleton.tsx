import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Skeleton, SkeletonCard} from '../Skeleton';

export const PortfolioOverviewSkeleton: React.FC = () => (
  <View style={styles.container}>
    <Skeleton width={200} height={24} style={styles.titleSkeleton} />

    {/* Portfolio Value Card Skeleton */}
    <SkeletonCard>
      <View style={styles.portfolioCardContent}>
        <Skeleton width={56} height={56} borderRadius={28} />
        <View style={styles.portfolioTextContainer}>
          <Skeleton width={120} height={28} style={styles.valueSkeleton} />
          <Skeleton width={100} height={14} />
          <Skeleton width={80} height={12} />
        </View>
      </View>
    </SkeletonCard>

    {/* Quick Stats Skeleton */}
    <View style={styles.statsContainer}>
      <View style={styles.statCardWrapper}>
        <SkeletonCard>
          <View style={styles.statCard}>
            <View style={styles.iconContainer}>
              <Skeleton width={40} height={40} borderRadius={20} />
            </View>
            <Skeleton width={60} height={20} style={styles.statValue} />
            <Skeleton width={50} height={12} />
          </View>
        </SkeletonCard>
      </View>
      <View style={styles.statCardWrapper}>
        <SkeletonCard>
          <View style={styles.statCard}>
            <View style={styles.iconContainer}>
              <Skeleton width={40} height={40} borderRadius={20} />
            </View>
            <Skeleton width={60} height={20} style={styles.statValue} />
            <Skeleton width={50} height={12} />
          </View>
        </SkeletonCard>
      </View>
      <View style={styles.statCardWrapper}>
        <SkeletonCard>
          <View style={styles.statCard}>
            <View style={styles.iconContainer}>
              <Skeleton width={40} height={40} borderRadius={20} />
            </View>
            <Skeleton width={60} height={20} style={styles.statValue} />
            <Skeleton width={50} height={12} />
          </View>
        </SkeletonCard>
      </View>
      <View style={styles.statCardWrapper}>
        <SkeletonCard>
          <View style={styles.statCard}>
            <View style={styles.iconContainer}>
              <Skeleton width={40} height={40} borderRadius={20} />
            </View>
            <Skeleton width={60} height={20} style={styles.statValue} />
            <Skeleton width={50} height={12} />
          </View>
        </SkeletonCard>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  titleSkeleton: {
    marginBottom: 16,
  },
  portfolioCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  portfolioTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  valueSkeleton: {
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statCardWrapper: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 12,
    minWidth: 140,
    maxWidth: 180,
  },
  statCard: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 8,
  },
  statValue: {
    marginBottom: 4,
  },
});
