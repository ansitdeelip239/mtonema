import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import GetIcon from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import {BuyerBottomTabParamList} from '../../types/navigation';
import BuyerSellerHeader from '../../components/BuyerSellerHeader';
import {useAuth} from '../../context/AuthProvider';
import BuyerService from '../../services/BuyerService';
import {useTranslation} from 'react-i18next';
import {
  formatPrice,
  parseImageUrl,
} from '../buyer/SearchProperties/utils/helpers';
import {PropertyFor} from '../../constants/MasterDetails';
import Images from '../../constants/Images';
import PropertyDetailModal from './SearchProperties/components/PropertyDetailModal';

type Props = NativeStackScreenProps<BuyerBottomTabParamList, 'Contacted'>;

interface ContactedProperty {
  contactedPropertyId: number;
  buyerId: number;
  buyerName: string;
  buyerLocation: string;
  sellerId: number;
  sellerName: string;
  sellerLocation?: string;
  propertyId: number;
  userId: number;
  name: string;
  propertyLocation: string;
  city: string;
  zipcode: string;
  propertyName: string;
  price: number;
  sellerType: string;
  propertyType: string;
  propertyFor: string;
  imageURL: string;
  videoURL?: string;
  shortDescription: string;
  longDescription: string;
  recordStatus: string;
  propertyDetailsId: number;
  readyToMove: boolean;
  bhkType?: string;
  propertyForType: string;
  area: number;
  furnishing?: string;
  floor?: number;
  lmUnit: string;
  size?: number;
  facing?: string;
  boundaryWall?: boolean;
  constructionDone?: boolean;
  parking?: string;
  lifts?: boolean;
  propertyAge?: string;
  alarmSystem?: boolean;
  surveillanceCameras?: boolean;
  gatedSecurity?: boolean;
  pantry?: boolean;
  createdBy: string;
  createdOn: string;
  updatedBy?: string;
  updatedOn?: string;
  isFeatured?: boolean;
  tags?: string;
  openSide?: string;
  ceilingHeight?: string;
}

