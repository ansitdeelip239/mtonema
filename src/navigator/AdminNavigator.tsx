import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import ProfileScreen from '../screens/common/ProfileScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import Colors from '../constants/Colors';
import {AdminDrawerParamList} from '../types/navigation';
import PartnerBottomTabs from './components/PartnerBottomTabs';
import GetIcon from '../components/GetIcon';

const Drawer = createDrawerNavigator<AdminDrawerParamList>();

const drawerStyles = {
  drawerType: 'front' as const,
  drawerActiveTintColor: 'white',
  drawerActiveBackgroundColor: Colors.main,
  drawerStyle: {width: 240},
  headerStyle: {backgroundColor: Colors.main},
  headerTintColor: Colors.SECONDARY_3,
};

const AdminNavigator = memo(() => (
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
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Profile Screen"
      component={ProfileScreen}
      options={({navigation}) => ({
        drawerItemStyle: {display: 'none'},
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Home Screen', {screen: 'Property'})
            }
            style={styles.backButton}>
            <GetIcon iconName="back" size="24" color={Colors.SECONDARY_3} />
          </TouchableOpacity>
        ),
      })}
    />
  </Drawer.Navigator>
));

const styles = StyleSheet.create({
  backButton: {
    marginRight: 16,
  },
});

export default AdminNavigator;
