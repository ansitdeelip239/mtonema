import React from 'react';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {PartnerBottomTabParamList} from '../../../types/navigation';
import PartnerPropertyForm from '../components/PartnerPropertyForm/PartnerPropertyForm';

type Props = BottomTabScreenProps<PartnerBottomTabParamList, 'AddProperty'>;

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
