import React, {memo, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {CommonActions} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import GetIcon, {IconEnum} from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import {SellerBottomTabParamList} from '../../types/navigation';
import PropertyListScreen from '../../screens/seller/PropertyListScreen';
// import PostProperty from '../../screens/seller/PostPropertyScreen';
// import PropertyListingForm from '../../screens/seller/PostProperty';
import {Text} from 'react-native-paper';
import SellerProfileScreen from '../../screens/seller/SellerProfileScreen';
import PostPropertyForm from '../../screens/seller/PostProperty/PostPropertyForm';
import SellerHomeScreen from '../../screens/seller/SellerHomeScreen';
import {useAuth} from '../../hooks/useAuth';
import {useKeyboard} from '../../hooks/useKeyboard';
import PostProperty from '../../screens/seller/PostPropertyScreen';

const Tab = createBottomTabNavigator<SellerBottomTabParamList>();

const tabScreens: Array<{
  name: keyof SellerBottomTabParamList;
  component: React.FC<any>;
  icon: IconEnum;
}> = [
  {
    name: 'Home',
    component: PropertyListScreen,
    icon: 'home',
  },
  {
    name: 'Property',
    component: SellerHomeScreen,
    icon: 'realEstate',
  },
  {
    name: 'AddProperty',
    component: PostPropertyForm,
    icon: 'property',
  },
  {
    name: 'Clients',
    component: SellerHomeScreen,
    icon: 'client',
  },
  {
    name: 'Profile',
    component: SellerProfileScreen,
    icon: 'user',
  },
] as const;

const CustomBottomBar = memo(
  ({navigation, state, descriptors}: BottomTabBarProps) => {
    const middleIndex = Math.floor(tabScreens.length / 2);

    const {keyboardVisible} = useKeyboard();
    if (keyboardVisible) {
      return null;
    }
    return (
      <View style={styles.bottomBarContainer}>
        <View style={styles.bottomBar}>
          <View style={styles.tabSection}>
            {state.routes.slice(0, middleIndex).map((route, index) => (
              <TouchableOpacity
                key={route.key}
                style={[styles.tab, state.index === index && styles.activeTab]}
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
                <View style={styles.tabContent}>
                  {descriptors[route.key].options.tabBarIcon?.({
                    focused: state.index === index,
                    color: state.index === index ? Colors.main : '#666',
                    size: 24,
                  })}
                  {/* Add label below the icon */}
                  <Text
                    style={[
                      styles.tabLabel,
                      state.index === index && styles.activeTabLabel,
                    ]}>
                    {route.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            key={state.routes[middleIndex].key}
            style={[
              styles.centerTab,
              state.index === middleIndex && styles.activeCenterTab,
            ]}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: state.routes[middleIndex].key,
                canPreventDefault: true,
              });

              if (!event.defaultPrevented) {
                navigation.dispatch({
                  ...CommonActions.navigate(state.routes[middleIndex].name),
                  target: state.key,
                });
              }
            }}>
            <GetIcon iconName="property" color="#fff" size="38" />
          </TouchableOpacity>

          <View style={styles.tabSection}>
            {state.routes.slice(middleIndex + 1).map((route, index) => (
              <TouchableOpacity
                key={route.key}
                style={[
                  styles.tab,
                  state.index === index + middleIndex + 1 && [
                    styles.activeTab,
                    styles.activeTabColor,
                  ],
                ]}
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
                <View style={styles.tabContent}>
                  {descriptors[route.key].options.tabBarIcon?.({
                    focused: state.index === index + middleIndex + 1,
                    color:
                      state.index === index + middleIndex + 1
                        ? Colors.main
                        : '#666',
                    size: 24,
                  })}
                  {/* Add label below the icon */}
                  <Text
                    style={[
                      styles.tabLabel,
                      state.index === index + middleIndex + 1 &&
                        styles.activeTabLabel,
                    ]}>
                    {route.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  },
);

const SellerbottomTabs = memo(() => {
  const {navigateToPostProperty} = useAuth();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName={navigateToPostProperty ? 'AddProperty' : 'Home'}
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={props => <CustomBottomBar {...props} />}>
      {tabScreens.map(({name, component, icon}) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarLabel: name,
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({focused, color}) => (
              <GetIcon iconName={icon} color={focused ? Colors.main : color} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
});

const styles = StyleSheet.create({
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4, // Adjust spacing between icon and label
  },
  activeTabLabel: {
    color: Colors.main, // Highlight color for active tab label
    fontWeight: 'bold', // Optional: Make the active label bold
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
    padding: 8,
  },
  activeTab: {
    // borderRadius: 16,
    // margin: 2,
  },
  activeTabColor: {
    color: Colors.main + '20', // 20 is opacity
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTab: {
    backgroundColor: Colors.main,
    width: 55,
    height: 54,
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
  activeCenterTab: {
    backgroundColor: Colors.main,
    transform: [{scale: 1.1}],
  },
});

export default SellerbottomTabs;
