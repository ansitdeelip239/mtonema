import React from 'react';
import {View, Text, TouchableOpacity, Image, Platform} from 'react-native';
import GetIcon from '../../../components/GetIcon';
import Colors from '../../../constants/Colors';
import {SellerProperty} from '../../../types';
import {formatPrice, parseImageUrl} from '../../buyer/SearchProperties/utils/helpers';
import { PropertyFor } from '../../../constants/MasterDetails';

interface SellerPropertyCardProps {
  property: SellerProperty;
  onPress: (propertyId: string) => void;
}

const SellerPropertyCard: React.FC<SellerPropertyCardProps> = ({property, onPress}) => {
  const imageUrl = parseImageUrl(property.imageURL || '') || 'https://picsum.photos/300/200?random=default';

  return (
    <TouchableOpacity
      style={styles.propertyCard}
      activeOpacity={0.8}
      onPress={() => onPress(property.id.toString())}>
      <View style={styles.propertyImageContainer}>
        <Image
          source={{uri: imageUrl}}
          style={styles.propertyImage}
          resizeMode="cover"
        />
        {property.featured && (
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
            {property.propertyFor === PropertyFor.SALE ? 'For Sale' :
             property.propertyFor === PropertyFor.RENT ? 'For Rent' :
             'Others'}
          </Text>
        </View>
      </View>

      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle} numberOfLines={1}>
          {property.propertyName}
        </Text>
        <Text style={styles.propertyLocation} numberOfLines={1}>
          <GetIcon iconName="locationPin" size={12} color="#666" />
          {' ' + property.location}
        </Text>
        <Text style={styles.propertyPrice}>
          {formatPrice(property.price, property.propertyFor as typeof PropertyFor.SALE | typeof PropertyFor.RENT | typeof PropertyFor.OTHERS)}
        </Text>

        <View style={styles.propertyDetails}>
          {property.area && (
            <Text style={styles.propertyDetail}>
              <GetIcon iconName="area" size={12} color="#666" />
              {' ' + property.area} {property.lmunit}
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

        <View style={styles.propertyStatus}>
          <Text style={[
            styles.statusText,
            property.recordstatus === 'Active' ? styles.statusActive :
            property.recordstatus === 'Inactive' ? styles.statusInactive :
            styles.statusPending,
          ]}>
            {property.recordstatus}
          </Text>
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
    marginBottom: 8,
  },
  propertyDetail: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
  propertyStatus: {
    alignItems: 'flex-end' as const,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textTransform: 'uppercase' as const,
  },
  statusActive: {
    backgroundColor: '#43a809ff',
    color: 'white',
  },
  statusInactive: {
    backgroundColor: '#ff6b6b',
    color: 'white',
  },
  statusPending: {
    backgroundColor: '#ffa726',
    color: 'white',
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
    backgroundColor: '#43a809ff',
  },
  propertyTypeBadgeRent: {
    backgroundColor: Colors.MT_PRIMARY_2,
  },
  propertyTypeBadgeOthers: {
    backgroundColor: Colors.main,
  },
};

export default SellerPropertyCard;
