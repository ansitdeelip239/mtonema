import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BuyerBottomTabParamList} from '../../types/navigation';
import ProfileScreen, {ProfileScreenConfig} from '../../components/ProfileScreen';
import {IconEnum} from '../../components/GetIcon';
import {useUserProfile} from '../seller/hooks/useUserProfile';

type Props = NativeStackScreenProps<BuyerBottomTabParamList, 'Profile'>;

const BuyerProfileScreen: React.FC<Props> = ({navigation}) => {
  const {userData, loading, error, refetch} = useUserProfile();

  const handleRefresh = async () => {
    await refetch();
  };

  const handleOptionPress = (optionId: string) => {
    switch (optionId) {
      case 'personal':
        // Navigate to edit profile or settings
        navigation.navigate('Dashboard'); // Placeholder navigation
        break;
      case 'properties':
        // Navigate to properties section
        navigation.navigate('Contacted'); // Navigate to contacted properties
        break;
      case 'analytics':
        // Navigate to analytics
        navigation.navigate('Dashboard'); // Placeholder navigation
        break;
      case 'settings':
        // Handle settings navigation
        navigation.navigate('Dashboard'); // Placeholder navigation
        break;
      default:
        break;
    }
  };

  const profileOptions = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: 'user' as IconEnum,
      subtitle: 'Edit Profile',
    },
    {
      id: 'properties',
      title: 'My Properties',
      icon: 'home' as IconEnum,
      subtitle: 'View All',
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: 'bill' as IconEnum,
      subtitle: 'View Stats',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings' as IconEnum,
      subtitle: 'Manage',
    },
  ];

  const stats = [
    {
      id: 'totalProperties',
      value: 12,
      label: 'Total Properties',
    },
    {
      id: 'activeListings',
      value: 8,
      label: 'Active Listings',
    },
    {
      id: 'totalEarnings',
      value: '₹45,230',
      label: 'Total Earnings',
    },
  ];

  const contactItems = userData ? [
    {
      id: 'phone',
      icon: 'phone' as IconEnum,
      value: userData.phone,
    },
    {
      id: 'email',
      icon: 'email' as IconEnum,
      value: userData.email,
    },
    {
      id: 'location',
      icon: 'locationPin' as IconEnum,
      value: userData.location,
    },
  ] : [];

  const config: ProfileScreenConfig = {
    title: 'Welcome back',
    subtitle: 'User Profile',
    userData: userData || undefined,
    profileOptions,
    contactItems,
    stats,
    showStats: false,
    showContactInfo: true,
    showMembership: true,
    loading,
    error: error || undefined,
    onRefresh: handleRefresh,
    onOptionPress: handleOptionPress,
  };

  return <ProfileScreen config={config} />;
};

export default BuyerProfileScreen;
