import {createDrawerNavigator} from '@react-navigation/drawer';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {memo} from 'react';
import Colors from '../constants/Colors';
// import CustomDrawerContent from '../components/CustomDrawerContent';
import BuyerHomeScreen from '../screens/buyer/BuyerHomeScreen';
// import BuyerProfileScreen from '../screens/buyer/BuyerProfileScreen';
// import AboutScreen from '../screens/buyer/AboutScreen';
import ContactScreen from '../screens/buyer/ContactScreen';
import ContactedProperty from '../screens/buyer/ContactedProperty';
// import FAQScreen from '../screens/buyer/FAQScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import ChangePasswordScreen from '../screens/auth/ChangePasswordScreen';

const Drawer = createDrawerNavigator();
// const Stack = createNativeStackNavigator();

const BuyerNavigator = memo(() => {
  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <Drawer.Navigator
      // eslint-disable-next-line react/no-unstable-nested-components
      drawerContent={props => (
        // eslint-disable-next-line react/react-in-jsx-scope
        <CustomDrawerContent {...props} username="DemoBuyer" />
      )}
      initialRouteName="Home"
      screenOptions={{
        drawerType: 'front',
        drawerActiveTintColor: 'white',
        drawerActiveBackgroundColor: Colors.main,
        drawerStyle: {
          width: 240,
        },
        headerStyle: {
          backgroundColor: Colors.main,
        },
        headerTintColor: Colors.SECONDARY_3,
      }}>
      <Drawer.Screen name="Home" component={BuyerHomeScreen} />
      <Drawer.Screen name="Contacted Property" component={ContactedProperty} />
      <Drawer.Screen name="Change Password" component={ChangePasswordScreen} />
      <Drawer.Screen name="Contact Us" component={ContactScreen} />
    </Drawer.Navigator>
  );
});

export default BuyerNavigator;
