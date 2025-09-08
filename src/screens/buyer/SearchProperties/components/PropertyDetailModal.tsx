import React, {useState, useMemo} from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import GetIcon from '../../../../components/GetIcon';
import Colors from '../../../../constants/Colors';
import {Property} from '../../../../types';
import {formatPrice, parseImageUrl} from '../utils/helpers';
import {PropertyFor} from '../../../../constants/MasterDetails';
import YoutubeVideoPlayer from '../../../../components/YoutubeVideoPlayer';
import Images from '../../../../constants/Images';
import {useTranslation} from 'react-i18next';

interface PropertyDetailModalProps {
  visible: boolean;
  property: Property | null;
  onClose: () => void;
  onEnquiry?: (property: Property, isLoading?: (loading: boolean) => void) => void;
  showEnquiryButton?: boolean;
}

// Helper function to get YouTube video ID from URL
const getYouTubeVideoId = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : '';
};

// Helper function to get YouTube thumbnail URL
const getYouTubeThumbnailUrl = (videoUrl: string): string => {
  const videoId = getYouTubeVideoId(videoUrl);
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : '';
};

const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  visible,
  property,
  onClose,
  onEnquiry,
  showEnquiryButton = true,
}) => {
  const {width} = useWindowDimensions();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeVideoSlides, setActiveVideoSlides] = useState<{
    [key: number]: boolean;
  }>({});
  const [isEnquiryLoading, setIsEnquiryLoading] = useState(false);
  const {t} = useTranslation();

  // Process property images and video
  const displayImages = useMemo(() => {
    if (!property?.imageURL) {
      return [];
    }

    const images = [];

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
      // Fallback: use the imageURL as a single image
      const fallbackImageUrl = parseImageUrl(property.imageURL);
      if (fallbackImageUrl) {
        images.push({image: fallbackImageUrl, toggle: true});
      }
    }

    // If there's a video URL, add a special item for the video
    if (property?.videoURL) {
      images.push({
        isVideo: true,
        videoUrl: property.videoURL,
        type: t('propertyDetailModal.videoTour'),
      });
    }

    return images;
  }, [property?.imageURL, property?.videoURL, t]);

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
          .map((tag: string) => tag.trim()); // Clean up each tag
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

  if (!property) {
    return null;
  }

  // Render property image slider
  const renderImageSlider = () => {
    if (displayImages.length > 0) {
      return (
        <>
          <FlatList
            data={displayImages}
            keyExtractor={(item, index) => `image-${index}`}
            renderItem={({item, index}) => (
              <View style={[styles.imageSlide, {width}]}>
                {item.isVideo ? (
                  // Only render the YouTube player if this is the current slide AND it's active
                  currentImageIndex === index && activeVideoSlides[index] ? (
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
                          setActiveVideoSlides(prev => ({
                            ...prev,
                            [index]: true,
                          }));
                        }
                      }}
                      activeOpacity={0.8}>
                      {getYouTubeThumbnailUrl(item.videoUrl) ? (
                        <Image
                          source={{
                            uri: getYouTubeThumbnailUrl(item.videoUrl),
                          }}
                          style={styles.videoThumbnail}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={[styles.videoThumbnail, styles.placeholderContainer]}>
                          <Image
                            source={Images.MTESTATES_LOGO}
                            style={styles.placeholderImage}
                            resizeMode="contain"
                          />
                        </View>
                      )}
                      <View style={styles.videoPlayOverlay}>
                        <View style={styles.playButtonContainer}>
                          <GetIcon
                            iconName="playButton"
                            size={60}
                            color="white"
                          />
                          <Text style={styles.playVideoText}>Play Video</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                ) : (
                  (item.image || item.imageUrl) ? (
                    <Image
                      source={{uri: item.image || item.imageUrl}}
                      style={styles.propertyImage}
                      resizeMode="cover"
                      onError={() =>
                        console.log('Image load error for:', item.image)
                      }
                    />
                  ) : (
                    <View style={[styles.propertyImage, styles.placeholderContainer]}>
                      <Image
                        source={Images.MTESTATES_LOGO}
                        style={styles.placeholderImage}
                        resizeMode="contain"
                      />
                    </View>
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
            source={Images.MTESTATES_LOGO}
            style={styles.placeholderImage}
            resizeMode="contain"
          />
        </View>
      );
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <GetIcon iconName="back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Property Details</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}>
          {/* Property Image Slider */}
          <View style={styles.imageContainer}>
            {renderImageSlider()}

            {/* Property Type and Featured Badge */}
            <View style={styles.badgeContainer}>
              <View
                style={[
                  styles.propertyTypeBadge,
                  property.propertyFor === PropertyFor.SALE
                    ? styles.propertyTypeBadgeSale
                    : property.propertyFor === PropertyFor.RENT
                    ? styles.propertyTypeBadgeRent
                    : styles.propertyTypeBadgeOthers,
                ]}>
                <Text style={styles.propertyTypeBadgeText}>
                  {property.propertyFor === PropertyFor.SALE
                    ? t('propertyCard.propertyType.forSale')
                    : property.propertyFor === PropertyFor.RENT
                    ? t('propertyCard.propertyType.forRent')
                    : t('propertyCard.propertyType.others')}
                </Text>
              </View>
              {property.isFeatured && (
                <View style={styles.featuredBadge}>
                  <GetIcon iconName="premium" size={12} color="white" />
                  <Text style={styles.featuredBadgeText}>Featured</Text>
                </View>
              )}
            </View>
          </View>

          {/* Property Title & Price Section */}
          <View style={styles.section}>
            <Text style={styles.propertyTitle}>
              {property.propertyName || t('propertyDetailModal.propertyName')}
            </Text>

            <Text style={[styles.propertyPrice, {color: Colors.MT_PRIMARY_1}]}>
              {formatPrice(
                property.price,
                property.propertyFor as
                  | typeof PropertyFor.SALE
                  | typeof PropertyFor.RENT
                  | typeof PropertyFor.OTHERS,
              )}
            </Text>

            <View style={styles.infoRow}>
              <GetIcon
                iconName="locationPin"
                size={18}
                color={Colors.MT_PRIMARY_1}
              />
              <Text style={styles.infoText}>
                {property.locationAddress || t('propertyDetailModal.locationNotSpecified')},{' '}
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
                    {property.propertyType || t('propertyDetailModal.labels.na')}
                  </Text>
                </View>
              </View>

              <View style={styles.overviewItem}>
                <View style={styles.overviewIconWrapper}>
                  <GetIcon
                    iconName="doubleBed"
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
                    iconName="area"
                    size={16}
                    color={Colors.MT_PRIMARY_1}
                  />
                </View>
                <View style={styles.overviewTextContainer}>
                  <Text style={styles.overviewLabel}>Area</Text>
                  <Text style={styles.overviewValue}>
                    {property.area} {property.lmUnit}
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
              <Text style={styles.sectionTitle}>{t('propertyDetailModal.sections.description')}</Text>

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

          {/* Additional Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('propertyDetailModal.sections.features')}</Text>
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
                <Text style={styles.featureText}>{t('propertyDetailModal.features.parking')}</Text>
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
                <Text style={styles.featureText}>{t('propertyDetailModal.features.lift')}</Text>
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
                <Text style={styles.featureText}>{t('propertyDetailModal.features.security')}</Text>
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
                <Text style={styles.featureText}>{t('propertyDetailModal.features.alarm')}</Text>
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
                <Text style={styles.featureText}>{t('propertyDetailModal.features.readyToMove')}</Text>
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
                <Text style={styles.featureText}>{t('propertyDetailModal.features.constructionDone')}</Text>
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
                <Text style={styles.featureText}>{t('propertyDetailModal.features.boundaryWall')}</Text>
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
                <Text style={styles.featureText}>{t('propertyDetailModal.features.surveillance')}</Text>
              </View>
            </View>
          </View>

          {/* Property Specifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('propertyDetailModal.sections.specifications')}</Text>
            <View style={styles.specsList}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>{t('propertyDetailModal.labels.furnishing')}</Text>
                <Text style={styles.specValue}>
                  {property.furnishing || 'N/A'}
                </Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>{t('propertyDetailModal.labels.floor')}</Text>
                <Text style={styles.specValue}>{property.floor || 'N/A'}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>{t('propertyDetailModal.labels.propertyAge')}</Text>
                <Text style={styles.specValue}>
                  {property.propertyAge || 'N/A'}
                </Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>{t('propertyDetailModal.labels.sellerType')}</Text>
                <Text style={styles.specValue}>
                  {property.sellerType || 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          {/* Tags */}
          {displayTags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('propertyDetailModal.sections.tags')}</Text>
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
            <Text style={styles.sectionTitle}>{t('propertyDetailModal.sections.sellerInformation')}</Text>
            <View style={styles.sellerCard}>
              <View style={styles.sellerDetails}>
                <View style={styles.sellerIconContainer}>
                  <GetIcon iconName="user" size={24} color="#666" />
                </View>
                <View style={styles.sellerInfo}>
                  <Text style={styles.sellerName}>
                    {property.name || t('propertyDetailModal.labels.sellerName')}
                  </Text>
                  <Text style={styles.sellerType}>
                    {property.sellerType || t('propertyDetailModal.labels.individual')}
                  </Text>
                  <Text style={styles.sellerEmail}>
                    {property.sellerPhone || t('propertyDetailModal.labels.contactNotAvailable')}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Fixed Enquiry Button */}
        {showEnquiryButton && (
          <View style={styles.enquiryButtonContainer}>
            <TouchableOpacity
              style={[styles.enquiryButton, isEnquiryLoading && styles.enquiryButtonDisabled]}
              onPress={() => {
                if (!isEnquiryLoading && property && onEnquiry) {
                  onEnquiry(property, setIsEnquiryLoading);
                }
              }}
              disabled={isEnquiryLoading}>
              {isEnquiryLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.enquiryButtonText}>{t('propertyDetailModal.buttons.enquiryNow')}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        paddingTop: 50,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        paddingTop: 16,
        elevation: 4,
      },
    }),
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: '100%' as const,
    height: 250,
    backgroundColor: '#e1e1e1',
    position: 'relative' as const,
    marginBottom: 12,
  },
  imageSlide: {
    height: 250,
  },
  propertyImage: {
    height: 250,
    width: '100%' as const,
  },
  videoThumbnail: {
    height: 250,
    width: '100%' as const,
  },
  videoPlayOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  playButtonContainer: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  playVideoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
    marginTop: 8,
  },
  placeholderContainer: {
    width: '100%' as const,
    height: '100%' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    width: '50%' as const,
    height: '50%' as const,
    opacity: 0.5,
  },
  badgeContainer: {
    position: 'absolute' as const,
    top: 16,
    left: 16,
    flexDirection: 'row' as const,
    gap: 8,
  },
  propertyTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  propertyTypeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold' as const,
    color: 'white',
    textTransform: 'uppercase' as const,
  },
  propertyTypeBadgeSale: {
    backgroundColor: '#43a809ff',
  },
  propertyTypeBadgeRent: {
    backgroundColor: Colors.MT_PRIMARY_2,
  },
  propertyTypeBadgeOthers: {
    backgroundColor: Colors.main,
  },
  featuredBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.MT_PRIMARY_1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: 'bold' as const,
    color: 'white',
    textTransform: 'uppercase' as const,
  },
  paginationContainer: {
    position: 'absolute' as const,
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
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
    position: 'absolute' as const,
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
    fontWeight: 'bold' as const,
    color: '#333',
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
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
    fontWeight: '700' as const,
    color: '#333',
    marginBottom: 16,
  },
  overviewSection: {
    marginTop: 12,
  },
  overviewGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between' as const,
  },
  overviewItem: {
    width: '48%' as const,
    marginBottom: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  overviewIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
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
    fontWeight: '600' as const,
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
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
  },
  featureItem: {
    width: '50%' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
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
    flexDirection: 'column' as const,
  },
  specItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
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
    fontWeight: '600' as const,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
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
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  sellerIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600' as const,
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
    color: Colors.MT_PRIMARY_1,
  },
  bottomSpacing: {
    height: 40,
  },
  enquiryButtonContainer: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  enquiryButton: {
    backgroundColor: Colors.MT_PRIMARY_1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  enquiryButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  enquiryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600' as const,
  },
};

export default PropertyDetailModal;
