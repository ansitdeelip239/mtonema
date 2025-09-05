import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import BuyerHeader from '../../components/BuyerSellerHeader';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {SellerBottomTabParamList} from '../../types/navigation';
import Colors from '../../constants/Colors';
import GetIcon from '../../components/GetIcon';

type Props = BottomTabScreenProps<SellerBottomTabParamList, 'Home'>;

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  status: 'active' | 'pending' | 'sold';
  image: string;
  views: number;
  inquiries: number;
}

const PropertyCard: React.FC<{property: Property}> = ({property}) => {
  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'active':
        return Colors.MT_PRIMARY_1;
      case 'pending':
        return '#FFA500';
      case 'sold':
        return '#DC143C';
      default:
        return Colors.MT_SECONDARY_2;
    }
  };

  const getStatusText = (status: Property['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'pending':
        return 'Pending';
      case 'sold':
        return 'Sold';
      default:
        return status;
    }
  };

  return (
    <TouchableOpacity style={styles.propertyCard} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={{uri: property.image}} style={styles.propertyImage} />
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: getStatusColor(property.status)},
          ]}>
          <Text style={styles.statusText}>
            {getStatusText(property.status)}
          </Text>
        </View>
      </View>

      <View style={styles.propertyDetails}>
        <Text style={styles.propertyTitle} numberOfLines={2}>
          {property.title}
        </Text>

        <View style={styles.locationContainer}>
          <GetIcon
            iconName="locationPin"
            color={Colors.MT_SECONDARY_2}
            size="14"
          />
          <Text style={styles.locationText} numberOfLines={1}>
            {property.location}
          </Text>
        </View>

        <Text style={styles.priceText}>{property.price}</Text>

        <View style={styles.propertySpecs}>
          {property.bedrooms > 0 && (
            <View style={styles.specItem}>
              <GetIcon
                iconName="home"
                color={Colors.MT_SECONDARY_2}
                size="16"
              />
              <Text style={styles.specText}>{property.bedrooms}B</Text>
            </View>
          )}

          <View style={styles.specItem}>
            <GetIcon
              iconName="property"
              color={Colors.MT_SECONDARY_2}
              size="16"
            />
            <Text style={styles.specText}>{property.bathrooms}B</Text>
          </View>

          <View style={styles.specItem}>
            <GetIcon
              iconName="property"
              color={Colors.MT_SECONDARY_2}
              size="16"
            />
            <Text style={styles.specText}>{property.area}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <GetIcon iconName="eye" color={Colors.MT_SECONDARY_2} size="14" />
            <Text style={styles.statText}>{property.views} views</Text>
          </View>

          <View style={styles.statItem}>
            <GetIcon
              iconName="message"
              color={Colors.MT_SECONDARY_2}
              size="14"
            />
            <Text style={styles.statText}>{property.inquiries} inquiries</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
            <GetIcon iconName="edit" color={Colors.MT_PRIMARY_1} size="16" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} activeOpacity={0.7}>
            <GetIcon iconName="delete" color="#DC143C" size="16" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PropertyListScreen: React.FC<Props> = () => {
  const [properties] = useState<Property[]>([
    {
      id: '1',
      title: 'Modern 3BHK Apartment',
      location: 'Andheri West, Mumbai',
      price: '₹85,00,000',
      type: 'Apartment',
      bedrooms: 3,
      bathrooms: 2,
      area: '1,250 sq ft',
      status: 'active',
      image:
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
      views: 245,
      inquiries: 12,
    },
    {
      id: '2',
      title: 'Luxury Villa with Garden',
      location: 'Thane West',
      price: '₹2,25,00,000',
      type: 'Villa',
      bedrooms: 4,
      bathrooms: 3,
      area: '3,500 sq ft',
      status: 'active',
      image:
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
      views: 189,
      inquiries: 8,
    },
    {
      id: '3',
      title: 'Commercial Office Space',
      location: 'Bandra Kurla Complex',
      price: '₹45,00,000/month',
      type: 'Commercial',
      bedrooms: 0,
      bathrooms: 2,
      area: '2,000 sq ft',
      status: 'pending',
      image:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      views: 156,
      inquiries: 5,
    },
    {
      id: '4',
      title: 'Cozy 2BHK Flat',
      location: 'Powai, Mumbai',
      price: '₹65,00,000',
      type: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      area: '950 sq ft',
      status: 'sold',
      image:
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      views: 312,
      inquiries: 15,
    },
    {
      id: '5',
      title: 'Penthouse with Sea View',
      location: 'Marine Drive',
      price: '₹3,50,00,000',
      type: 'Penthouse',
      bedrooms: 3,
      bathrooms: 3,
      area: '2,800 sq ft',
      status: 'active',
      image:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
      views: 98,
      inquiries: 3,
    },
  ]);

  return (
    <View style={styles.container}>
      <BuyerHeader
        title="Listed Properties"
        subtitle="Manage your listings"
      >
        <GetIcon iconName="filter" size={20} color="#333" />
      </BuyerHeader>

      <View style={styles.content}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            Total Properties: {properties.length}
          </Text>
          <Text style={styles.summaryText}>
            Active: {properties.filter(p => p.status === 'active').length}
          </Text>
        </View>

        <ScrollView
          style={styles.propertiesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
          <GetIcon iconName="plus" color="white" size="24" />
          <Text style={styles.addButtonText}>Add New Property</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.MT_SECONDARY_2,
  },
  propertiesList: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  propertyCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  propertyDetails: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: Colors.MT_SECONDARY_2,
    marginLeft: 4,
    flex: 1,
  },
  priceText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.MT_PRIMARY_1,
    marginBottom: 12,
  },
  propertySpecs: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  specText: {
    fontSize: 14,
    color: Colors.MT_SECONDARY_2,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: Colors.MT_SECONDARY_2,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  editButtonText: {
    color: Colors.MT_PRIMARY_1,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff5f5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#DC143C',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: Colors.MT_PRIMARY_1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: Colors.MT_PRIMARY_1,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default PropertyListScreen;
