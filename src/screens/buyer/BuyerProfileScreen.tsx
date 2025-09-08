import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BuyerBottomTabParamList} from '../../types/navigation';
import ProfileScreen, {ProfileScreenConfig} from '../../components/ProfileScreen';
import {IconEnum} from '../../components/GetIcon';
import {useUserProfile} from '../seller/hooks/useUserProfile';
import {useTranslation} from 'react-i18next';

type Props = NativeStackScreenProps<BuyerBottomTabParamList, 'Profile'>;

const BuyerProfileScreen: React.FC<Props> = ({navigation}) => {
  const {userData, loading, error, refetch} = useUserProfile();
  const {t} = useTranslation();

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
      title: t('buyerProfile.options.personal.title'),
      icon: 'user' as IconEnum,
      subtitle: t('buyerProfile.options.personal.subtitle'),
    },
    {
      id: 'properties',
      title: t('buyerProfile.options.properties.title'),
      icon: 'home' as IconEnum,
      subtitle: t('buyerProfile.options.properties.subtitle'),
    },
    {
      id: 'analytics',
      title: t('buyerProfile.options.analytics.title'),
      icon: 'bill' as IconEnum,
      subtitle: t('buyerProfile.options.analytics.subtitle'),
    },
    {
      id: 'settings',
      title: t('buyerProfile.options.settings.title'),
      icon: 'settings' as IconEnum,
      subtitle: t('buyerProfile.options.settings.subtitle'),
    },
  ];

  const stats = [
    {
      id: 'totalProperties',
      value: 12,
      label: t('buyerProfile.stats.totalProperties'),
    },
    {
      id: 'activeListings',
      value: 8,
      label: t('buyerProfile.stats.activeListings'),
    },
    {
      id: 'totalEarnings',
      value: '₹45,230',
      label: t('buyerProfile.stats.totalEarnings'),
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
    title: t('buyerProfile.welcome.back'),
    subtitle: t('buyerProfile.welcome.subtitle'),
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
