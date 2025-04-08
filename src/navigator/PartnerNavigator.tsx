import React, {memo} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerContent from '../components/CustomDrawerContent';
import Colors from '../constants/Colors';
import {PartnerDrawerParamList} from '../types/navigation';
import PartnerBottomTabs from './components/PartnerBottomTabs';
import GroupsScreen from '../screens/partner/GroupsScreen/GroupsScreen';
import GetIcon from '../components/GetIcon';

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
    screenOptions={{
      ...drawerStyles,
      drawerLabelStyle: {textAlign: 'center', width: '70%'},
    }}
    initialRouteName="Home">
    <Drawer.Screen
      name="Home"
      component={PartnerBottomTabs}
      options={{
        headerShown: false,
        // drawerItemStyle: {display: 'none'},
        // eslint-disable-next-line react/no-unstable-nested-components
        drawerIcon: ({color}) => (
          <GetIcon iconName="home" color={color} size="25" />
        ),
      }}
    />

    <Drawer.Screen
      name="Groups"
      component={GroupsScreen}
      options={{
        headerShown: false,
        // eslint-disable-next-line react/no-unstable-nested-components
        drawerIcon: ({color}) => (
          <GetIcon iconName="globe" color={color} size="25" />
        ),
      }}
    />
  </Drawer.Navigator>
));

export default PartnerNavigator;
