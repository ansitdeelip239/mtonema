import React from 'react';
import PartnerPropertyForm from '../components/PartnerPropertyForm/PartnerPropertyForm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AddPropertyStackParamList } from '../../../navigator/components/AddPropertyStack';

type Props = NativeStackScreenProps<AddPropertyStackParamList, 'AddPartnerProperty'>;

const AddPartnerPropertyScreen: React.FC<Props> = ({navigation}) => {
  return (
    <PartnerPropertyForm
      headerTitle="Add Property"
      submitButtonText="Submit"
      navigation={navigation}
    />
  );
};

export default AddPartnerPropertyScreen;
