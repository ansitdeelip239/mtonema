import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import GetIcon from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import {SellerBottomTabParamList} from '../../types/navigation';
import PropertyListScreen from '../../screens/seller/PropertyListScreen';
// import PostProperty from '../../screens/seller/PostPropertyScreen';
// import PropertyListingForm from '../../screens/seller/PostProperty';
import SellerProfileScreen from '../../screens/seller/SellerProfileScreen';
import PostPropertyForm from '../../screens/seller/PostProperty/PostPropertyForm';
import SellerHomeScreen from '../../screens/seller/SellerHomeScreen';
import {useAuth} from '../../hooks/useAuth';
import {CustomBottomBar, TabScreen} from './CustomBottomBar';

const Tab = createBottomTabNavigator<SellerBottomTabParamList>();

const tabScreens: Array<TabScreen<SellerBottomTabParamList>> = [
  {
    name: 'Home',
    component: PropertyListScreen,
    icon: 'home',
  },
  {
    name: 'Property',
    component: SellerHomeScreen,
    icon: 'realEstate',
  },
  {
    name: 'AddProperty',
    component: PostPropertyForm,
    icon: 'property',
  },
  {
    name: 'Clients',
    component: SellerHomeScreen,
    icon: 'client',
  },
  {
    name: 'Profile',
    component: SellerProfileScreen,
    icon: 'user',
  },
] as const;

const SellerbottomTabs = memo(() => {
  const {navigateToPostProperty} = useAuth();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName={navigateToPostProperty ? 'AddProperty' : 'Home'}
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
              <GetIcon iconName={icon} color={focused ? Colors.main : color} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
});

export default SellerbottomTabs;
