import React, {memo} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import ProfileScreen from '../screens/common/ProfileScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import Colors from '../constants/Colors';
import {PartnerDrawerParamList} from '../types/navigation';
import PartnerBottomTabs from './components/PartnerBottomTabs';

const Drawer = createDrawerNavigator<PartnerDrawerParamList>();

const drawerStyles = {
  drawerType: 'front' as const,
  drawerActiveTintColor: 'white',
  drawerActiveBackgroundColor: Colors.main,
  drawerStyle: {width: 240},
  headerStyle: {backgroundColor: Colors.main},
  headerTintColor: Colors.SECONDARY_3,
};

const PartnerNavigator = memo(() => (
  <Drawer.Navigator
    // eslint-disable-next-line react/no-unstable-nested-components
    drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={drawerStyles}
    initialRouteName="Home Screen">
    <Drawer.Screen
      name="Home Screen"
      component={PartnerBottomTabs}
      options={{
        headerShown: false,
      }}
    />
    <Drawer.Screen
      name="Profile Screen"
      component={ProfileScreen}
      options={{drawerItemStyle: {display: 'none'}}}
    />
  </Drawer.Navigator>
));

export default PartnerNavigator;
