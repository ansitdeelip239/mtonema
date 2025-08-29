import React from 'react';
import PartnerPropertyForm from '../components/PartnerPropertyForm/PartnerPropertyForm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AddPropertyStackParamList } from '../../../navigator/components/AddPropertyStack';
import { useTranslation } from 'react-i18next';

type Props = NativeStackScreenProps<AddPropertyStackParamList, 'AddPartnerProperty'>;

const AddPartnerPropertyScreen: React.FC<Props> = ({navigation}) => {
  const { t } = useTranslation();

  return (
    <PartnerPropertyForm
      headerTitle={t('partnerPropertyForm.titles.addProperty')}
      submitButtonText={t('common.actions.submit')}
      navigation={navigation}
    />
  );
};

export default AddPartnerPropertyScreen;
