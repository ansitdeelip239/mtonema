import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerContent from '../components/CustomDrawerContent';
import Colors from '../constants/Colors';
import {PartnerDrawerParamList} from '../types/navigation';
import PartnerBottomTabs from './components/PartnerBottomTabs';
import GroupsScreen from '../screens/partner/GroupsScreen/GroupsScreen';
import GetIcon from '../components/GetIcon';
import PartnerProfileScreen from '../screens/partner/ProfileScreen/ProfileScreen';
import {useTheme} from '../context/ThemeProvider';

const Drawer = createDrawerNavigator<PartnerDrawerParamList>();

const PartnerNavigator = () => {
  // Get theme from context
  const {theme} = useTheme();

  // Update drawer styles to use theme
  const drawerStyles = {
    drawerType: 'front' as const,
    drawerActiveTintColor: 'white',
    drawerActiveBackgroundColor: theme.primaryColor, // ✓ Updated
    drawerStyle: {width: 240},
    headerStyle: {backgroundColor: theme.primaryColor}, // ✓ Updated
    headerTintColor: Colors.SECONDARY_3,
  };

  return (
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
            <GetIcon iconName="group" color={color} size="25" />
          ),
        }}
      />

      {/* <Drawer.Screen
        name="Feedback"
        component={FeedbackScreenStack}
        options={{
          headerShown: false,
          // eslint-disable-next-line react/no-unstable-nested-components
          drawerIcon: ({color}) => (
            <GetIcon iconName="feedback" color={color} size="25" />
          ),
        }}
      /> */}

      <Drawer.Screen
        name="Profile Screen"
        component={PartnerProfileScreen}
        options={{
          headerShown: false,
          drawerItemStyle: {display: 'none'},
        }}
      />
    </Drawer.Navigator>
  );
};

export default React.memo(PartnerNavigator);
