import React, {memo} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CommonActions} from '@react-navigation/native';
import {NavigatorScreenParams} from '@react-navigation/native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';

// Screens
import ProfileScreen from '../screens/common/ProfileScreen';
import HomeScreen from '../screens/partner/HomeScreen/HomeScreen';
import ClientScreen from '../screens/partner/ClientScreen/ClientScreen';
import AgentDataScreen from '../screens/partner/AgentsPropertyScreen/AgentsPropertyScreen';
import AddAgentPropertyScreen from '../screens/partner/AddAgentPropertyScreen/AddAgentPropertyScreen';

// Components
import CustomDrawerContent from '../components/CustomDrawerContent';
import GetIcon from '../components/GetIcon';

// Constants
import Colors from '../constants/Colors';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

// Types
export type AgentStackParamList = {
  AgentPropertyList: undefined;
  AddAgentProperty: undefined;
};

type BottomTabParamList = {
  Home: undefined;
  Property: NavigatorScreenParams<AgentStackParamList>;
  Clients: undefined;
  Test: undefined;
};

type DrawerParamList = {
  'Home Screen': NavigatorScreenParams<BottomTabParamList>;
  'Profile Screen': undefined;
};

// Navigator instances
const Drawer = createDrawerNavigator<DrawerParamList>();
const Stack = createNativeStackNavigator<AgentStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

// Styles
const drawerStyles = {
  drawerType: 'front' as const,
  drawerActiveTintColor: 'white',
  drawerActiveBackgroundColor: Colors.main,
  drawerStyle: {width: 240},
  headerStyle: {backgroundColor: Colors.main},
  headerTintColor: Colors.SECONDARY_3,
};

// Components
const AgentPropertyStack = memo(() => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="AgentPropertyList" component={AgentDataScreen} />
    <Stack.Screen name="AddAgentProperty" component={AddAgentPropertyScreen} />
  </Stack.Navigator>
));

const CustomBottomBar = memo(
  ({navigation, state, descriptors}: BottomTabBarProps) => {
    const handleAddPress = () => {
      navigation.navigate('Property', {
        screen: 'AddAgentProperty',
      });
    };

    return (
      <View style={styles.bottomBarContainer}>
        <View style={styles.bottomBar}>
          {/* First half of tabs */}
          <View style={styles.tabSection}>
            {state.routes.slice(0, 2).map((route, index) => (
              <TouchableOpacity
                key={route.key}
                style={styles.tab}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!event.defaultPrevented) {
                    navigation.dispatch({
                      ...CommonActions.navigate(route.name, route.params),
                      target: state.key,
                    });
                  }
                }}>
                {descriptors[route.key].options.tabBarIcon?.({
                  focused: state.index === index,
                  color: state.index === index ? Colors.main : '#666',
                  size: 24,
                })}
              </TouchableOpacity>
            ))}
          </View>

          {/* Center FAB */}
          <View style={styles.fabContainer}>
            <TouchableOpacity
              style={styles.fabButton}
              onPress={handleAddPress}
              activeOpacity={0.8}>
              {/* {GetIcon('property')} */}
              <GetIcon iconName="property" color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Second half of tabs */}
          <View style={styles.tabSection}>
            {state.routes.slice(2).map((route, index) => (
              <TouchableOpacity
                key={route.key}
                style={styles.tab}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!event.defaultPrevented) {
                    navigation.dispatch({
                      ...CommonActions.navigate(route.name, route.params),
                      target: state.key,
                    });
                  }
                }}>
                {descriptors[route.key].options.tabBarIcon?.({
                  focused: state.index === index + 2,
                  color: state.index === index + 2 ? Colors.main : '#666',
                  size: 24,
                })}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  },
);

const BottomTabs = memo(() => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarHideOnKeyboard: true,
    }}
    tabBar={props => <CustomBottomBar {...props} />}>
    {tabScreens.map(({name, component, icon}) => (
      <Tab.Screen
        key={name}
        name={name}
        component={component}
        options={{
          tabBarLabel: name,
          tabBarIcon: () => <GetIcon iconName={icon} color='#000'/>,
        }}
      />
    ))}
  </Tab.Navigator>
));

const PartnerNavigator = memo(() => (
  <Drawer.Navigator
    // eslint-disable-next-line react/no-unstable-nested-components
    drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={drawerStyles}
    initialRouteName="Home Screen">
    <Drawer.Screen
      name="Home Screen"
      component={BottomTabs}
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

// Tab configuration
const tabScreens = [
  {
    name: 'Home',
    component: HomeScreen,
    icon: 'edit',
  },
  {
    name: 'Property',
    component: AgentPropertyStack,
    icon: 'delete',
  },
  {
    name: 'Clients',
    component: ClientScreen,
    icon: 'delete',
  },
  {
    name: 'Test',
    component: ClientScreen,
    icon: 'delete',
  },
] as const;

const styles = StyleSheet.create({
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  bottomBar: {
    backgroundColor: 'white',
    borderRadius: 24,
    elevation: 15,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tabSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabContainer: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabButton: {
    backgroundColor: Colors.main,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default PartnerNavigator;
