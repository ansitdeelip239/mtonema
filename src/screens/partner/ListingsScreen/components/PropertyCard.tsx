import React, {useRef, useEffect, memo} from 'react';
import {View, Text, StyleSheet, Image, Animated} from 'react-native';
import {Property} from '../types';
import {formatCurrency} from '../../../../utils/currency';
import Colors from '../../../../constants/Colors';
import GetIcon from '../../../../components/GetIcon';

// Default placeholder image for when no images are available
const placeholderImage = require('../../../../assets/Images/dncr_black_logo.png');

interface PropertyCardProps {
  property: Property;
}

// const {width} = Dimensions.get('window');
// const CARD_WIDTH = width - 24; // Full width minus padding
const CARD_HEIGHT = 380; // Fixed height for card
const IMAGE_HEIGHT = 220; // Height for single image

const PropertyCard = memo(({property}: PropertyCardProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Find toggled image or default to first image
  const getDisplayImage = () => {
    if (!property.imageURL) {
      return null;
    }

    try {
      const parsedImages = JSON.parse(property.imageURL);
      // Find the image with toggle:true
      const toggledImage = parsedImages.find((img: any) => img.toggle === true);
      return toggledImage ? {url: toggledImage.imageUrl} : null;
    } catch (error) {
      console.error('Error parsing image URL:', error);
      return null;
    }
  };

  // Get the image to display
  const displayImage = getDisplayImage();

  // Format price display
  const formattedPrice = property.price
    ? formatCurrency(property.price)
    : 'Price on request';

  // Format area with unit
  const formattedArea =
    property.area && property.lmunit
      ? `${property.area} ${property.lmunit}`
      : 'Area not specified';

  // Fade in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[styles.card, {opacity: fadeAnim}]}
      testID="property-card">
      {/* Property Status Badge */}
      {property.featured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>Featured</Text>
        </View>
      )}

      {/* Single Property Image */}
      <View style={styles.imageContainer}>
        {displayImage ? (
          <Image
            source={{uri: displayImage.url}}
            style={styles.image}
            resizeMode="cover"
            accessible={true}
            accessibilityLabel={`Image of ${
              property.propertyName || 'property'
            }`}
          />
        ) : (
          <Image
            source={placeholderImage}
            style={styles.image}
            resizeMode="contain"
            accessible={true}
            accessibilityLabel="Property placeholder image"
          />
        )}

        {/* Property For Label */}
        <View style={styles.propertyForBadge}>
          <Text style={styles.propertyForText}>
            {property.propertyFor || 'For Sale'}
          </Text>
        </View>
      </View>

      {/* Property Details */}
      <View style={styles.detailsContainer}>
        {/* Property Name */}
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {property.propertyName || 'Unnamed Property'}
        </Text>

        {/* Price */}
        <Text style={styles.price}>{formattedPrice}</Text>

        {/* Location */}
        <View style={styles.locationContainer}>
          {/* <LocationPin /> */}
          <GetIcon iconName="locationPin" color={Colors.main} />
          <Text style={styles.location} numberOfLines={1} ellipsizeMode="tail">
            {property.location || 'Location not specified'},{' '}
            {property.city || ''}
          </Text>
        </View>

        {/* Key Details */}
        <View style={styles.keyDetailsContainer}>
          {/* Property Type */}
          <View style={styles.keyDetailItem}>
            {/* <HomeIcon /> */}
            <GetIcon iconName="home" />
            <Text style={styles.keyDetailText}>
              {property.propertyType || 'Not specified'}
            </Text>
          </View>

          {/* Area */}
          <View style={styles.keyDetailItem}>
            {/* <RulerIcon /> */}
            <GetIcon iconName="area" />
            <Text style={styles.keyDetailText}>{formattedArea}</Text>
          </View>

          {/* Furnished Status */}
          {property.furnishing && (
            <View style={styles.keyDetailItem}>
              {/* <SofaIcon /> */}
              <GetIcon iconName="doubleBed" />
              <Text style={styles.keyDetailText}>{property.furnishing}</Text>
            </View>
          )}
        </View>

        {/* Tags
        {property.tags && (
          <View style={styles.tagsContainer}>
            {parseTags(property.tags).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )} */}
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: CARD_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: Colors.main,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 10,
  },
  featuredText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  propertyForBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  propertyForText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.main,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  keyDetailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  keyDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 6,
  },
  keyDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },

  // Custom icon styles
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  // Location pin icon
  pinHead: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.main,
    position: 'absolute',
    top: 0,
    left: 6,
  },
  pinBody: {
    width: 8,
    height: 12,
    backgroundColor: Colors.main,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    position: 'absolute',
    top: 6,
    left: 6,
  },

  // Home icon
  homeRoof: {
    width: 16,
    height: 8,
    backgroundColor: '#666',
    transform: [{rotate: '45deg'}],
    borderTopLeftRadius: 4,
    position: 'absolute',
    top: 2,
    left: 2,
  },
  homeBody: {
    width: 12,
    height: 10,
    backgroundColor: '#666',
    position: 'absolute',
    bottom: 2,
    left: 4,
    borderRadius: 2,
  },

  // Ruler icon
  rulerLine: {
    width: 16,
    height: 2,
    backgroundColor: '#666',
    position: 'absolute',
    left: 2,
    top: 9,
  },
  rulerTick1: {
    width: 2,
    height: 8,
    backgroundColor: '#666',
    position: 'absolute',
    top: 5,
    left: 4,
  },
  rulerTick2: {
    width: 2,
    height: 6,
    backgroundColor: '#666',
    position: 'absolute',
    top: 6,
    left: 9,
  },
  rulerTick3: {
    width: 2,
    height: 8,
    backgroundColor: '#666',
    position: 'absolute',
    top: 5,
    left: 14,
  },

  // Sofa icon
  sofaBase: {
    width: 16,
    height: 6,
    backgroundColor: '#666',
    position: 'absolute',
    bottom: 2,
    left: 2,
    borderRadius: 2,
  },
  sofaBack: {
    width: 16,
    height: 2,
    backgroundColor: '#666',
    position: 'absolute',
    top: 4,
    left: 2,
    borderRadius: 1,
  },
  sofaArm1: {
    width: 2,
    height: 8,
    backgroundColor: '#666',
    position: 'absolute',
    top: 4,
    left: 2,
    borderRadius: 1,
  },
  sofaArm2: {
    width: 2,
    height: 8,
    backgroundColor: '#666',
    position: 'absolute',
    top: 4,
    right: 2,
    borderRadius: 1,
  },
});

export default PropertyCard;
