import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import GetIcon from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import {BuyerBottomTabParamList} from '../../types/navigation';
// import PostProperty from '../../screens/seller/PostPropertyScreen';
// import PropertyListingForm from '../../screens/seller/PostProperty';
import {CustomBottomBar, TabScreen} from './CustomBottomBar';
import BuyerDashboard from '../../screens/buyer/BuyerDashboard';
import ContactedProperties from '../../screens/buyer/ContactedPropertiesScreen';
import SearchPropertiesScreen from '../../screens/buyer/SearchProperties/SearchPropertiesScreen';
import ContactUsScreen from '../../screens/buyer/ContactUsScreen';
import BuyerProfileScreen from '../../screens/buyer/BuyerProfileScreen';

const Tab = createBottomTabNavigator<BuyerBottomTabParamList>();

const tabScreens: Array<TabScreen<BuyerBottomTabParamList>> = [
  {
    name: 'Dashboard',
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
    component: BuyerProfileScreen,
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
      initialRouteName={'Dashboard'}
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
