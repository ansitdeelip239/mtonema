import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from 'react-native';
import React from 'react';
import BuyerSellerHeader from '../../components/BuyerSellerHeader';
import Colors from '../../constants/Colors';
import GetIcon, {IconEnum} from '../../components/GetIcon';
import { useUserProfile } from './hooks/useUserProfile';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SellerProfileStackParamList } from '../../navigator/components/SellerProfileStack';

type Props = NativeStackScreenProps<SellerProfileStackParamList, 'SellerProfileScreen'>;

const SellerProfileScreen: React.FC<Props> = ({navigation}) => {
  const {userData, loading, error, refetch} = useUserProfile();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const handleOptionPress = (optionId: string) => {
    switch (optionId) {
      case 'edit':
        navigation.navigate('EditSellerProfileScreen');
        break;
      case 'properties':
        // Navigate to Property tab in bottom tabs
        navigation.getParent()?.navigate('Property');
        break;
      case 'settings':
        // Handle settings navigation
        break;
      default:
        break;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <BuyerSellerHeader
            title="User Profile"
            subtitle="Manage your account">
            <GetIcon iconName="threeDots" size={20} color="#333" />
          </BuyerSellerHeader>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  // Show error state if no user data
  if (!userData && !loading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <BuyerSellerHeader
            title="User Profile"
            subtitle="Manage your account">
            <GetIcon iconName="threeDots" size={20} color="#333" />
          </BuyerSellerHeader>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Unable to load profile data'}</Text>
        </View>
      </View>
    );
  }

  // Don't render main content if no user data
  if (!userData) {
    return null;
  }

  const profileOptions: {
    id: string;
    title: string;
    icon: IconEnum;
    action: string;
  }[] = [
    {
      id: 'edit',
      title: 'Edit Profile',
      icon: 'user',
      action: 'Edit Profile',
    },
    {
      id: 'properties',
      title: 'My Properties',
      icon: 'home',
      action: 'View All',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      action: 'Manage',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.MT_PRIMARY_1]}
            tintColor={Colors.MT_PRIMARY_1}
          />
        }>
        {/* Header */}
        <View style={styles.headerContainer}>
          <BuyerSellerHeader
            title="User Profile"
            subtitle="Manage your account" />
        </View>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <GetIcon iconName="user" color={Colors.MT_PRIMARY_1} size="40" />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <GetIcon iconName="edit" color="white" size="16" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <Text style={styles.userLocation}>{userData.location}</Text>
        </View>
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          {profileOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleOptionPress(option.id)}
            >
              <View style={styles.optionLeft}>
                <View style={styles.optionIcon}>
                  <GetIcon
                    iconName={option.icon}
                    color={Colors.MT_PRIMARY_1}
                    size="24"
                  />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                </View>
              </View>
              <GetIcon
                iconName="chevronRight"
                color={Colors.MT_SECONDARY_2}
                size="16"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactItem}>
              <GetIcon
                iconName="phone"
                color={Colors.MT_SECONDARY_2}
                size="20"
              />
              <Text style={styles.contactText}>{userData.phone}</Text>
            </View>
            <View style={styles.contactItem}>
              <GetIcon
                iconName="email"
                color={Colors.MT_SECONDARY_2}
                size="20"
              />
              <Text style={styles.contactText}>{userData.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <GetIcon
                iconName="locationPin"
                color={Colors.MT_SECONDARY_2}
                size="20"
              />
              <Text style={styles.contactText}>{userData.location}</Text>
            </View>
          </View>
        </View>

        {/* Member Since */}
        <View style={styles.membershipSection}>
          <Text style={styles.membershipText}>
            Member since {new Date(userData.createdOn).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SellerProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 80,
  },
  headerContainer: {
    marginBottom: 15,
  },
  scrollContainer: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
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
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.MT_PRIMARY_1,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.MT_SECONDARY_2,
    marginBottom: 3,
  },
  userLocation: {
    fontSize: 14,
    color: Colors.MT_SECONDARY_2,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '30%',
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
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.MT_PRIMARY_1,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.MT_SECONDARY_2,
    textAlign: 'center',
  },
  optionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: Colors.MT_SECONDARY_2,
  },
  contactSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  contactCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  membershipSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  membershipText: {
    fontSize: 14,
    color: Colors.MT_SECONDARY_2,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.MT_SECONDARY_2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
  },
});
