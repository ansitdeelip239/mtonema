import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, Platform} from 'react-native';
import GetIcon from '../../../../components/GetIcon';
import Colors from '../../../../constants/Colors';
import {Property} from '../../../../types';
import {formatPrice, parseImageUrl} from '../utils/helpers';
import { PropertyFor } from '../../../../constants/MasterDetails';
import Images from '../../../../constants/Images';
import {useTranslation} from 'react-i18next';

interface PropertyCardProps {
  property: Property;
  onPress: (propertyId: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({property, onPress}) => {
  const [imageError, setImageError] = useState(false);
  const {t} = useTranslation();
  const imageUrl = parseImageUrl(property.imageURL) || Images.MT_ONE_LOGO;
  const isFallbackImage = !parseImageUrl(property.imageURL) || imageError;

  return (
    <TouchableOpacity
      style={styles.propertyCard}
      activeOpacity={0.8}
      onPress={() => onPress(property.propertyId.toString())}>
      <View style={styles.propertyImageContainer}>
        {isFallbackImage ? (
          <View style={styles.placeholderContainer}>
            <Image
              source={{uri: Images.MT_ONE_LOGO}}
              style={styles.placeholderImage}
              resizeMode="contain"
            />
          </View>
        ) : (
          imageUrl && imageUrl.trim() !== '' ? (
            <Image
              source={{uri: imageUrl}}
              style={styles.propertyImage}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Image
                source={{uri: Images.MT_ONE_LOGO}}
                style={styles.placeholderImage}
                resizeMode="contain"
              />
            </View>
          )
        )}
        {property.isFeatured && (
          <View style={styles.verifiedBadge}>
            <GetIcon iconName="premium" size={14} color="white" />
          </View>
        )}
        <View style={[
          styles.propertyTypeBadge,
          property.propertyFor === PropertyFor.SALE ? styles.propertyTypeBadgeSale :
          property.propertyFor === PropertyFor.RENT ? styles.propertyTypeBadgeRent :
          styles.propertyTypeBadgeOthers,
        ]}>
          <Text style={styles.propertyTypeBadgeText}>
            {property.propertyFor === PropertyFor.SALE ? t('propertyCard.propertyType.forSale') :
             property.propertyFor === PropertyFor.RENT ? t('propertyCard.propertyType.forRent') :
             t('propertyCard.propertyType.others')}
          </Text>
        </View>
      </View>

      <View style={styles.propertyInfo}>
        {property.propertyName && (
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {property.propertyName}
          </Text>
        )}
        {property.locationAddress && (
          <Text style={styles.propertyLocation} numberOfLines={1}>
            <GetIcon iconName="locationPin" size={12} color="#666" />
            {' ' + property.locationAddress}
          </Text>
        )}
        {property.price && (
          <Text style={styles.propertyPrice}>
            {formatPrice(property.price, property.propertyFor as typeof PropertyFor.SALE | typeof PropertyFor.RENT | typeof PropertyFor.OTHERS)}
          </Text>
        )}

        <View style={styles.propertyDetails}>
          {property.area && property.lmUnit && (
            <Text style={styles.propertyDetail}>
              <GetIcon iconName="area" size={12} color="#666" />
              {' ' + property.area} {property.lmUnit}
            </Text>
          )}
          {property.bhkType && (
            <Text style={styles.propertyDetail}>
              <GetIcon iconName="doubleBed" size={12} color="#666" />
              {' ' + property.bhkType}
            </Text>
          )}
          {property.propertyType && (
            <Text style={styles.propertyDetail}>
              <GetIcon iconName="home" size={12} color="#666" />
              {' ' + property.propertyType}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
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
    alignItems: 'center' as const,
    marginBottom: 12,
    position: 'relative' as const,
  },
  propertyImage: {
    width: '100%' as const,
    height: 120,
    borderRadius: 8,
  },
  placeholderContainer: {
    width: '100%' as const,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    opacity: 0.5,
  },
  verifiedBadge: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
    backgroundColor: Colors.MT_PRIMARY_1,
    borderRadius: 12,
    padding: 4,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
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
    fontWeight: 'bold' as const,
    color: Colors.MT_PRIMARY_1,
    marginBottom: 8,
  },
  propertyDetails: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  propertyDetail: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
  propertyTypeBadge: {
    position: 'absolute' as const,
    top: 8,
    left: 8,
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
    backgroundColor: '#43a809ff', // Using the app's primary pink color
  },
  propertyTypeBadgeRent: {
    backgroundColor: Colors.MT_PRIMARY_2, // Using the same warm color as selected chips
  },
  propertyTypeBadgeOthers: {
    backgroundColor: Colors.main, // Using the main pink color for variety
  },
};

export default PropertyCard;
