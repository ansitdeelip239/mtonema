import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState, useMemo} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  FlatList,
  useWindowDimensions,
  Switch,
} from 'react-native';
import {ListingScreenStackParamList} from '../../../navigator/components/PropertyListingScreenStack';
import {Property} from './types';
import PartnerService from '../../../services/PartnerService';
import Colors from '../../../constants/Colors';
import GetIcon from '../../../components/GetIcon';
import {formatCurrency} from '../../../utils/currency';
import Header from '../../../components/Header';
import YoutubeVideoPlayer from '../../../components/YoutubeVideoPlayer';
import Toast from 'react-native-toast-message';
import {usePartner} from '../../../context/PartnerProvider';
import {Appbar, Menu} from 'react-native-paper';
import ConfirmationModal from '../../../components/ConfirmationModal';
import {getYouTubeThumbnailUrl} from '../../../utils/formUtils';

type Props = NativeStackScreenProps<
  ListingScreenStackParamList,
  'ListingsDetailScreen'
>;

// Default placeholder image
const placeholderImage = require('../../../assets/Images/dncr_black_logo.png');

const ListingDetailScreen: React.FC<Props> = ({route, navigation}) => {
  const {propertyId} = route.params;

  const [property, setProperty] = useState<Property>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeVideoSlides, setActiveVideoSlides] = useState<{
    [key: number]: boolean;
  }>({});

  const {width} = useWindowDimensions();
  const {setPartnerPropertyUpdated} = usePartner();

  const handleFeaturedToggle = async (newValue: boolean) => {
    setIsFeatured(newValue);
    console.log(
      `Interest toggled: ${
        newValue ? 'Interested' : 'Not interested'
      } in property ${propertyId}`,
    );

    try {
      const response = await PartnerService.featuredProperty(
        propertyId,
        newValue,
      );

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: `Property ${
            newValue ? 'marked as' : 'unmarked from'
          } featured`,
          position: 'top',
          visibilityTime: 2000,
        });

        if (property) {
          setProperty({...property, featured: newValue});
        }

        setPartnerPropertyUpdated(prev => !prev);
      }
    } catch (err) {
      console.error('Error updating property interest:', err);
      Toast.show({
        type: 'error',
        text1: 'Error updating property interest',
        position: 'top',
        visibilityTime: 2000,
      });
    }
  };

  // Add menu handler functions
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  // Handle delete property
  const handleDeleteProperty = async () => {
    try {
      setIsDeleting(true);
      const response = await PartnerService.deletePartnerProperty(propertyId);

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Property deleted successfully',
          position: 'top',
          visibilityTime: 2000,
        });
        setPartnerPropertyUpdated(prev => !prev);
        navigation.goBack();
      }
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

  // Handle edit property
  const handleEditProperty = () => {
    closeMenu();
    navigation.navigate('EditPartnerProperty', {
      propertyData: property,
    });
  };

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await PartnerService.getPartnerPropertyById(
          propertyId,
        );
        if (response.success) {
          setProperty(response.data);
          setIsFeatured(response.data.featured || false);
        } else {
          setError('Could not load property details');
        }
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError('Error loading property details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]); // Add dependency to prevent infinite fetch loop

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
          [currentImageIndex]: false, // This will force the video to be replaced with placeholder
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.MT_PRIMARY_1} />
        <Text style={styles.loadingText}>Loading property details...</Text>
      </View>
    );
  }

  if (error || !property) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Property not found'}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={property.propertyName || 'Property Details'}
        backButton={true}
        onBackPress={() => navigation.goBack()}>
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              // eslint-disable-next-line react/no-unstable-nested-components
              icon={() => <GetIcon iconName="threeDots" color="white" />}
              onPress={openMenu}
              style={styles.threeDotsIcon}
            />
          }
          contentStyle={styles.menuContent}>
          <Menu.Item
            onPress={() => {
              closeMenu();
              handleEditProperty();
            }}
            title="Edit"
            titleStyle={styles.menuItemTitle}
            // eslint-disable-next-line react/no-unstable-nested-components
            leadingIcon={() => <GetIcon iconName="edit" />}
          />
          <Menu.Item
            onPress={() => {
              closeMenu();
              setShowDeleteModal(true);
            }}
            title="Delete"
            titleStyle={styles.menuItemTitle}
            // eslint-disable-next-line react/no-unstable-nested-components
            leadingIcon={() => <GetIcon iconName="delete" />}
          />
        </Menu>
      </Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Property Image Slider */}
        <View style={styles.imageContainer}>
          {displayImages.length > 0 ? (
            <>
              <FlatList
                data={displayImages}
                keyExtractor={(item, index) => `image-${index}`}
                renderItem={({item, index}) => (
                  <View style={[styles.imageSlide, {width}]}>
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
                              <Text style={styles.playVideoText}>
                                Play Video
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )
                    ) : (
                      <Image
                        source={{uri: item.imageUrl}}
                        style={styles.propertyImage}
                        resizeMode="cover"
                      />
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
                  {displayImages.map((_: unknown, index: number) => (
                    <View
                      key={`dot-${index}`}
                      style={[
                        styles.paginationDot,
                        currentImageIndex === index &&
                          styles.paginationDotActive,
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={styles.placeholderContainer}>
              <Image
                source={placeholderImage}
                style={styles.placeholderImage}
                resizeMode="contain"
              />
            </View>
          )}

          {/* Property Status Badges */}
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.mainBadge]}>
              <Text style={styles.badgeText}>
                For {property.propertyFor || 'Sale'}
              </Text>
            </View>

            {property.featured && (
              <View style={[styles.badge, styles.featuredBadge]}>
                <Text style={styles.badgeText}>Featured</Text>
              </View>
            )}
          </View>
        </View>

        {/* Property Title & Price Section */}
        <View style={styles.section}>
          <Text style={styles.propertyTitle}>
            {property.propertyName || 'Unnamed Property'}
          </Text>

          <Text style={styles.propertyPrice}>
            {property.price
              ? formatCurrency(property.price)
              : 'Price on request'}
          </Text>

          {/* Location with ZIP code - Updated for better formatting */}
          <View style={styles.infoRow}>
            <GetIcon
              iconName="locationPin"
              size={18}
              color={Colors.MT_PRIMARY_1}
            />
            <Text style={styles.infoText}>
              {property.location || ''}
              {property.city ? `, ${property.city}` : ''}
              {property.zipCode ? ` - ${property.zipCode}` : ''}
            </Text>
          </View>
        </View>

        {/* Property Overview */}
        <View style={[styles.section, styles.overviewSection]}>
          <Text style={styles.sectionTitle}>Overview</Text>

          <View style={styles.overviewGrid}>
            {/* Property Type */}
            <View style={styles.overviewItem}>
              <View style={styles.overviewIconWrapper}>
                <GetIcon
                  iconName="home"
                  size={20}
                  color={Colors.MT_PRIMARY_1}
                />
              </View>
              <View style={styles.overviewTextContainer}>
                <Text style={styles.overviewLabel}>Type</Text>
                <Text style={styles.overviewValue}>
                  {property.propertyType || 'Not specified'}
                </Text>
              </View>
            </View>

            {/* Property For Type */}
            <View style={styles.overviewItem}>
              <View style={styles.overviewIconWrapper}>
                <GetIcon
                  iconName="realEstate"
                  size={20}
                  color={Colors.MT_PRIMARY_1}
                />
              </View>
              <View style={styles.overviewTextContainer}>
                <Text style={styles.overviewLabel}>Category</Text>
                <Text style={styles.overviewValue}>
                  {property.propertyForType || 'Not specified'}
                </Text>
              </View>
            </View>

            {/* ZIP Code - Added explicitly to the overview section */}
            {property.zipCode && (
              <View style={styles.overviewItem}>
                <View style={styles.overviewIconWrapper}>
                  <GetIcon
                    iconName="locationPin"
                    size={20}
                    color={Colors.MT_PRIMARY_1}
                  />
                </View>
                <View style={styles.overviewTextContainer}>
                  <Text style={styles.overviewLabel}>ZIP Code</Text>
                  <Text style={styles.overviewValue}>{property.zipCode}</Text>
                </View>
              </View>
            )}

            {/* Seller Type - Adding this to overview grid */}
            {property.sellerType && (
              <View style={styles.overviewItem}>
                <View style={styles.overviewIconWrapper}>
                  <GetIcon
                    iconName="user"
                    size={20}
                    color={Colors.MT_PRIMARY_1}
                  />
                </View>
                <View style={styles.overviewTextContainer}>
                  <Text style={styles.overviewLabel}>Seller Type</Text>
                  <Text style={styles.overviewValue}>
                    {property.sellerType}
                  </Text>
                </View>
              </View>
            )}

            {/* BHK Type */}
            {property.bhkType && (
              <View style={styles.overviewItem}>
                <View style={styles.overviewIconWrapper}>
                  <GetIcon
                    iconName="room"
                    size={20}
                    color={Colors.MT_PRIMARY_1}
                  />
                </View>
                <View style={styles.overviewTextContainer}>
                  <Text style={styles.overviewLabel}>Configuration</Text>
                  <Text style={styles.overviewValue}>{property.bhkType}</Text>
                </View>
              </View>
            )}

            {/* Area */}
            {property.area && (
              <View style={styles.overviewItem}>
                <View style={styles.overviewIconWrapper}>
                  <GetIcon
                    iconName="length"
                    size={20}
                    color={Colors.MT_PRIMARY_1}
                  />
                </View>
                <View style={styles.overviewTextContainer}>
                  <Text style={styles.overviewLabel}>Area</Text>
                  <Text style={styles.overviewValue}>
                    {property.area} {property.lmUnit || 'sq ft'}
                  </Text>
                </View>
              </View>
            )}

            {/* Furnishing */}
            {property.furnishing && (
              <View style={styles.overviewItem}>
                <View style={styles.overviewIconWrapper}>
                  <GetIcon
                    iconName="doubleBed"
                    size={20}
                    color={Colors.MT_PRIMARY_1}
                  />
                </View>
                <View style={styles.overviewTextContainer}>
                  <Text style={styles.overviewLabel}>Furnishing</Text>
                  <Text style={styles.overviewValue}>
                    {property.furnishing}
                  </Text>
                </View>
              </View>
            )}

            {/* Facing */}
            {property.facing && (
              <View style={styles.overviewItem}>
                <View style={styles.overviewIconWrapper}>
                  <GetIcon
                    iconName="compass"
                    size={20}
                    color={Colors.MT_PRIMARY_1}
                  />
                </View>
                <View style={styles.overviewTextContainer}>
                  <Text style={styles.overviewLabel}>Facing</Text>
                  <Text style={styles.overviewValue}>{property.facing}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        {(property.shortDescription || property.longDescription) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>

            {property.shortDescription && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>
                  {property.shortDescription.replace(/<[^>]*>/g, '')}
                </Text>
              </View>
            )}

            {property.longDescription && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>
                  {property.longDescription.replace(/<[^>]*>/g, '')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Interest Toggle Card - Add this section */}
        <View style={styles.section}>
          <View style={styles.featuredContainer}>
            <View style={styles.featuredTextContainer}>
              <Text style={styles.featuredTitle}>
                {isFeatured ? 'Featured' : 'Not Featured'}
              </Text>
            </View>

            <Switch
              trackColor={{false: '#dddddd', true: Colors.MT_PRIMARY_1 + '80'}}
              thumbColor={isFeatured ? Colors.MT_PRIMARY_1 : '#f4f3f4'}
              ios_backgroundColor="#dddddd"
              onValueChange={handleFeaturedToggle}
              value={isFeatured}
            />
          </View>
        </View>

        {/* Additional Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>

          <View style={styles.featuresGrid}>
            {/* Ready to Move */}
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
                  size={16}
                  color={property.readyToMove ? '#fff' : '#888'}
                />
              </View>
              <Text style={styles.featureText}>Ready to Move</Text>
            </View>

            {/* Construction Done */}
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
                  size={16}
                  color={property.constructionDone ? '#fff' : '#888'}
                />
              </View>
              <Text style={styles.featureText}>Construction Done</Text>
            </View>

            {/* Boundary Wall */}
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
                  size={16}
                  color={property.boundaryWall ? '#fff' : '#888'}
                />
              </View>
              <Text style={styles.featureText}>Boundary Wall</Text>
            </View>

            {/* Lifts */}
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
                  size={16}
                  color={property.lifts ? '#fff' : '#888'}
                />
              </View>
              <Text style={styles.featureText}>Elevators</Text>
            </View>

            {/* Alarm System */}
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
                  size={16}
                  color={property.alarmSystem ? '#fff' : '#888'}
                />
              </View>
              <Text style={styles.featureText}>Alarm System</Text>
            </View>

            {/* Surveillance Cameras */}
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
                  size={16}
                  color={property.surveillanceCameras ? '#fff' : '#888'}
                />
              </View>
              <Text style={styles.featureText}>Security Cameras</Text>
            </View>

            {/* Gated Security */}
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
                  size={16}
                  color={property.gatedSecurity ? '#fff' : '#888'}
                />
              </View>
              <Text style={styles.featureText}>Gated Security</Text>
            </View>

            {/* Pantry */}
            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureIcon,
                  property.pantry
                    ? styles.featureActive
                    : styles.featureInactive,
                ]}>
                <GetIcon
                  iconName="greenCheck"
                  size={16}
                  color={property.pantry ? '#fff' : '#888'}
                />
              </View>
              <Text style={styles.featureText}>Pantry</Text>
            </View>
          </View>
        </View>

        {/* Property Specifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specifications</Text>

          <View style={styles.specsList}>
            {/* Floor */}
            {property.floor && (
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Floor</Text>
                <Text style={styles.specValue}>{property.floor}</Text>
              </View>
            )}

            {/* Parking */}
            {property.parking && (
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Parking</Text>
                <Text style={styles.specValue}>{property.parking}</Text>
              </View>
            )}

            {/* Open Side */}
            {property.openSide && (
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Open Side</Text>
                <Text style={styles.specValue}>{property.openSide}</Text>
              </View>
            )}

            {/* Property Age */}
            {property.propertyAge && (
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Property Age</Text>
                <Text style={styles.specValue}>{property.propertyAge}</Text>
              </View>
            )}

            {/* Ceiling Height */}
            {property.ceilingHeight && (
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Ceiling Height</Text>
                <Text style={styles.specValue}>{property.ceilingHeight}</Text>
              </View>
            )}

            {/* CreatedOn Date */}
            {property.createdOn && (
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Listed On</Text>
                <Text style={styles.specValue}>
                  {new Date(property.createdOn).toLocaleDateString()}
                </Text>
              </View>
            )}
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

        {/* Contact Information */}
        <View style={[styles.section, styles.sellerSection]}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

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
                  {property.sellerName || 'Seller'}
                </Text>
                <Text style={styles.sellerType}>
                  {property.sellerType || ''}
                </Text>
                {property.sellerEmail && (
                  <Text style={styles.sellerEmail}>{property.sellerEmail}</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Add at the bottom of your component return statement */}
        <ConfirmationModal
          visible={showDeleteModal}
          title="Delete Property"
          message="Are you sure you want to delete this property?"
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
  },
  contentContainer: {
    paddingBottom: 100, // Update to 100 for tab bar
    paddingTop: 0, // Add this for consistency
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
    backgroundColor: Colors.MT_PRIMARY_1,
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
    // width is dynamically set based on screen dimensions
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
  featuredBadge: {
    backgroundColor: Colors.MT_PRIMARY_1,
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
    color: Colors.MT_PRIMARY_1,
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
    flexDirection: 'row', // Change to row to show icon on left
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
  videoButton: {
    backgroundColor: Colors.MT_PRIMARY_1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  videoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
    color: Colors.MT_PRIMARY_1,
  },
  bottomSpacing: {
    // height: 40,
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
});

export default ListingDetailScreen;
