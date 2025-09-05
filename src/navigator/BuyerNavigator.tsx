import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {memo} from 'react';
import CustomDrawerContent from '../components/CustomDrawerContent';
import GetIcon from '../components/GetIcon';
import {StyleSheet} from 'react-native';
import BuyerBottomTabs from './components/BuyerBottomTabs';
import {SafeAreaView} from 'react-native-safe-area-context';
import PartnerProfileScreen from '../screens/partner/ProfileScreen/ProfileScreen';
import {useDrawerStyles} from '../hooks/useDrawerStyles';

const Drawer = createDrawerNavigator();

const BuyerNavigator = memo(() => {
  const {drawerStyles, isIOS} = useDrawerStyles();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Drawer.Navigator
        // eslint-disable-next-line react/no-unstable-nested-components
        drawerContent={props => <CustomDrawerContent {...props} />}
        initialRouteName="Home"
        screenOptions={{
          ...drawerStyles,
          headerShown: true,
        }}>
        <Drawer.Screen
          name="Home"
          component={BuyerBottomTabs}
          options={{
            headerShown: false,
            // eslint-disable-next-line react/no-unstable-nested-components
            drawerIcon: ({color}) => (
              <GetIcon iconName="home" color={color} size="23" /> // Use GetIcon here
            ),
          }}
        />
        <Drawer.Screen
          name="Profile Screen"
          component={PartnerProfileScreen}
          options={{
            headerShown: isIOS,
            drawerItemStyle: {display: 'none'},
          }}
        />
      </Drawer.Navigator>
    </SafeAreaView>
  );
});
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default BuyerNavigator;
