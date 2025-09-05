import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {memo} from 'react';
import Colors from '../constants/Colors';
import CustomDrawerContent from '../components/CustomDrawerContent';
import ProfileScreen from '../screens/common/ProfileScreen';
import GetIcon from '../components/GetIcon';
import { StyleSheet, TouchableOpacity } from 'react-native';
import BuyerBottomTabs from './components/BuyerBottomTabs';
import {SafeAreaView} from 'react-native-safe-area-context';

const Drawer = createDrawerNavigator();

const BuyerNavigator = memo(() => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Drawer.Navigator
        // eslint-disable-next-line react/no-unstable-nested-components
        drawerContent={props => <CustomDrawerContent {...props} />}
        initialRouteName="Home"
        screenOptions={{
          drawerType: 'back',
          drawerActiveTintColor: 'white',
          drawerActiveBackgroundColor: Colors.MT_PRIMARY_1,
          headerShown: true,
          drawerStyle: {
            width: 240,
          },
          headerStyle: {
            backgroundColor: Colors.MT_PRIMARY_1,
          },
          headerTintColor: Colors.SECONDARY_3,
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
          component={ProfileScreen}
          options={({navigation}) => ({
            drawerItemStyle: {display: 'none'},
            // eslint-disable-next-line react/no-unstable-nested-components
            headerRight: () => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Home', {screen: 'Home'})
                }
                style={styles.backButton}>
                <GetIcon iconName="back" size="24" color={Colors.SECONDARY_3} />
              </TouchableOpacity>
            ),
          })}
        />
      </Drawer.Navigator>
    </SafeAreaView>
  );
});
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backButton: {
    marginRight: 16,
  },
});

export default BuyerNavigator;