const ContactedProperties: React.FC<Props> = ({navigation: _navigation}) => {
  const {user} = useAuth();
  const {t} = useTranslation();
  const [contactedProperties, setContactedProperties] = useState<
    ContactedProperty[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedProperty, setSelectedProperty] =
    useState<ContactedProperty | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const pageSize = 10;

  // Fetch contacted properties
  const fetchContactedProperties = useCallback(
    async (pageNum: number = 1, shouldRefresh: boolean = false) => {
      if (!user?.id) {
        return;
      }

      try {
        if (shouldRefresh) {
          setRefreshing(true);
        } else if (pageNum === 1) {
          setLoading(true);
        }

        const response = await BuyerService.getContactedProperties(
          user.id,
          pageNum,
          pageSize,
        );

        if (response?.success && response?.data?.contactedProperties) {
          const newProperties = response.data.contactedProperties;
          const pagination = response.data.pagination;

          if (shouldRefresh || pageNum === 1) {
            setContactedProperties(newProperties);
          } else {
            setContactedProperties(prev => [...prev, ...newProperties]);
          }

          setTotal(response.data.total || 0);
          setHasMore(pagination?.hasNextPage || false);
          setPage(pageNum);
        } else {
          if (pageNum === 1) {
            setContactedProperties([]);
            setTotal(0);
          }
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching contacted properties:', error);
        // Toast.show({
        //   type: 'error',
        //   text1: t('contactedProperties.labels.failedToLoad'),
        //   text2: t('contactedProperties.labels.tryAgain'),
        // });
        if (pageNum === 1) {
          setContactedProperties([]);
          setTotal(0);
        }
        setHasMore(false);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user?.id],
  );

  // Initial load
  useEffect(() => {
    if (user?.id) {
      fetchContactedProperties(1, true);
    }
  }, [user?.id, fetchContactedProperties]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setPage(1);
    setHasMore(true);
    fetchContactedProperties(1, true);
  }, [fetchContactedProperties]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore && !refreshing) {
      const nextPage = page + 1;
      fetchContactedProperties(nextPage, false);
    }
  }, [loading, hasMore, refreshing, page, fetchContactedProperties]);

  const renderContactedProperty = (property: ContactedProperty) => {
    const imageUrl = parseImageUrl(property.imageURL);
    const isPlaceholder = !imageUrl;

    return (
      <TouchableOpacity
        key={property.contactedPropertyId}
        style={styles.propertyCard}
        activeOpacity={0.8}
        onPress={() => {
          setSelectedProperty(property);
          setModalVisible(true);
        }}>
        <View style={styles.propertyImageContainer}>
          <Image
            source={imageUrl && imageUrl.trim() ? {uri: imageUrl} : Images.MTESTATES_LOGO}
            style={
              isPlaceholder
                ? styles.propertyImagePlaceholder
                : styles.propertyImage
            }
            resizeMode={isPlaceholder ? 'contain' : 'cover'}
          />
          <View style={styles.contactBadge}>
            <Text style={styles.contactBadgeText}>{t('contactedProperties.labels.contacted')}</Text>
          </View>
        </View>

        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {property.propertyName}
          </Text>
          <Text style={styles.propertyLocation} numberOfLines={1}>
            <GetIcon iconName="locationPin" size={12} color="#666" />
            {' ' + property.propertyLocation}
          </Text>
          <Text style={styles.propertyPrice}>
            {formatPrice(
              property.price,
              property.propertyFor as
                | typeof PropertyFor.SALE
                | typeof PropertyFor.RENT
                | typeof PropertyFor.OTHERS,
            )}
          </Text>

          <View style={styles.propertyDetails}>
            <Text style={styles.propertyDetail}>
              <GetIcon iconName="area" size={12} color="#666" />
              {' ' + property.area} {property.lmUnit}
            </Text>
            {property.bhkType && (
              <Text style={styles.propertyDetail}>
                <GetIcon iconName="doubleBed" size={12} color="#666" />
                {' ' + property.bhkType}
              </Text>
            )}
            <Text style={styles.propertyDetail}>
              <GetIcon iconName="home" size={12} color="#666" />
              {' ' + property.propertyType}
            </Text>
          </View>

          <View style={styles.contactInfo}>
            <Text style={styles.contactDate}>
              {t('contactedProperties.labels.contactedOn')} {new Date(property.createdOn).toLocaleDateString()}
            </Text>
            <Text style={styles.agentInfo}>
              <GetIcon iconName="user" size={12} color="#666" />
              {' ' + property.sellerName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPropertyItem: ListRenderItem<ContactedProperty> = ({item}) => (
    <View style={styles.propertyCardContainer}>
      {renderContactedProperty(item)}
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Buyer Header */}
      <BuyerSellerHeader
        title={t('contactedProperties.header.title')}
        subtitle={t('contactedProperties.header.subtitle')}
      />

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <GetIcon iconName="phone" size={20} color={Colors.MT_PRIMARY_1} />
          </View>
          <Text style={styles.statValue}>{total}</Text>
          <Text style={styles.statLabel}>{t('contactedProperties.stats.totalContacts')}</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <GetIcon iconName="home" size={20} color="#4CAF50" />
          </View>
          <Text style={styles.statValue}>
            {contactedProperties.filter(p => p.propertyFor === 'Sale').length}
          </Text>
          <Text style={styles.statLabel}>{t('contactedProperties.stats.forSale')}</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <GetIcon iconName="home" size={20} color="#FF9800" />
          </View>
          <Text style={styles.statValue}>
            {contactedProperties.filter(p => p.propertyFor === 'Rent').length}
          </Text>
          <Text style={styles.statLabel}>{t('contactedProperties.stats.forRent')}</Text>
        </View>
      </View>

      {/* Section Title */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('contactedProperties.sections.recentContacts')}</Text>
      </View>
    </>
  );

  const renderFooter = () => {
    if (loading && contactedProperties.length > 0) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingMoreText}>{t('contactedProperties.labels.loadingMore')}</Text>
        </View>
      );
    }
    return <View style={styles.bottomSpacing} />;
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingEmptyText}>
            {t('contactedProperties.labels.loadingProperties')}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('contactedProperties.labels.noProperties')}</Text>
      </View>
    );
  };

  return (
    <>
      <FlatList
        data={contactedProperties}
        renderItem={renderPropertyItem}
        keyExtractor={item => item.contactedPropertyId.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
          />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />

      <PropertyDetailModal
        visible={modalVisible}
        property={selectedProperty as any}
        onClose={() => {
          setModalVisible(false);
          setSelectedProperty(null);
        }}
        showEnquiryButton={false}
      />
    </>
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
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  propertiesList: {
    gap: 15,
  },
  propertyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
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
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contactBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.MT_PRIMARY_1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  contactBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
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
    marginBottom: 12,
  },
  propertyDetail: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
  contactInfo: {
    marginBottom: 12,
  },
  contactDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  agentInfo: {
    fontSize: 12,
    color: '#666',
  },
  bottomSpacing: {
    height: 100,
  },
  propertyCardContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center' as const,
  },
  loadingMoreText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingVertical: 50,
  },
  loadingEmptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#555',
    textAlign: 'center' as const,
  },
});

export default ContactedProperties;
