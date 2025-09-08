import React, {useCallback, useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import GetIcon, {IconEnum} from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import {BuyerBottomTabParamList} from '../../types/navigation';
import BuyerSellerHeader from '../../components/BuyerSellerHeader';
import {useDashboardData} from './hooks/useDashboardData';
import {useAuth} from '../../context/AuthProvider';
import {Property} from '../../types';
import {parseImageUrl, formatPrice} from './SearchProperties/utils/helpers';
import {PropertyFor} from '../../constants/MasterDetails';
import Images from '../../constants/Images';
import Toast from 'react-native-toast-message';
import BuyerService from '../../services/BuyerService';
import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const QUICK_ACTION_WIDTH = (width - 50) / 2;

type Props = NativeStackScreenProps<BuyerBottomTabParamList, 'Dashboard'>;

interface QuickAction {
  id: string;
  title: string;
  icon: IconEnum;
  color: string;
  route?: keyof BuyerBottomTabParamList;
}

interface DashboardStat {
  label: string;
  value: string;
  icon: IconEnum;
}

// Memoized components for better performance
const StatCard = React.memo<{stat: DashboardStat}>(({stat}) => (
  <View style={styles.statCard}>
    <View style={styles.statIcon}>
      <GetIcon iconName={stat.icon} size={20} color={Colors.MT_PRIMARY_1} />
    </View>
    <Text style={styles.statValue}>{stat.value}</Text>
    <Text style={styles.statLabel}>{stat.label}</Text>
  </View>
));

const QuickActionCard = React.memo<{
  action: QuickAction;
  onPress: (route?: keyof BuyerBottomTabParamList) => void;
}>(({action, onPress}) => (
  <TouchableOpacity
    style={[styles.quickActionCard, {borderLeftColor: action.color}]}
    activeOpacity={0.8}
    onPress={() => onPress(action.route)}>
    <View
      style={[styles.quickActionIcon, {backgroundColor: action.color + '20'}]}>
      <GetIcon iconName={action.icon} size={24} color={action.color} />
    </View>
    <Text style={styles.quickActionTitle}>{action.title}</Text>
  </TouchableOpacity>
));

const PropertyCard = React.memo<{
  property: Property;
  isSaved?: boolean;
  showEnquiry?: boolean;
  onEnquiry?: (property: Property) => void;
  onPress?: (property: Property) => void;
  isLoading?: boolean;
}>(
  ({
    property,
    isSaved = false,
    showEnquiry = false,
    onEnquiry,
    onPress,
    isLoading = false,
  }) => {
    const {t} = useTranslation();
    const handlePress = useCallback(() => {
      onPress?.(property);
    }, [onPress, property]);

    const handleEnquiry = useCallback(() => {
      onEnquiry?.(property);
    }, [onEnquiry, property]);

    // Early return for invalid property - after hooks
    if (!property) {
      return null;
    }

    const imageUrl = parseImageUrl(property.imageURL || '');
    const hasValidImage = imageUrl && imageUrl.trim() !== '';

    return (
      <TouchableOpacity
        style={styles.propertyCard}
        activeOpacity={0.8}
        onPress={handlePress}>
        <View style={styles.propertyImageContainer}>
          <Image
            source={hasValidImage ? {uri: imageUrl} : Images.MTESTATES_LOGO}
            style={
              hasValidImage
                ? styles.propertyImage
                : styles.propertyImagePlaceholder
            }
            resizeMode={hasValidImage ? 'cover' : 'contain'}
          />
          {isSaved && (
            <View style={styles.savedBadge}>
              <GetIcon iconName="premium" size={16} color="#FF6B6B" />
            </View>
          )}
          {property.isFeatured && (
            <View style={styles.featuredBadge}>
              <GetIcon iconName="premium" size={14} color="white" />
              <Text style={styles.featuredText}>
                {t('dashboard.labels.featured')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {property.propertyName || t('dashboard.labels.unnamedProperty')}
          </Text>

          <View style={styles.propertyLocationContainer}>
            <GetIcon iconName="locationPin" size={12} color="#666" />
            <Text style={styles.propertyLocation} numberOfLines={1}>
              {property.locationAddress ||
                property.city ||
                t('dashboard.labels.locationNotSpecified')}
            </Text>
          </View>

          <Text style={styles.propertyPrice}>
            {formatPrice(
              property.price || 0,
              (property.propertyFor || PropertyFor.OTHERS) as
                | typeof PropertyFor.SALE
                | typeof PropertyFor.RENT
                | typeof PropertyFor.OTHERS,
            ) || t('dashboard.labels.priceNotAvailable')}
          </Text>

          {property.area && (
            <View style={styles.propertyDetails}>
              <View style={styles.propertyDetailItem}>
                <GetIcon iconName="area" size={12} color="#666" />
                <Text style={styles.propertyDetail}>
                  {`${property.area} ${property.lmUnit || 'sq ft'}`}
                </Text>
              </View>
              {property.bhkType && (
                <View style={styles.propertyDetailItem}>
                  <GetIcon iconName="doubleBed" size={12} color="#666" />
                  <Text style={styles.propertyDetail}>{property.bhkType}</Text>
                </View>
              )}
              <View style={styles.propertyDetailItem}>
                <GetIcon iconName="home" size={12} color="#666" />
                <Text style={styles.propertyDetail}>
                  {property.propertyType || t('dashboard.labels.property')}
                </Text>
              </View>
            </View>
          )}

          {showEnquiry && (
            <TouchableOpacity
              style={[
                styles.enquiryButton,
                isLoading && styles.enquiryButtonDisabled,
              ]}
              onPress={handleEnquiry}
              activeOpacity={0.8}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.enquiryButtonText}>
                  {t('dashboard.actions.sendEnquiry')}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  },
);

const PropertySection = React.memo<{
  title: string;
  properties: Property[];
  onSeeAll: () => void;
  onEnquiry?: (property: Property) => void;
  onPropertyPress?: (property: Property) => void;
  showEnquiry?: boolean;
  loadingEnquiries?: {[key: string]: boolean};
}>(
  ({
    title,
    properties,
    onSeeAll,
    onEnquiry,
    onPropertyPress,
    showEnquiry = false,
    loadingEnquiries = {},
  }) => {
    const {t} = useTranslation();
    if (properties.length === 0) {
      return null;
    }

    // Create a safe section key for unique identification
    const sectionKey = title.toLowerCase().replace(/\s+/g, '-');

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAllText}>
              {t('dashboard.actions.seeAll')}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}>
          {properties.map((property, index) => {
            // Create absolutely unique key combining section, propertyId, and index
            const uniqueKey = `${sectionKey}-${
              property.propertyId || 'no-id'
            }-${index}`;

            return (
              <PropertyCard
                key={uniqueKey}
                property={property}
                showEnquiry={showEnquiry}
                onEnquiry={onEnquiry}
                onPress={onPropertyPress}
                isLoading={loadingEnquiries[property.propertyId || 'unknown']}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  },
);

const LoadingState = React.memo(() => {
  const {t} = useTranslation();
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.MT_PRIMARY_1} />
      <Text style={styles.loadingText}>{t('dashboard.loading.text')}</Text>
    </View>
  );
});

const ErrorState = React.memo<{error: string; onRetry: () => void}>(
  ({error, onRetry}) => {
    const {t} = useTranslation();
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>{t('dashboard.error.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  },
);

const EmptyState = React.memo<{onStartSearching: () => void}>(
  ({onStartSearching}) => {
    const {t} = useTranslation();
    return (
      <View style={styles.emptyStateContainer}>
        <GetIcon iconName="home" size={80} color="#ddd" />
        <Text style={styles.emptyStateTitle}>{t('dashboard.emptyState.title')}</Text>
        <Text style={styles.emptyStateText}>
          {t('dashboard.emptyState.message')}
        </Text>
        <TouchableOpacity
          style={styles.emptyStateButton}
          onPress={onStartSearching}>
          <Text style={styles.emptyStateButtonText}>{t('dashboard.actions.startSearching')}</Text>
        </TouchableOpacity>
      </View>
    );
  },
);

const BuyerDashboard: React.FC<Props> = ({navigation}) => {
  const {user} = useAuth();
  const {t} = useTranslation();
  const [loadingEnquiries, setLoadingEnquiries] = useState<{
    [key: string]: boolean;
  }>({});

  const {
    stats,
    forSaleProperties,
    forRentProperties,
    featuredProperties,
    contactedProperties,
    loading,
    error,
    refreshing,
    onRefresh,
    retryFetch,
  } = useDashboardData();

  // Memoized quick actions
  const quickActions = useMemo<QuickAction[]>(
    () => [
      {
        id: 'search',
        title: t('dashboard.quickActions.searchProperties'),
        icon: 'search',
        color: Colors.MT_PRIMARY_1,
        route: 'Search Property',
      },
      {
        id: 'contacted',
        title: t('dashboard.quickActions.myContacts'),
        icon: 'phone',
        color: '#FF6B6B',
        route: 'Contacted',
      },
      {
        id: 'contact',
        title: t('dashboard.quickActions.contactUs'),
        icon: 'message',
        color: '#4ECDC4',
        route: 'Contact Us',
      },
    ],
    [t],
  );

  // Memoized dashboard stats
  const dashboardStats = useMemo<DashboardStat[]>(
    () => [
      {
        label: t('dashboard.stats.contactedProperties'),
        value: stats.totalContacted.toString(),
        icon: 'phone',
      },
      {
        label: t('dashboard.stats.forSaleProperties'),
        value: forSaleProperties.length.toString(),
        icon: 'home',
      },
      {
        label: t('dashboard.stats.forRentProperties'),
        value: forRentProperties.length.toString(),
        icon: 'home',
      },
      {
        label: t('dashboard.stats.featuredProperties'),
        value: featuredProperties.length.toString(),
        icon: 'premium',
      },
    ],
    [
      stats.totalContacted,
      forSaleProperties.length,
      forRentProperties.length,
      featuredProperties.length,
      t,
    ],
  );

  // Memoized welcome message
  const welcomeMessage = useMemo(
    () =>
      user?.name
        ? `${t('dashboard.welcome.back')}, ${user.name.split(' ')[0]}!`
        : t('dashboard.welcome.back'),
    [user?.name, t],
  );

  // Check if dashboard has no content
  const hasNoContent = useMemo(
    () =>
      forSaleProperties.length === 0 &&
      forRentProperties.length === 0 &&
      featuredProperties.length === 0 &&
      contactedProperties.length === 0,
    [
      forSaleProperties.length,
      forRentProperties.length,
      featuredProperties.length,
      contactedProperties.length,
    ],
  );

  // Handle property contact/enquiry
  const handleEnquiry = useCallback(
    async (property: Property) => {
      if (!user) {
        Toast.show({
          type: 'error',
          text1: 'Please login to make enquiry',
        });
        return;
      }

      const propertyId = property.propertyId || 'unknown';

      setLoadingEnquiries(prev => ({...prev, [propertyId]: true}));

      try {
        const response = await BuyerService.contactProperty(
          user.id,
          property.propertyId,
        );

        if (response?.success) {
          Toast.show({
            type: 'success',
            text1: 'Enquiry sent successfully',
            text2: 'The seller will contact you soon.',
          });
        } else {
          throw new Error('Failed to send enquiry');
        }
      } catch (enquiryError) {
        console.error('Enquiry error:', enquiryError);
        Toast.show({
          type: 'error',
          text1: 'Failed to send enquiry',
          text2: 'Please try again later.',
        });
      } finally {
        setLoadingEnquiries(prev => {
          const newState = {...prev};
          delete newState[propertyId];
          return newState;
        });
      }
    },
    [user],
  );

  // Handle property press
  const handlePropertyPress = useCallback((property: Property) => {
    console.log('Navigate to property:', property.propertyId);
    // Add navigation logic here
  }, []);

  // Handle quick action press
  const handleQuickActionPress = useCallback(
    (route?: keyof BuyerBottomTabParamList) => {
      if (route) {
        navigation.navigate(route);
      }
    },
    [navigation],
  );

  // Handle navigation callbacks
  const navigateToSearch = useCallback(
    () => navigation.navigate('Search Property'),
    [navigation],
  );
  const navigateToContacted = useCallback(
    () => navigation.navigate('Contacted'),
    [navigation],
  );

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error && !refreshing) {
    return <ErrorState error={error} onRetry={retryFetch} />;
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.MT_PRIMARY_1]}
        />
      }>
      {/* Header */}
      <BuyerSellerHeader
        title={welcomeMessage}
        subtitle={t('dashboard.welcome.subtitle')}
      />

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        {dashboardStats.map(stat => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('dashboard.sections.quickActions')}</Text>
        <View style={styles.quickActionsContainer}>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(action => (
              <QuickActionCard
                key={action.id}
                action={action}
                onPress={handleQuickActionPress}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Property Sections */}
      <PropertySection
        title={t('dashboard.sections.propertiesForSale')}
        properties={forSaleProperties}
        onSeeAll={navigateToSearch}
        onEnquiry={handleEnquiry}
        onPropertyPress={handlePropertyPress}
        showEnquiry={true}
        loadingEnquiries={loadingEnquiries}
      />

      <PropertySection
        title={t('dashboard.sections.propertiesForRent')}
        properties={forRentProperties}
        onSeeAll={navigateToSearch}
        onEnquiry={handleEnquiry}
        onPropertyPress={handlePropertyPress}
        showEnquiry={true}
        loadingEnquiries={loadingEnquiries}
      />

      <PropertySection
        title={t('dashboard.sections.recentlyContacted')}
        properties={contactedProperties}
        onSeeAll={navigateToContacted}
        onPropertyPress={handlePropertyPress}
      />

      <PropertySection
        title={t('dashboard.sections.featuredProperties')}
        properties={featuredProperties}
        onSeeAll={navigateToSearch}
        onEnquiry={handleEnquiry}
        onPropertyPress={handlePropertyPress}
        showEnquiry={true}
        loadingEnquiries={loadingEnquiries}
      />

      {/* Empty State */}
      {hasNoContent && <EmptyState onStartSearching={navigateToSearch} />}

      {/* Bottom spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

// Styles remain the same but with some optimizations
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.MT_PRIMARY_1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    marginTop: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.MT_PRIMARY_1 + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.MT_PRIMARY_1,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.MT_PRIMARY_1,
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionsContainer: {
    marginTop: 15,
  },
  quickActionCard: {
    width: QUICK_ACTION_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  horizontalScroll: {
    paddingRight: 20,
  },
  propertyCard: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  propertyImageContainer: {
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  propertyImagePlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  featuredBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: Colors.MT_PRIMARY_1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  featuredText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.MT_PRIMARY_1,
    marginBottom: 8,
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  propertyDetail: {
    fontSize: 11,
    color: '#666',
    flex: 1,
    marginLeft: 4,
  },
  enquiryButton: {
    backgroundColor: Colors.MT_PRIMARY_1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  enquiryButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  enquiryButtonDisabled: {
    opacity: 0.6,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginTop: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyStateButton: {
    backgroundColor: Colors.MT_PRIMARY_1,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
  propertyLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  propertyDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});

export default BuyerDashboard;
