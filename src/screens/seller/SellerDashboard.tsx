import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import BuyerSellerHeader from '../../components/BuyerSellerHeader';
import GetIcon from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import {useAuth} from '../../context/AuthProvider';
import {useDashboardPropertyList} from './hooks/useDashboardPropertyList';
import {useDashboardAnalytics} from './hooks/useDashboardAnalytics';
import {useNavigation} from '@react-navigation/native';
import {SellerBottomTabParamList} from '../../types/navigation';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

import {PortfolioOverview} from './components/PortfolioOverview';
import {PriceAnalytics} from './components/PriceAnalytics';
import {PropertyInsights} from './components/PropertyInsights';
import {LocationStatus} from './components/LocationStatus';
import {RecentActivity} from './components/RecentActivity';
import {FurnishingDistribution} from './components/FurnishingDistribution';
import {PortfolioOverviewSkeleton} from './components/skeleton/PortfolioOverviewSkeleton';
import {PriceAnalyticsSkeleton} from './components/skeleton/PriceAnalyticsSkeleton';
import {PropertyInsightsSkeleton} from './components/skeleton/PropertyInsightsSkeleton';
import {LocationStatusSkeleton} from './components/skeleton/LocationStatusSkeleton';
import {RecentActivitySkeleton} from './components/skeleton/RecentActivitySkeleton';
import {FurnishingDistributionSkeleton} from './components/skeleton/FurnishingDistributionSkeleton';

// Type definitions
type PropertyTypeAnalytics = [string, number][];
type BHKAnalytics = [string, number][];
type FurnishingStats = [string, number][];
type LocationInsights = [string, number][];

interface PriceAnalyticsData {
  avgPrice: number;
  maxPrice: number;
  minPrice: number;
}

interface MonthlyInsightsData {
  thisMonth: number;
  lastMonth: number;
  growth: number;
}

interface ReadyToMoveStatsData {
  readyToMove: number;
  underConstruction: number;
  readyPercentage: number;
}

type NavigationProp = BottomTabNavigationProp<SellerBottomTabParamList>;

const SellerDashboard: React.FC = () => {
  const {user} = useAuth();
  const {
    totalCount,
    refreshing,
    handleRefresh,
    properties,
    activeProperties,
    featuredProperties,
    recentProperties,
    isLoading,
  } = useDashboardPropertyList();

  const {
    priceAnalytics,
    propertyTypeAnalytics,
    bhkAnalytics,
    monthlyInsights,
    readyToMoveStats,
    furnishingStats,
    locationInsights,
    portfolioValue,
  }: {
    priceAnalytics: PriceAnalyticsData | null;
    propertyTypeAnalytics: PropertyTypeAnalytics | null;
    bhkAnalytics: BHKAnalytics | null;
    monthlyInsights: MonthlyInsightsData | null;
    readyToMoveStats: ReadyToMoveStatsData | null;
    furnishingStats: FurnishingStats | null;
    locationInsights: LocationInsights | null;
    portfolioValue: number;
  } = useDashboardAnalytics(properties);

  const navigation = useNavigation<NavigationProp>();

  const handlePropertyCardPress = () => {
    navigation.navigate('Property');
  };
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.MT_PRIMARY_1]}
            tintColor={Colors.MT_PRIMARY_1}
          />
        }>
        {/* Header */}
        <View style={styles.headerContainer}>
          <BuyerSellerHeader
            title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}!`}
            subtitle="Dashboard">
            <TouchableOpacity style={styles.settingsButton}>
              <GetIcon iconName="settings" size={20} color="#666" />
            </TouchableOpacity>
          </BuyerSellerHeader>
        </View>

        {/* Portfolio Overview */}
        {isLoading ? (
          <PortfolioOverviewSkeleton />
        ) : (
          <PortfolioOverview
            properties={properties}
            totalCount={totalCount}
            activeProperties={activeProperties}
            featuredProperties={featuredProperties}
            monthlyInsights={monthlyInsights}
            portfolioValue={portfolioValue}
          />
        )}

        {/* Analytics Section */}
        {properties.length > 0 && (
          <>
            {/* Price Analytics */}
            {isLoading ? (
              <PriceAnalyticsSkeleton />
            ) : (
              <PriceAnalytics priceAnalytics={priceAnalytics} />
            )}

            {/* Property Insights */}
            {isLoading ? (
              <PropertyInsightsSkeleton />
            ) : (
              <PropertyInsights
                propertyTypeAnalytics={propertyTypeAnalytics}
                bhkAnalytics={bhkAnalytics}
                properties={properties}
              />
            )}

            {/* Location & Status */}
            {isLoading ? (
              <LocationStatusSkeleton />
            ) : (
              <LocationStatus
                locationInsights={locationInsights}
                readyToMoveStats={readyToMoveStats}
              />
            )}

            {/* Recent Activity */}
            {isLoading ? (
              <RecentActivitySkeleton />
            ) : (
              <RecentActivity
                recentProperties={recentProperties}
                onPropertyPress={handlePropertyCardPress}
              />
            )}

            {/* Furnishing Distribution */}
            {furnishingStats && furnishingStats.length > 0 && (
              isLoading ? (
                <FurnishingDistributionSkeleton />
              ) : (
                <FurnishingDistribution
                  furnishingStats={furnishingStats}
                  properties={properties}
                />
              )
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 15,
  },
  settingsButton: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SellerDashboard;
