import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import GetIcon from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import {SellerBottomTabParamList} from '../../types/navigation';
import PropertyListScreen from '../../screens/seller/PropertyListScreen';
// import PostProperty from '../../screens/seller/PostPropertyScreen';
// import PropertyListingForm from '../../screens/seller/PostProperty';
import SellerProfileScreen from '../../screens/seller/SellerProfileScreen';
import {CustomBottomBar, TabScreen} from './CustomBottomBar';
import SellerDashboard from '../../screens/seller/SellerDashboard';
import SellerContactScreen from '../../screens/seller/SellerContactScreen';
import PostPropertyScreen from '../../screens/seller/PostPropertyScreen';
import { useAuth } from '../../context/AuthProvider';

const Tab = createBottomTabNavigator<SellerBottomTabParamList>();

const tabScreens: Array<TabScreen<SellerBottomTabParamList>> = [
  {
    name: 'Dashboard',
    component: SellerDashboard,
    icon: 'home',
  },
  {
    name: 'Property',
    component: PropertyListScreen,
    icon: 'realEstate',
  },
  {
    name: 'AddProperty',
    component: PostPropertyScreen,
    icon: 'listproperty',
  },
  {
    name: 'Contact',
    component: SellerContactScreen,
    icon: 'client',
  },
  {
    name: 'Profile',
    component: SellerProfileScreen,
    icon: 'user',
  },
] as const;

const SellerBottomTabs = memo(() => {
  const {navigateToPostProperty} = useAuth();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName={navigateToPostProperty ? 'AddProperty' : 'Dashboard'}
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

export default SellerBottomTabs;
