import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {memo} from 'react';
import CustomDrawerContent from '../components/CustomDrawerContent';
import GetIcon from '../components/GetIcon';
import {StatusBar} from 'react-native';
import SellerBottomTabs from './components/SellerBottomTabs';
import PartnerProfileScreen from '../screens/partner/ProfileScreen/ProfileScreen';
import {useDrawerStyles} from '../hooks/useDrawerStyles';
import {useTranslation} from 'react-i18next';
import DrawerToggleButton from '../components/DrawerToggleButton';
import HelpCenterScreen from '../screens/partner/HelpCenterScreen';

const Drawer = createDrawerNavigator();

const SellerNavigator = memo(() => {
  const {drawerStyles, isIOS} = useDrawerStyles();
  const {t} = useTranslation();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#fff" translucent={false} />
      <Drawer.Navigator
        // eslint-disable-next-line react/no-unstable-nested-components
        drawerContent={props => <CustomDrawerContent {...props} />}
        initialRouteName="Home"
        screenOptions={{
          ...drawerStyles,
        }}>
        <Drawer.Screen
          name="Home"
          component={SellerBottomTabs}
          options={{
            headerShown: false,
            // eslint-disable-next-line react/no-unstable-nested-components
            drawerIcon: ({color}) => (
              <GetIcon iconName="home" color={color} size="23" /> // Use GetIcon here
            ),
          }}
        />
        {/* <Drawer.Screen name="Listed Property" component={PropertyListScreen} /> */}
        {/* <Drawer.Screen name="Post Property" component={PostProperty} /> */}
        {/* <Drawer.Screen
          name="Contact Us"
          component={ContactScreen}
          options={{
            headerShown: false,
            // eslint-disable-next-line react/no-unstable-nested-components
            drawerIcon: ({color}) => (
              <GetIcon iconName="contactus" color={color} size="26" /> // Use GetIcon here
            ),
          }}
        /> */}

        <Drawer.Screen
          name="Profile Screen"
          component={PartnerProfileScreen}
          options={{
            headerShown: isIOS,
            drawerItemStyle: {display: 'none'},
          }}
        />
        <Drawer.Screen
          name="Help Center"
          component={HelpCenterScreen}
          options={{
            headerShown: isIOS,
            // eslint-disable-next-line react/no-unstable-nested-components
            headerLeft: () => <DrawerToggleButton />,
            title: t('navigation.drawer.helpCenter', 'Help Center'),
            drawerItemStyle: {display: 'none'},
          }}
        />
      </Drawer.Navigator>
    </>
  );
});

export default SellerNavigator;
