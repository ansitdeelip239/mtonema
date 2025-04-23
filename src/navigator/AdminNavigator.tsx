import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import ProfileScreen from '../screens/common/ProfileScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import Colors from '../constants/Colors';
import {AdminDrawerParamList} from '../types/navigation';
import GetIcon from '../components/GetIcon';
import PartnerAdminBottomTabs from './components/PartnerAdminBottomTabs';
import BuyerSellerAdminBottomTabs from './components/BSAdminBottomTabs';

const Drawer = createDrawerNavigator<AdminDrawerParamList>();

const drawerStyles = {
  drawerType: 'front' as const,
  drawerActiveTintColor: 'white',
  drawerActiveBackgroundColor: Colors.MT_PRIMARY_1,
  drawerStyle: {width: 240},
  headerStyle: {backgroundColor: Colors.MT_PRIMARY_1},
  headerTintColor: Colors.SECONDARY_3,
};

const AdminNavigator = memo(() => (
  <Drawer.Navigator
    // eslint-disable-next-line react/no-unstable-nested-components
    drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={drawerStyles}
    initialRouteName="Buyer/Seller">
    <Drawer.Screen
      name="Buyer/Seller"
      component={BuyerSellerAdminBottomTabs}
      options={{
        headerShown: false,
      }}
    />
    <Drawer.Screen
      name="Partner"
      component={PartnerAdminBottomTabs}
      options={{
        headerShown: false,
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
              navigation.navigate('Partner', {screen: 'Property'})
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
