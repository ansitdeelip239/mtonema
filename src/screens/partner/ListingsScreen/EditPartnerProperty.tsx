import React from 'react';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ListingScreenStackParamList} from '../../../navigator/components/PropertyListingScreenStack';
import PartnerPropertyForm from '../components/PartnerPropertyForm/PartnerPropertyForm';

type EditPartnerPropertyScreenProps = {
  route: RouteProp<ListingScreenStackParamList, 'EditPartnerProperty'>;
  navigation: NativeStackNavigationProp<
    ListingScreenStackParamList,
    'EditPartnerProperty'
  >;
};

const EditPartnerPropertyScreen: React.FC<EditPartnerPropertyScreenProps> = ({
  route,
  navigation,
}) => {
  const {propertyData} = route.params;

  return (
    <PartnerPropertyForm
      editMode={true}
      propertyData={propertyData}
      headerTitle="Edit Property"
      submitButtonText="Update Property"
      navigation={navigation}
    />
  );
};

export default EditPartnerPropertyScreen;
