import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Image,
  FlatList,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PropertyStackParamList} from '../../navigator/components/PropertyStack';
import {SellerProperty} from '../../types';
import Colors from '../../constants/Colors';
import GetIcon from '../../components/GetIcon';
import ConfirmationModal from '../../components/ConfirmationModal';
import Toast from 'react-native-toast-message';
import YoutubeVideoPlayer from '../../components/YoutubeVideoPlayer';
import {useAuth} from '../../context/AuthProvider';
import { getYouTubeThumbnailUrl } from '../../utils/formUtils';

type Props = NativeStackScreenProps<PropertyStackParamList, 'PropertyDetail'>;

// Default placeholder image
const placeholderImage = require('../../assets/Images/dncr_black_logo.png');

const PropertyDetailScreen: React.FC<Props> = ({route, navigation}) => {
  const {property: initialProperty} = route.params;

  const [property, setProperty] = useState<SellerProperty>(initialProperty);
  const [_loading, _setLoading] = useState<boolean>(false);
  const [_error, _setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeVideoSlides, setActiveVideoSlides] = useState<{
    [key: number]: boolean;
  }>({});

  const {width} = useWindowDimensions();
  const {setDataUpdated} = useAuth();

  const handleFeaturedToggle = async (newValue: boolean) => {
    setIsFeatured(newValue);
    console.log(
      `Featured toggled: ${
        newValue ? 'Featured' : 'Not featured'
      } for property ${property.id}`,
    );

    try {
      // TODO: Implement seller featured property API
      console.log('SellerService.featuredProperty API call needed');

      Toast.show({
        type: 'success',
        text1: `Property ${newValue ? 'marked as' : 'unmarked from'} featured`,
        position: 'top',
        visibilityTime: 2000,
      });

      setProperty({...property, featured: newValue});
      setDataUpdated(true);
    } catch (err) {
      console.error('Error updating property featured status:', err);
      Toast.show({
        type: 'error',
        text1: 'Error updating property featured status',
        position: 'top',
        visibilityTime: 2000,
      });
    }
  };

  // Handle delete property
  const handleDeleteProperty = async () => {
    try {
      setIsDeleting(true);

      // TODO: Implement seller delete property API
      console.log(
        'SellerService.deleteProperty API call needed for property:',
        property.id,
      );

      Toast.show({
        type: 'success',
        text1: 'Property deleted successfully',
        position: 'top',
        visibilityTime: 2000,
      });

      setDataUpdated(true);
      navigation.goBack();
    } catch (err) {
      console.error('Error deleting property:', err);
      Toast.show({
        type: 'error',
        text1: 'Failed to delete property',
        position: 'top',
        visibilityTime: 2000,
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    // Set initial featured state
    setIsFeatured(property.featured || false);
  }, [property.featured]);

  // Process main property image
  const displayImages = useMemo(() => {
    const images = [];

    if (property?.imageURL) {
      try {
        // First, remove any extra quotes at the beginning and end if present
        let imageData = property.imageURL.trim();
        if (imageData.startsWith('"') && imageData.endsWith('"')) {
          imageData = imageData.slice(1, -1);
        }

        // Try to parse the JSON
        const parsedImages = JSON.parse(imageData);

        // Sort images to put the toggled image first
        images.push(
          ...parsedImages.sort((a: any, b: any) => {
            if (a.toggle && !b.toggle) {
              return -1;
            }
            if (!a.toggle && b.toggle) {
              return 1;
            }
            return 0;
          }),
        );
      } catch (err) {
        console.error('Error parsing image URL:', err);
      }
    }

    // If there's a video URL, add a special item for the video
    if (property?.videoURL) {
      images.push({
        isVideo: true,
        videoUrl: property.videoURL,
        type: 'Video Tour',
      });
    }

    return images;
  }, [property?.imageURL, property?.videoURL]);

  // Function to handle image scroll events
  const handleImageScroll = (event: any) => {
    const slideIndex = Math.ceil(
      event.nativeEvent.contentOffset.x /
        event.nativeEvent.layoutMeasurement.width,
    );

    if (slideIndex !== currentImageIndex) {
      // If we're leaving a video slide, mark it inactive
      if (
        displayImages[currentImageIndex]?.isVideo &&
        activeVideoSlides[currentImageIndex]
      ) {
        setActiveVideoSlides(prev => ({
          ...prev,
          [currentImageIndex]: false,
        }));
      }

      setCurrentImageIndex(slideIndex);
    }
  };

  // Process tags
  const displayTags = useMemo(() => {
    if (!property?.tags) {
      return [];
    }

    try {
      // Special handling for Python-style array strings
      if (property.tags.includes("['") && property.tags.includes("']")) {
        // Python-style string list - extract tags manually
        return property.tags
          .replace(/^\['|'\]$/g, '') // Remove outer ['...']
          .split("','") // Split by ','
          .map(tag => tag.trim()); // Clean up each tag
      }

      // Standard JSON parsing attempt
      return JSON.parse(property.tags);
    } catch (err) {
      console.error('Error parsing tags:', err);
      console.log('Raw tags value:', property.tags);

      // Last resort: if it's a simple string, return it as a single tag
      if (typeof property.tags === 'string') {
        return [property.tags.replace(/[[\]'"]/g, '')];
      }

      return [];
    }
  }, [property?.tags]);

  // Render property image slider
  const renderImageSlider = () => {
    if (displayImages.length > 0) {
      return (
        <>
          <FlatList
            data={displayImages}
            keyExtractor={(item, index) => `image-${index}`}
            renderItem={({ item, index }) => (
              <View style={[styles.imageSlide, { width }]}>
                {item.isVideo ? (
                  // Only render the YouTube player if this is the current slide AND it's active
                  currentImageIndex === index &&
                  activeVideoSlides[index] ? (
                    <YoutubeVideoPlayer
                      key={`video-${index}-${Math.random()}`} // Force remount with random key
                      videoId={item.videoUrl}
                      height={250}
                      width={width}
                    />
                  ) : (
                    // Show a thumbnail with play button overlay
                    <TouchableOpacity
                      style={[styles.propertyImage]}
                      onPress={() => {
                        if (currentImageIndex === index) {
                          // Only activate if this is the current slide
                          setActiveVideoSlides(prev => ({
                            ...prev,
                            [index]: true,
                          }));
                        }
                      }}
                      activeOpacity={0.8}>
                      <Image
                        source={{
                          uri: getYouTubeThumbnailUrl(item.videoUrl),
                        }}
                        style={styles.videoThumbnail}
                        resizeMode="cover"
                      />
                      <View style={styles.videoPlayOverlay}>
                        <View style={styles.playButtonContainer}>
                          <GetIcon
                            iconName="playButton"
                            size={48}
                            color="#fff"
                          />
                          <Text style={styles.playVideoText}>Play Video</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                ) : (
                  // Validate URI before rendering Image component
                  (item.image || item.imageUrl) && (item.image || item.imageUrl).trim() !== '' ? (
                    <Image
                      source={{uri: item.image || item.imageUrl}}
                      style={styles.propertyImage}
                      resizeMode="cover"
                      onError={() =>
                        console.log('Image load error for:', item.image)
                      }
                    />
                  ) : (
                    <Image
                      source={placeholderImage}
                      style={styles.propertyImage}
                      resizeMode="cover"
                    />
                  )
                )}
                {item.type && (
                  <View style={styles.imageTypeContainer}>
                    <Text style={styles.imageTypeText}>{item.type}</Text>
                  </View>
                )}
              </View>
            )}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            scrollEventThrottle={16}
          />

          {/* Pagination Indicators */}
          {displayImages.length > 1 && (
            <View style={styles.paginationContainer}>
              {displayImages.map((_, index) => (
                <View
                  key={`dot-${index}`}
                  style={[
                    styles.paginationDot,
                    index === currentImageIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </>
      );
    } else {
      return (
        <View style={styles.placeholderContainer}>
          <Image
            source={placeholderImage}
            style={styles.placeholderImage}
            resizeMode="contain"
          />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Content area */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Property Image Slider */}
        <View style={styles.imageContainer}>
          {renderImageSlider()}

          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.mainBadge]}>
              <Text style={styles.badgeText}>
                {property.recordstatus || 'Active'}
              </Text>
            </View>
            {property.featured && (
              <View
                style={[styles.badge, {backgroundColor: Colors.MT_PRIMARY_1}]}>
                <Text style={styles.badgeText}>Featured</Text>
              </View>
            )}
          </View>
        </View>

        {/* Property Title & Price Section */}
        <View style={styles.section}>
          <Text style={styles.propertyTitle}>
            {property.propertyName || 'Property Name'}
          </Text>

          <Text style={[styles.propertyPrice, {color: Colors.MT_PRIMARY_1}]}>
            ₹{property.price?.toLocaleString() || 'Price not available'}
          </Text>

          <View style={styles.infoRow}>
            <GetIcon
              iconName="locationPin"
              size={18}
              color={Colors.MT_PRIMARY_1}
            />
            <Text style={styles.infoText}>
              {property.location || 'Location not specified'},{' '}
              {property.city || ''}
            </Text>
          </View>
        </View>

        {/* Property Overview */}
        <View style={[styles.section, styles.overviewSection]}>
          <Text style={styles.sectionTitle}>Property Overview</Text>

          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <View style={styles.overviewIconWrapper}>
                <GetIcon
                  iconName="home"
                  size={16}
                  color={Colors.MT_PRIMARY_1}
                />
              </View>
              <View style={styles.overviewTextContainer}>
                <Text style={styles.overviewLabel}>Type</Text>
                <Text style={styles.overviewValue}>
                  {property.propertyType || 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.overviewItem}>
              <View style={styles.overviewIconWrapper}>
                <GetIcon
                  iconName="room"
                  size={16}
                  color={Colors.MT_PRIMARY_1}
                />
              </View>
              <View style={styles.overviewTextContainer}>
                <Text style={styles.overviewLabel}>BHK</Text>
                <Text style={styles.overviewValue}>
                  {property.bhkType || 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.overviewItem}>
              <View style={styles.overviewIconWrapper}>
                <GetIcon
                  iconName="length"
                  size={16}
                  color={Colors.MT_PRIMARY_1}
                />
              </View>
              <View style={styles.overviewTextContainer}>
                <Text style={styles.overviewLabel}>Area</Text>
                <Text style={styles.overviewValue}>
                  {property.area
                    ? `${property.area} ${property.lmunit || 'sq ft'}`
                    : 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.overviewItem}>
              <View style={styles.overviewIconWrapper}>
                <GetIcon
                  iconName="compass"
                  size={16}
                  color={Colors.MT_PRIMARY_1}
                />
              </View>
              <View style={styles.overviewTextContainer}>
                <Text style={styles.overviewLabel}>Facing</Text>
                <Text style={styles.overviewValue}>
                  {property.facing || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        {(property.shortDescription || property.longDescription) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>

            {property.shortDescription && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>
                  {property.shortDescription}
                </Text>
              </View>
            )}

            {property.longDescription && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>
                  {property.longDescription}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Featured Toggle Card */}
        <View style={styles.section}>
          <View style={styles.featuredContainer}>
            <View style={styles.featuredTextContainer}>
              <Text style={styles.featuredTitle}>Mark as Featured</Text>
              <Text style={styles.infoText}>
                Featured properties get more visibility
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleFeaturedToggle(!isFeatured)}
              style={[
                styles.featuredToggle,
                {backgroundColor: isFeatured ? Colors.MT_PRIMARY_1 : '#ccc'},
              ]}>
              <Text style={styles.featuredToggleText}>
                {isFeatured ? 'Featured' : 'Not Featured'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Additional Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureIcon,
                  property.parking
                    ? styles.featureActive
                    : styles.featureInactive,
                ]}>
                <GetIcon
                  iconName="greenCheck"
                  size={12}
                  color={property.parking ? 'white' : '#666'}
                />
              </View>
              <Text style={styles.featureText}>Parking</Text>
            </View>

            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureIcon,
                  property.lifts
                    ? styles.featureActive
                    : styles.featureInactive,
                ]}>
                <GetIcon
                  iconName="greenCheck"
                  size={12}
                  color={property.lifts ? 'white' : '#666'}
                />
              </View>
              <Text style={styles.featureText}>Lift</Text>
            </View>

            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureIcon,
                  property.gatedSecurity
                    ? styles.featureActive
                    : styles.featureInactive,
                ]}>
                <GetIcon
                  iconName="greenCheck"
                  size={12}
                  color={property.gatedSecurity ? 'white' : '#666'}
                />
              </View>
              <Text style={styles.featureText}>Security</Text>
            </View>

            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureIcon,
                  property.alarmSystem
                    ? styles.featureActive
                    : styles.featureInactive,
                ]}>
                <GetIcon
                  iconName="greenCheck"
                  size={12}
                  color={property.alarmSystem ? 'white' : '#666'}
                />
              </View>
              <Text style={styles.featureText}>Alarm</Text>
            </View>

            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureIcon,
                  property.readyToMove
                    ? styles.featureActive
                    : styles.featureInactive,
                ]}>
                <GetIcon
                  iconName="greenCheck"
                  size={12}
                  color={property.readyToMove ? 'white' : '#666'}
                />
              </View>
              <Text style={styles.featureText}>Ready to Move</Text>
            </View>

            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureIcon,
                  property.constructionDone
                    ? styles.featureActive
                    : styles.featureInactive,
                ]}>
                <GetIcon
                  iconName="greenCheck"
                  size={12}
                  color={property.constructionDone ? 'white' : '#666'}
                />
              </View>
              <Text style={styles.featureText}>Construction Done</Text>
            </View>

            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureIcon,
                  property.boundaryWall
                    ? styles.featureActive
                    : styles.featureInactive,
                ]}>
                <GetIcon
                  iconName="greenCheck"
                  size={12}
                  color={property.boundaryWall ? 'white' : '#666'}
                />
              </View>
              <Text style={styles.featureText}>Boundary Wall</Text>
            </View>

            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureIcon,
                  property.surveillanceCameras
                    ? styles.featureActive
                    : styles.featureInactive,
                ]}>
                <GetIcon
                  iconName="greenCheck"
                  size={12}
                  color={property.surveillanceCameras ? 'white' : '#666'}
                />
              </View>
              <Text style={styles.featureText}>Surveillance</Text>
            </View>
          </View>
        </View>

        {/* Property Specifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          <View style={styles.specsList}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Furnishing</Text>
              <Text style={styles.specValue}>
                {property.furnishing || 'N/A'}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Floor</Text>
              <Text style={styles.specValue}>{property.floor || 'N/A'}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Facing</Text>
              <Text style={styles.specValue}>{property.facing || 'N/A'}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Ready to Move</Text>
              <Text style={styles.specValue}>
                {property.readyToMove ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
        </View>

        {/* Tags */}
        {displayTags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {displayTags.map((tag: string, index: number) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Seller Information */}
        <View style={[styles.section, styles.sellerSection]}>
          <Text style={styles.sectionTitle}>Seller Information</Text>
          <View style={styles.sellerCard}>
            <View style={styles.sellerDetails}>
              <View style={styles.sellerIconContainer}>
                <GetIcon
                  iconName="user"
                  size={24}
                  color={Colors.MT_PRIMARY_1}
                />
              </View>
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>
                  {property.sellerName || 'Seller Name'}
                </Text>
                <Text style={styles.sellerType}>
                  {property.sellerType || 'Individual'}
                </Text>
                <Text
                  style={[styles.sellerEmail, {color: Colors.MT_PRIMARY_1}]}>
                  {property.sellerEmail || 'Email not available'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          visible={showDeleteModal}
          title="Delete Property"
          message="Are you sure you want to delete this property? This action cannot be undone."
          onConfirm={handleDeleteProperty}
          onCancel={() => setShowDeleteModal(false)}
          isLoading={isDeleting}
        />
      </ScrollView>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageSlide: {
    height: 250,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
    paddingTop: 10,
  },
  contentContainer: {
    paddingBottom: 100,
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#e1e1e1',
    position: 'relative',
    marginBottom: 12,
  },
  propertyImage: {
    height: 250,
    width: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  videoPlaceholder: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  placeholderImage: {
    width: '50%',
    height: '50%',
    opacity: 0.5,
  },
  badgeContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  mainBadge: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 8,
    marginHorizontal: 12,
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
  propertyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  overviewSection: {
    marginTop: 12,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewItem: {
    width: '48%',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  overviewTextContainer: {
    flex: 1,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#888',
  },
  overviewValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  featureActive: {
    backgroundColor: Colors.MT_PRIMARY_1,
  },
  featureInactive: {
    backgroundColor: '#e0e0e0',
  },
  featureText: {
    fontSize: 14,
    color: '#444',
  },
  specsList: {
    flexDirection: 'column',
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  specLabel: {
    fontSize: 14,
    color: '#666',
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  sellerSection: {
    marginTop: 12,
  },
  sellerCard: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  sellerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  sellerType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  sellerEmail: {
    fontSize: 14,
  },
  bottomSpacing: {
    height: 40,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  imageTypeContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  imageTypeText: {
    color: '#fff',
    fontSize: 12,
  },
  featuredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  featuredTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featuredToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  featuredToggleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  menuContent: {
    backgroundColor: 'white',
  },
  menuItemTitle: {
    color: 'black',
  },
  threeDotsIcon: {
    marginRight: -10,
  },
  playVideoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  videoThumbnail: {
    height: 250,
    width: '100%',
  },
  videoPlayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  playButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  contentErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
});

export default PropertyDetailScreen;
