import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import GetIcon from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import {BuyerBottomTabParamList} from '../../types/navigation';
// import PostProperty from '../../screens/seller/PostPropertyScreen';
// import PropertyListingForm from '../../screens/seller/PostProperty';
import SellerProfileScreen from '../../screens/seller/SellerProfileScreen';
import {CustomBottomBar, TabScreen} from './CustomBottomBar';
import BuyerDashboard from '../../screens/buyer/BuyerDashboard';
import ContactedProperties from '../../screens/buyer/ContactedPropertiesScreen';
import SearchPropertiesScreen from '../../screens/buyer/SearchPropertiesScreen';
import ContactUsScreen from '../../screens/buyer/ContactUsScreen';

const Tab = createBottomTabNavigator<BuyerBottomTabParamList>();

const tabScreens: Array<TabScreen<BuyerBottomTabParamList>> = [
  {
    name: 'Home',
    component: BuyerDashboard,
    icon: 'home',
  },
  {
    name: 'Contacted',
    component: ContactedProperties,
    icon: 'realEstate',
  },
  {
    name: 'Search Property',
    component: SearchPropertiesScreen,
    icon: 'search',
  },
  {
    name: 'Contact Us',
    component: ContactUsScreen,
    icon: 'client',
  },
  {
    name: 'Profile',
    component: SellerProfileScreen,
    icon: 'user',
  },
] as const;

const BuyerBottomTabs = memo(() => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName={'Home'}
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={props => <CustomBottomBar {...props} tabScreens={tabScreens} />}>
      {tabScreens.map(({name, component, icon}) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarLabel: name,
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({focused, color}) => (
              <GetIcon iconName={icon} color={focused ? Colors.MT_PRIMARY_1 : color} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
});

export default BuyerBottomTabs;
