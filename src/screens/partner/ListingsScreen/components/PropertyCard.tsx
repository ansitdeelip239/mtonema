import React, {useRef, useEffect, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import {Property} from '../types';
import {formatCurrency} from '../../../../utils/currency';
import Colors from '../../../../constants/Colors';
import GetIcon from '../../../../components/GetIcon';

// Default placeholder image for when no images are available
const placeholderImage = require('../../../../assets/Images/dncr_black_logo.png');

interface PropertyCardProps {
  property: Property;
}

const {width} = Dimensions.get('window');
const CARD_WIDTH = width - 24; // Full width minus padding
const CARD_HEIGHT = 160; // Reduced height for horizontal layout
const IMAGE_WIDTH = CARD_WIDTH * 0.35; // 35% of card width for image
const IMAGE_HEIGHT = CARD_HEIGHT - 24; // Maintain some padding

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
      : null;

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
      <View style={styles.cardContent}>
        {/* Property Image */}
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

          {/* Featured Badge */}
          {property.featured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>

        {/* Property Details */}
        <View style={styles.detailsContainer}>
          {/* Property Name */}
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {property.propertyName || 'Unnamed Property'}
          </Text>

          {/* Price */}
          <Text style={styles.price}>{formattedPrice}</Text>

          {/* Location */}
          <View style={styles.locationContainer}>
            <GetIcon iconName="locationPin" color={Colors.main} size={14} />
            <Text
              style={styles.location}
              numberOfLines={1}
              ellipsizeMode="tail">
              {property.location || 'Location not specified'}
              {property.city ? `, ${property.city}` : ''}
            </Text>
          </View>

          {/* Area (if available) */}
          {formattedArea && (
            <View style={styles.areaContainer}>
              <GetIcon iconName="length" size={16} color={Colors.main} />
              <Text style={styles.areaText}>{formattedArea}</Text>
            </View>
          )}

          {/* Type and Furnishing in one row */}
          <View style={styles.bottomRow}>
            <View style={styles.typeContainer}>
              <GetIcon iconName="home" size={14} color={Colors.main} />
              <Text style={styles.typeText} numberOfLines={1}>
                {property.propertyType || 'Not specified'}
              </Text>
            </View>

            {property.furnishing && (
              <View style={styles.furnishingContainer}>
                <GetIcon iconName="doubleBed" size={14} color={Colors.main} />
                <Text style={styles.furnishingText} numberOfLines={1}>
                  {property.furnishing}
                </Text>
              </View>
            )}
          </View>
        </View>
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
  cardContent: {
    flexDirection: 'row',
    height: '100%',
    padding: 12,
  },
  imageContainer: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.main,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  featuredText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  propertyForBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  propertyForText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.main,
    marginVertical: 4,
  },
  areaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  areaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  furnishingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  furnishingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});

export default PropertyCard;
