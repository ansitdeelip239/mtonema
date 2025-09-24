import React from 'react';
import SellerPropertyForm from './components/SellerPropertyForm/SellerPropertyForm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SellerBottomTabParamList } from '../../types/navigation';
import { useTranslation } from 'react-i18next';

type Props = NativeStackScreenProps<SellerBottomTabParamList, 'Add Property'>;

const PostPropertyScreen: React.FC<Props> = ({navigation}) => {
  const { t } = useTranslation();

  return (
    <SellerPropertyForm
      headerTitle={t('sellerPropertyForm.titles.postProperty', 'Post Property')}
      submitButtonText={t('common.actions.submit', 'Submit')}
      navigation={navigation}
    />
  );
};

export default PostPropertyScreen;
