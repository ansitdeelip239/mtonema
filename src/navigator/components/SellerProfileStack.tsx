import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SellerProfileScreen from '../../screens/seller/SellerProfileScreen';
import BuyerSellerEditProfile from '../../components/BuyerSellerEditProfile';
import { TouchableOpacity } from 'react-native';
import GetIcon from '../../components/GetIcon';
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{marginLeft: 16, padding: 8}}>
      <GetIcon iconName="back" size={24} color="#333" />
    </TouchableOpacity>
  );
};

export type SellerProfileStackParamList = {
  SellerProfileScreen: undefined;
  EditSellerProfileScreen: undefined;
};

const Stack = createNativeStackNavigator<SellerProfileStackParamList>();

const SellerProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="SellerProfileScreen">
      <Stack.Screen
        name="SellerProfileScreen"
        component={SellerProfileScreen}
      />
      <Stack.Screen
        name="EditSellerProfileScreen"
        component={BuyerSellerEditProfile}
        options={{
          headerShown: true,
          headerTitle: 'Edit Profile',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <BackButton />,
        }}
      />
    </Stack.Navigator>
  );
};
export default SellerProfileStack;
