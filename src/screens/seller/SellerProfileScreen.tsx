import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SellerProfileStackParamList} from '../../navigator/components/SellerProfileStack';
import ProfileScreen, {ProfileScreenConfig} from '../../components/ProfileScreen';
import {IconEnum} from '../../components/GetIcon';
import {useUserProfile} from './hooks/useUserProfile';
import {useTranslation} from 'react-i18next';

type Props = NativeStackScreenProps<SellerProfileStackParamList, 'SellerProfileScreen'>;

const SellerProfileScreen: React.FC<Props> = ({navigation}) => {
  const {userData, loading, error, refetch} = useUserProfile();
  const {t} = useTranslation();

  const handleRefresh = async () => {
    await refetch();
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
        navigation.getParent()?.navigate('Settings');
        break;
      default:
        break;
    }
  };

  const profileOptions = [
    {
      id: 'edit',
      title: t('seller.profile.editProfile'),
      icon: 'user' as IconEnum,
    },
    {
      id: 'properties',
      title: t('seller.profile.myProperties'),
      icon: 'home' as IconEnum,
    },
    {
      id: 'settings',
      title: t('seller.profile.settings'),
      icon: 'settings' as IconEnum,
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
    title: t('seller.profile.title'),
    subtitle: t('seller.profile.subtitle'),
    userData: userData || undefined,
    profileOptions,
    contactItems,
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

export default SellerProfileScreen;
