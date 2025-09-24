import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Platform} from 'react-native';
import GetIcon from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import {SellerBottomTabParamList} from '../../types/navigation';
import PropertyStack from './PropertyStack';
// import PostProperty from '../../screens/seller/PostPropertyScreen';
// import PropertyListingForm from '../../screens/seller/PostProperty';
import {CustomBottomBar, TabScreen} from './CustomBottomBar';
import SellerDashboard from '../../screens/seller/SellerDashboard';
import SellerContactScreen from '../../screens/seller/SellerContactScreen';
import PostPropertyScreen from '../../screens/seller/PostPropertyScreen';
import { useAuth } from '../../context/AuthProvider';
import SellerProfileStack from './SellerProfileStack';
import DrawerToggleButton from '../../components/DrawerToggleButton';
import {useTranslation} from 'react-i18next';

const Tab = createBottomTabNavigator<SellerBottomTabParamList>();

const SellerBottomTabs = memo(() => {
  const {navigateToPostProperty} = useAuth();
  const {t} = useTranslation();

  const tabScreens: Array<TabScreen<SellerBottomTabParamList>> = [
    {
      name: 'Dashboard',
      component: SellerDashboard,
      icon: 'home',
    },
    {
      name: 'Property',
      component: PropertyStack,
      icon: 'realEstate',
    },
    {
      name: 'Add Property',
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
      component: SellerProfileStack,
      icon: 'user',
    },
  ];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName={navigateToPostProperty ? 'Add Property' : 'Dashboard'}
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={props => <CustomBottomBar {...props} tabScreens={tabScreens} />}>
      {tabScreens.map(({name, component, icon}) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarLabel: t(`navigation.bottomTab.seller${name}`),
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({focused, color}) => (
              <GetIcon iconName={icon} color={focused ? Colors.MT_PRIMARY_1 : color} />
            ),
            ...(name === 'Add Property' && Platform.OS === 'ios' ? {
              headerShown: true,
              headerTintColor: '#000',
              // eslint-disable-next-line react/no-unstable-nested-components
              headerLeft: () => <DrawerToggleButton color='#000' />,
            } : {}),
          }}
        />
      ))}
    </Tab.Navigator>
  );
});

export default SellerBottomTabs;
