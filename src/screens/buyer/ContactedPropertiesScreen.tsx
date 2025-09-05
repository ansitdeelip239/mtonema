import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import GetIcon from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import {BuyerBottomTabParamList} from '../../types/navigation';
import BuyerHeader from '../../components/BuyerSellerHeader';

type Props = NativeStackScreenProps<BuyerBottomTabParamList, 'Contacted'>;

interface ContactedProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  image: any;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  contactDate: string;
  status: 'pending' | 'responded' | 'viewed';
  agentName: string;
  agentPhone: string;
}

const ContactedProperties: React.FC<Props> = ({navigation: _navigation}) => {
  // Mock data for contacted properties
  const [contactedProperties] = useState<ContactedProperty[]>([
    {
      id: '1',
      title: 'Modern 3BHK Apartment',
      location: 'Andheri West, Mumbai',
      price: '₹2.5 Cr',
      image: {uri: 'https://picsum.photos/300/200?random=1'},
      type: 'Apartment',
      bedrooms: 3,
      bathrooms: 2,
      area: '1,200 sq ft',
      contactDate: '2025-09-01',
      status: 'responded',
      agentName: 'Rajesh Kumar',
      agentPhone: '+91 98765 43210',
    },
    {
      id: '2',
      title: 'Luxury Villa',
      location: 'Thane West',
      price: '₹4.2 Cr',
      image: {uri: 'https://picsum.photos/300/200?random=2'},
      type: 'Villa',
      bedrooms: 4,
      bathrooms: 3,
      area: '2,500 sq ft',
      contactDate: '2025-08-28',
      status: 'pending',
      agentName: 'Priya Sharma',
      agentPhone: '+91 87654 32109',
    },
    {
      id: '3',
      title: 'Penthouse with Sea View',
      location: 'Bandra West, Mumbai',
      price: '₹8.5 Cr',
      image: {uri: 'https://picsum.photos/300/200?random=3'},
      type: 'Penthouse',
      bedrooms: 4,
      bathrooms: 4,
      area: '3,200 sq ft',
      contactDate: '2025-08-25',
      status: 'viewed',
      agentName: 'Amit Patel',
      agentPhone: '+91 76543 21098',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'responded':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'viewed':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'responded':
        return 'Agent Responded';
      case 'pending':
        return 'Waiting for Response';
      case 'viewed':
        return 'Agent Viewed';
      default:
        return 'Unknown';
    }
  };

  const renderContactedProperty = (property: ContactedProperty) => (
    <TouchableOpacity
      key={property.id}
      style={styles.propertyCard}
      activeOpacity={0.8}
      onPress={() => {
        // Navigate to property details
        console.log('Navigate to property:', property.id);
      }}>
      <View style={styles.propertyImageContainer}>
        <Image
          source={property.image}
          style={styles.propertyImage}
          resizeMode="cover"
        />
        <View style={[styles.statusBadge, {backgroundColor: getStatusColor(property.status)}]}>
          <Text style={styles.statusText}>{getStatusText(property.status)}</Text>
        </View>
      </View>

      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle} numberOfLines={1}>
          {property.title}
        </Text>
        <Text style={styles.propertyLocation} numberOfLines={1}>
          <GetIcon iconName="locationPin" size={12} color="#666" />
          {' ' + property.location}
        </Text>
        <Text style={styles.propertyPrice}>{property.price}</Text>

        <View style={styles.propertyDetails}>
          <Text style={styles.propertyDetail}>
            <GetIcon iconName="doubleBed" size={12} color="#666" />
            {' ' + property.bedrooms}
          </Text>
          <Text style={styles.propertyDetail}>
            <GetIcon iconName="room" size={12} color="#666" />
            {' ' + property.bathrooms}
          </Text>
          <Text style={styles.propertyDetail}>
            <GetIcon iconName="area" size={12} color="#666" />
            {' ' + property.area}
          </Text>
        </View>

        <View style={styles.contactInfo}>
          <Text style={styles.contactDate}>
            Contacted on {new Date(property.contactDate).toLocaleDateString()}
          </Text>
          <Text style={styles.agentInfo}>
            <GetIcon iconName="user" size={12} color="#666" />
            {' ' + property.agentName}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={() => {
              // Handle call action
              console.log('Call agent:', property.agentPhone);
            }}>
            <GetIcon iconName="phone" size={16} color="white" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.messageButton]}
            onPress={() => {
              // Handle message action
              console.log('Message agent:', property.agentName);
            }}>
            <GetIcon iconName="message" size={16} color="white" />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Buyer Header */}
      <BuyerHeader
        title="Your Contacts"
        subtitle="Contacted Properties"
      >
        <GetIcon iconName="settings" size={20} color="#333" />
      </BuyerHeader>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <GetIcon iconName="phone" size={20} color={Colors.MT_PRIMARY_1} />
          </View>
          <Text style={styles.statValue}>{contactedProperties.length}</Text>
          <Text style={styles.statLabel}>Total Contacts</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <GetIcon iconName="message" size={20} color="#4CAF50" />
          </View>
          <Text style={styles.statValue}>
            {contactedProperties.filter(p => p.status === 'responded').length}
          </Text>
          <Text style={styles.statLabel}>Responses</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <GetIcon iconName="time" size={20} color="#FF9800" />
          </View>
          <Text style={styles.statValue}>
            {contactedProperties.filter(p => p.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Contacted Properties List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Contacts</Text>
        <View style={styles.propertiesList}>
          {contactedProperties.map(property => renderContactedProperty(property))}
        </View>
      </View>

      {/* Bottom spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
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
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    gap: 6,
  },
  callButton: {
    backgroundColor: Colors.MT_PRIMARY_1,
  },
  messageButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default ContactedProperties;
