import React, {useCallback} from 'react';
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

const {width} = Dimensions.get('window');

type Props = NativeStackScreenProps<BuyerBottomTabParamList, 'Dashboard'>;

interface QuickAction {
  id: string;
  title: string;
  icon: IconEnum;
  color: string;
  route?: keyof BuyerBottomTabParamList;
}

const BuyerDashboard: React.FC<Props> = ({navigation}) => {
  const {user} = useAuth();
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
      }
    },
    [user],
  );

  const quickActions: QuickAction[] = [
    {
      id: 'search',
      title: 'Search Properties',
      icon: 'search',
      color: Colors.MT_PRIMARY_1,
      route: 'Search Property',
    },
    {
      id: 'contacted',
      title: 'My Contacts',
      icon: 'phone',
      color: '#FF6B6B',
      route: 'Contacted',
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: 'message',
      color: '#4ECDC4',
      route: 'Contact Us',
    },
  ];

  const dashboardStats: {
    label: string;
    value: string;
    icon: IconEnum;
  }[] = [
    {
      label: 'Contacted Properties',
      value: stats.totalContacted.toString(),
      icon: 'phone',
    },
    {
      label: 'For Sale Properties',
      value: forSaleProperties.length.toString(),
      icon: 'home',
    },
    {
      label: 'For Rent Properties',
      value: forRentProperties.length.toString(),
      icon: 'home',
    },
    {
      label: 'Featured Properties',
      value: featuredProperties.length.toString(),
      icon: 'premium',
    },
  ];

  const renderPropertyCard = (
    property: Property,
    isSaved = false,
    showEnquiry = false,
  ) => {
    // Safety check - if property is undefined or null, don't render
    if (!property) {
      return null;
    }

    const imageUrl = parseImageUrl(property.imageURL || '');

    return (
      <TouchableOpacity
        key={property.propertyId || 'unknown'}
        style={styles.propertyCard}
        activeOpacity={0.8}
        onPress={() => {
          console.log('Navigate to property:', property.propertyId);
        }}>
        <View style={styles.propertyImageContainer}>
          <Image
            source={
              imageUrl && imageUrl.trim() !== ''
                ? {uri: imageUrl}
                : Images.MTESTATES_LOGO
            }
            style={
              imageUrl && imageUrl.trim() !== ''
                ? styles.propertyImage
                : styles.propertyImagePlaceholder
            }
            resizeMode={
              imageUrl && imageUrl.trim() !== '' ? 'cover' : 'contain'
            }
          />
          {Boolean(isSaved) && (
            <View style={styles.savedBadge}>
              <GetIcon iconName="premium" size={16} color="#FF6B6B" />
            </View>
          )}
          {Boolean(property.isFeatured) && (
            <View style={styles.featuredBadge}>
              <GetIcon iconName="premium" size={14} color="white" />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>

        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {String(property.propertyName || 'Unnamed Property')}
          </Text>
          <View style={styles.propertyLocationContainer}>
            <GetIcon iconName="locationPin" size={12} color="#666" />
            <Text style={styles.propertyLocation} numberOfLines={1}>
              {String(
                property.locationAddress ||
                  property.city ||
                  'Location not specified',
              )}
            </Text>
          </View>
          <Text style={styles.propertyPrice}>
            {formatPrice(
              property.price || 0,
              (property.propertyFor || PropertyFor.OTHERS) as
                | typeof PropertyFor.SALE
                | typeof PropertyFor.RENT
                | typeof PropertyFor.OTHERS,
            ) || 'Price not available'}
          </Text>

          {Boolean(property.area) && (
            <View style={styles.propertyDetails}>
              <View style={styles.propertyDetailItem}>
                <GetIcon iconName="area" size={12} color="#666" />
                <Text style={styles.propertyDetail}>
                  {`${property.area || ''} ${property.lmUnit || 'sq ft'}`}
                </Text>
              </View>
              {Boolean(property.bhkType) && (
                <View style={styles.propertyDetailItem}>
                  <GetIcon iconName="doubleBed" size={12} color="#666" />
                  <Text style={styles.propertyDetail}>
                    {String(property.bhkType || '')}
                  </Text>
                </View>
              )}
              <View style={styles.propertyDetailItem}>
                <GetIcon iconName="home" size={12} color="#666" />
                <Text style={styles.propertyDetail}>
                  {String(property.propertyType || 'Property')}
                </Text>
              </View>
            </View>
          )}

          {Boolean(showEnquiry) && (
            <TouchableOpacity
              style={styles.enquiryButton}
              onPress={() => handleEnquiry(property)}
              activeOpacity={0.8}>
              <Text style={styles.enquiryButtonText}>Send Enquiry</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderQuickAction = (action: QuickAction) => (
    <TouchableOpacity
      key={action.id}
      style={[styles.quickActionCard, {borderLeftColor: action.color}]}
      activeOpacity={0.8}
      onPress={() => {
        if (action.route) {
          navigation.navigate(action.route);
        } else {
          console.log('Quick action:', action.id);
        }
      }}>
      <View
        style={[
          styles.quickActionIcon,
          {backgroundColor: action.color + '20'},
        ]}>
        <GetIcon iconName={action.icon} size={24} color={action.color} />
      </View>
      <Text style={styles.quickActionTitle}>{action.title}</Text>
    </TouchableOpacity>
  );

  const renderStatCard = (stat: (typeof dashboardStats)[0]) => (
    <View key={stat.label} style={styles.statCard}>
      <View style={styles.statIcon}>
        <GetIcon iconName={stat.icon} size={20} color={Colors.MT_PRIMARY_1} />
      </View>
      <Text style={styles.statValue}>{stat.value}</Text>
      <Text style={styles.statLabel}>{stat.label}</Text>
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.MT_PRIMARY_1} />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  // Error state
  if (error && !refreshing) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryFetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
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
      {/* Buyer Header */}
      <BuyerSellerHeader
        title={
          user?.name
            ? `Welcome back, ${user.name.split(' ')[0]}!`
            : 'Welcome back!'
        }
        subtitle="Find Your Dream Home"
      />

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        {dashboardStats.map(renderStatCard)}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>
      </View>

      {/* For Sale Properties */}
      {forSaleProperties.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Properties for Sale</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Search Property')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}>
            {forSaleProperties.map(property =>
              renderPropertyCard(property, false, true),
            )}
          </ScrollView>
        </View>
      )}

      {/* For Rent Properties */}
      {forRentProperties.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Properties for Rent</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Search Property')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}>
            {forRentProperties.map(property =>
              renderPropertyCard(property, false, true),
            )}
          </ScrollView>
        </View>
      )}

      {/* Contacted Properties */}
      {contactedProperties.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Contacted</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Contacted')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}>
            {contactedProperties.map(property =>
              renderPropertyCard(property, false, false),
            )}
          </ScrollView>
        </View>
      )}

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Properties</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Search Property')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}>
            {featuredProperties.map(property =>
              renderPropertyCard(property, false, true),
            )}
          </ScrollView>
        </View>
      )}

      {/* Empty state for new users */}
      {forSaleProperties.length === 0 &&
        forRentProperties.length === 0 &&
        featuredProperties.length === 0 &&
        contactedProperties.length === 0 && (
          <View style={styles.emptyStateContainer}>
            <GetIcon iconName="home" size={80} color="#ddd" />
            <Text style={styles.emptyStateTitle}>
              Start Your Property Journey
            </Text>
            <Text style={styles.emptyStateText}>
              Search for properties and start building your personalized
              dashboard
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => navigation.navigate('Search Property')}>
              <Text style={styles.emptyStateButtonText}>Start Searching</Text>
            </TouchableOpacity>
          </View>
        )}

      {/* Bottom spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

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
    width: (width - 50) / 2,
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
    width: width * 0.7,
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
