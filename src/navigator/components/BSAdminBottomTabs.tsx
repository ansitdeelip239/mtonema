import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import GetIcon from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import {BuyerSellerAdminBottomTabParamList} from '../../types/navigation';
import {CustomBottomBar, TabScreen} from './CustomBottomBar';
import AdminHomeScreen from '../../screens/admin/partner/home-screen/HomeScreen';
import AdminPropertiesScreen from '../../screens/admin/buyer-seller/AdminPropertiesScreen/AdminPropertiesScreen';
import BuyerSellerList from '../../screens/admin/buyer-seller/BuyerSellerList/BuyerSellerList';

const Tab = createBottomTabNavigator<BuyerSellerAdminBottomTabParamList>();

const tabScreens: Array<TabScreen<BuyerSellerAdminBottomTabParamList>> = [
  {
    name: 'Home',
    component: AdminHomeScreen,
    icon: 'home',
  },
  {
    name: 'Sellers',
    component: BuyerSellerList,
    icon: 'client',
  },
  {
    name: 'AddProperty',
    component: AdminHomeScreen,
    icon: 'property',
  },
  {
    name: 'Property',
    component: AdminPropertiesScreen,
    icon: 'realEstate',
  },
  {
    name: 'Profile',
    component: AdminHomeScreen,
    icon: 'user',
  },
] as const;

const BuyerSellerAdminBottomTabs = memo(() => (
  <Tab.Navigator
    initialRouteName="Property"
    screenOptions={{
      headerShown: false,
    }}
    // eslint-disable-next-line react/no-unstable-nested-components
    tabBar={props => <CustomBottomBar {...props} tabScreens={tabScreens} />}>
    {tabScreens.map(({name, component, icon, listeners}) => (
      <Tab.Screen
        key={name}
        name={name}
        component={component}
        options={{
          tabBarLabel: name,
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({focused, color}) => (
            <GetIcon iconName={icon} color={focused ? Colors.main : color} />
          ),
        }}
        listeners={listeners}
      />
    ))}
  </Tab.Navigator>
));

export default BuyerSellerAdminBottomTabs;
