import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SellerProfileScreen from '../../screens/seller/SellerProfileScreen';
import BuyerSellerEditProfile from '../../components/BuyerSellerEditProfile';

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
      />
    </Stack.Navigator>
  );
};
export default SellerProfileStack;
