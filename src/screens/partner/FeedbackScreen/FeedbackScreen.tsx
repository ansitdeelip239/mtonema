import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import Header from '../../../components/Header';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FeedbackStackParamList} from '../../../navigator/components/FeedbackScreenStack';
import {CustomerTestimonial, PagingModel} from '../../../types';
import PartnerService from '../../../services/PartnerService';
import {useAuth} from '../../../hooks/useAuth';
import Colors from '../../../constants/Colors';
import {formatDate} from '../../../utils/dateUtils';
import GetIcon from '../../../components/GetIcon';
import YoutubeVideoPlayer from '../../../components/YoutubeVideoPlayer';
import {getYoutubeVideoId} from '../../../utils/formUtils';

const {width} = Dimensions.get('window');
const PAGE_SIZE = 5;

type Props = NativeStackScreenProps<FeedbackStackParamList, 'FeedbackScreen'>;

const FeedbackScreen: React.FC<Props> = () => {
  const [testimonials, setTestimonials] = useState<CustomerTestimonial[]>([]);
  const [pagination, setPagination] = useState<PagingModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);

  const {user} = useAuth();

  const fetchTestimonials = useCallback(
    async (page: number, refresh = false) => {
      try {
        if (refresh) {
          setIsRefreshing(true);
        } else if (page === 1) {
          setIsLoading(true);
        } else {
          setIsPaginationLoading(true);
        }

        const response = await PartnerService.getPartnerCustomerTestimonial(
          user?.email as string,
          page,
          PAGE_SIZE,
        );

        const newTestimonials = response.data.testimonials;
        const paginationData = response.data.pagination;

        if (refresh || page === 1) {
          setTestimonials(newTestimonials);
        } else {
          setTestimonials(prev => [...prev, ...newTestimonials]);
        }

        setPagination(paginationData);
        setCurrentPage(page);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsPaginationLoading(false);
      }
    },
    [user?.email],
  );

  useEffect(() => {
    if (user?.email) {
      fetchTestimonials(1);
    }
  }, [fetchTestimonials, user?.email]);

  const handleRefresh = useCallback(() => {
    fetchTestimonials(1, true);
  }, [fetchTestimonials]);

  const handleLoadMore = useCallback(() => {
    if (
      !isPaginationLoading &&
      pagination &&
      pagination.currentPage < pagination.totalPage
    ) {
      fetchTestimonials(currentPage + 1);
    }
  }, [isPaginationLoading, pagination, currentPage, fetchTestimonials]);

  const renderItem = ({item}: {item: CustomerTestimonial}) => {
    const videoId = getYoutubeVideoId(item.videoURL as string);
    const isVideoActive = activeVideoId === item.id;

    // Calculate correct width accounting for padding
    const cardPadding = 32; // 16px padding on both sides of the card
    const videoWidth = width - cardPadding;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {/* Header content remains the same */}
          {item.imageURL ? (
            <Image source={{uri: item.imageURL}} style={styles.customerImage} />
          ) : (
            <View style={styles.customerPlaceholder}>
              <Text style={styles.customerInitial}>
                {item.customerName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>{item.customerName}</Text>
            <Text style={styles.testimonialDate}>
              {formatDate(item.createdOn, 'PPpp')}
            </Text>
          </View>
        </View>

        <Text style={styles.feedbackText}>{item.feedbackText}</Text>

        {/* Updated video container */}
        {item.videoURL && videoId && (
          <View style={styles.videoWrapper}>
            {isVideoActive ? (
              <View style={[styles.videoContainer, {width: videoWidth}]}>
                <YoutubeVideoPlayer
                  key={`video-${item.id}-${Math.random()}`} // Force remount with random key
                  videoId={videoId}
                  height={180}
                  width={videoWidth}
                  autoplay={false}
                />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.videoPlaceholder}
                onPress={() => setActiveVideoId(item.id)}
                activeOpacity={0.9}>
                <View style={styles.playButtonContainer}>
                  <GetIcon iconName="playButton" size={40} color="#fff" />
                  <Text style={styles.playVideoText}>Play Video</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (!isPaginationLoading) {
      return null;
    }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.MT_PRIMARY_1} />
        <Text style={styles.loadingMoreText}>Loading more testimonials...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return null;
    }

    return (
      <View style={styles.emptyContainer}>
        <GetIcon iconName="feedback" size={64} color={Colors.PRIMARY_1} />
        <Text style={styles.emptyText}>No testimonials available</Text>
        <Text style={styles.emptySubText}>
          Your customer feedback will appear here
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Customer Feedback" />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.MT_PRIMARY_1} />
          <Text style={styles.loadingText}>Loading testimonials...</Text>
        </View>
      ) : (
        <FlatList
          data={testimonials}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[Colors.MT_PRIMARY_1]}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          ItemSeparatorComponent={ItemSeparator}
        />
      )}
    </View>
  );
};

const ItemSeparator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  separator: {
    height: 16,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  customerPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.PRIMARY_1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  customerInitial: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  testimonialDate: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
    marginBottom: 12,
  },
  videoWrapper: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center', // Center the video container
    padding: 8,
  },
  videoContainer: {
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
    alignSelf: 'center', // Center itself
  },
  videoPlaceholder: {
    height: 180,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  playButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playVideoText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
    textAlign: 'center',
  },
  footerLoader: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  paginationInfo: {
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  paginationText: {
    fontSize: 12,
    color: '#777',
  },
});

export default FeedbackScreen;
