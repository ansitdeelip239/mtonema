import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import GetIcon, {IconEnum} from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import {BuyerBottomTabParamList} from '../../types/navigation';
import BuyerSellerHeader from '../../components/BuyerSellerHeader';

const {width} = Dimensions.get('window');

type Props = NativeStackScreenProps<BuyerBottomTabParamList, 'Dashboard'>;

interface PropertyCard {
  id: string;
  title: string;
  location: string;
  price: string;
  image: any; // Changed to any for image source
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
}

interface QuickAction {
  id: string;
  title: string;
  icon: IconEnum;
  color: string;
}

const BuyerDashboard: React.FC<Props> = ({navigation: _navigation}) => {
  // Mock data for demonstration with placeholder images
  const [recentlyViewed] = useState<PropertyCard[]>([
    {
      id: '1',
      title: 'Modern 3BHK Apartment',
      location: 'Andheri West, Mumbai',
      price: '₹2.5 Cr',
      image: {uri: 'https://picsum.photos/300/200?random=1'}, // Dummy stock image
      type: 'Apartment',
      bedrooms: 3,
      bathrooms: 2,
      area: '1,200 sq ft',
    },
    {
      id: '2',
      title: 'Luxury Villa',
      location: 'Thane West',
      price: '₹4.2 Cr',
      image: {uri: 'https://picsum.photos/300/200?random=2'}, // Dummy stock image
      type: 'Villa',
      bedrooms: 4,
      bathrooms: 3,
      area: '2,500 sq ft',
    },
  ]);

  const [savedProperties] = useState<PropertyCard[]>([
    {
      id: '3',
      title: 'Penthouse with Sea View',
      location: 'Bandra West, Mumbai',
      price: '₹8.5 Cr',
      image: {uri: 'https://picsum.photos/300/200?random=3'}, // Dummy stock image
      type: 'Penthouse',
      bedrooms: 4,
      bathrooms: 4,
      area: '3,200 sq ft',
    },
  ]);

  const quickActions: QuickAction[] = [
    {
      id: 'search',
      title: 'Search Properties',
      icon: 'search',
      color: Colors.MT_PRIMARY_1,
    },
    {
      id: 'favorites',
      title: 'My Favorites',
      icon: 'premium',
      color: '#FF6B6B',
    },
    {
      id: 'recent',
      title: 'Recent Searches',
      icon: 'time',
      color: '#4ECDC4',
    },
    {
      id: 'calculator',
      title: 'EMI Calculator',
      icon: 'rupee',
      color: '#45B7D1',
    },
  ];

  const stats = [
    {label: 'Properties Viewed', value: '24', icon: 'eye' as IconEnum},
    {label: 'Saved Properties', value: '8', icon: 'premium' as IconEnum},
    {label: 'Searches Made', value: '12', icon: 'search' as IconEnum},
    {label: 'Offers Received', value: '3', icon: 'transaction' as IconEnum},
  ];

  const renderPropertyCard = (property: PropertyCard, isSaved = false) => (
    <TouchableOpacity
      key={property.id}
      style={styles.propertyCard}
      activeOpacity={0.8}
      onPress={() => {
        // Navigate to property details
        console.log('Navigate to property:', property.id);
      }}>
      <View style={styles.propertyImageContainer}>
        <Image
          source={property.image}
          style={styles.propertyImage}
          resizeMode="cover"
        />
        {isSaved && (
          <View style={styles.savedBadge}>
            <GetIcon iconName="premium" size={16} color="#FF6B6B" />
          </View>
        )}
      </View>

      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle} numberOfLines={1}>
          {property.title}
        </Text>
        <Text style={styles.propertyLocation} numberOfLines={1}>
          <GetIcon iconName="locationPin" size={12} color="#666" />
          {' ' + property.location}
        </Text>
        <Text style={styles.propertyPrice}>{property.price}</Text>

        <View style={styles.propertyDetails}>
          <Text style={styles.propertyDetail}>
            <GetIcon iconName="doubleBed" size={12} color="#666" />
            {' ' + property.bedrooms}
          </Text>
          <Text style={styles.propertyDetail}>
            <GetIcon iconName="room" size={12} color="#666" />
            {' ' + property.bathrooms}
          </Text>
          <Text style={styles.propertyDetail}>
            <GetIcon iconName="area" size={12} color="#666" />
            {' ' + property.area}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderQuickAction = (action: QuickAction) => (
    <TouchableOpacity
      key={action.id}
      style={[styles.quickActionCard, {borderLeftColor: action.color}]}
      activeOpacity={0.8}
      onPress={() => {
        // Handle quick action
        console.log('Quick action:', action.id);
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

  const renderStatCard = (stat: (typeof stats)[0]) => (
    <View key={stat.label} style={styles.statCard}>
      <View style={styles.statIcon}>
        <GetIcon iconName={stat.icon} size={20} color={Colors.MT_PRIMARY_1} />
      </View>
      <Text style={styles.statValue}>{stat.value}</Text>
      <Text style={styles.statLabel}>{stat.label}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Buyer Header */}
      <BuyerSellerHeader
        title="Welcome back!"
        subtitle="Find Your Dream Home"
      />

      {/* Stats Section */}
      <View style={styles.statsContainer}>{stats.map(renderStatCard)}</View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>
      </View>

      {/* Recently Viewed */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Viewed</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}>
          {recentlyViewed.map(property => renderPropertyCard(property))}
        </ScrollView>
      </View>

      {/* Saved Properties */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Properties</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}>
          {savedProperties.map(property => renderPropertyCard(property, true))}
        </ScrollView>
      </View>

      {/* Property Recommendations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}>
          {recentlyViewed
            .slice(0, 2)
            .map(property => renderPropertyCard(property))}
        </ScrollView>
      </View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: 'white',
  },
  headerTop: {
    position: 'absolute',
    top: 5,
    left: 10,
    zIndex: 1,
  },
  drawerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: width * 0.7, // Make it responsive instead of fixed width
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    marginVertical: 8, // Add vertical margin to prevent shadow clipping
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
    marginBottom: 6,
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
  },
  propertyDetail: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default BuyerDashboard;
