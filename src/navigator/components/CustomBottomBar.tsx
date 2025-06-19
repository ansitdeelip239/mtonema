import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {CommonActions, ParamListBase} from '@react-navigation/native';
import {useKeyboard} from '../../hooks/useKeyboard';
import GetIcon, {IconEnum} from '../../components/GetIcon';
import {useTheme} from '../../context/ThemeProvider';
import {useBottomTab} from '../../context/BottomTabProvider';

export type TabScreen<T extends ParamListBase> = {
  name: keyof T;
  component: React.ComponentType<any>;
  icon: IconEnum;
  label?: string;
  listeners?: (props: {navigation: any}) => Partial<{
    tabPress: () => void;
  }>;
};

interface CustomBottomBarProps<T extends ParamListBase>
  extends BottomTabBarProps {
  tabScreens: Array<TabScreen<T>>;
}

export const CustomBottomBar = <T extends ParamListBase>({
  navigation,
  state,
  descriptors,
  tabScreens,
}: CustomBottomBarProps<T>) => {
  const middleIndex = Math.floor(tabScreens.length / 2);
  const {keyboardVisible} = useKeyboard();
  const {theme} = useTheme();
  const {isTabBarHidden} = useBottomTab();

  const shouldHideTabBar = isTabBarHidden || Object.values(descriptors).some(
    descriptor =>
      typeof descriptor.options.tabBarStyle === 'object' &&
      descriptor.options.tabBarStyle !== null &&
      'display' in descriptor.options.tabBarStyle &&
      descriptor.options.tabBarStyle.display === 'none',
  );

  if (keyboardVisible || shouldHideTabBar) {
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
                  color: state.index === index ? theme.primaryColor : '#666',
                  size: 24,
                })}
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabLabel,
                    state.index === index && styles.activeTabLabel,
                    state.index === index && {color: theme.primaryColor},
                  ]}>
                  {typeof descriptors[route.key].options.tabBarLabel ===
                  'function'
                    ? (descriptors[route.key].options.tabBarLabel as Function)({
                        focused: state.index === index,
                        color:
                          state.index === index ? theme.primaryColor : '#666',
                        position: 'below-icon',
                        children: route.name,
                      })
                    : descriptors[route.key].options.tabBarLabel ?? route.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          key={state.routes[middleIndex].key}
          style={[
            styles.centerTab,
            {backgroundColor: theme.primaryColor},
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
          <GetIcon
            iconName={tabScreens[middleIndex].icon}
            color={'#fff'}
          />
        </TouchableOpacity>

        <View style={styles.tabSection}>
          {state.routes.slice(middleIndex + 1).map((route, index) => (
            <TouchableOpacity
              key={route.key}
              style={[
                styles.tab,
                state.index === index + middleIndex + 1 && [styles.activeTab],
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
                      ? theme.primaryColor
                      : '#666',
                  size: 24,
                })}
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabLabel,
                    state.index === index + middleIndex + 1 &&
                      styles.activeTabLabel,
                    state.index === index + middleIndex + 1 && {
                      color: theme.primaryColor,
                    },
                  ]}>
                  {typeof descriptors[route.key].options.tabBarLabel ===
                  'function'
                    ? (descriptors[route.key].options.tabBarLabel as Function)({
                        focused: state.index === index + middleIndex + 1,
                        color:
                          state.index === index + middleIndex + 1
                            ? theme.primaryColor
                            : '#666',
                        position: 'below-icon',
                        children: route.name,
                      })
                    : descriptors[route.key].options.tabBarLabel ?? route.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  bottomBar: {
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 5,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#444',
    marginTop: 4,
    textAlign: 'center',
    width: 60,
    flexShrink: 1,
  },
  activeTabLabel: {
    fontWeight: 'bold',
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
  centerTab: {
    // width: 48,
    // height: 48,
    // borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    elevation: 5,
    height: 50,
    width: 50,
  },
  activeCenterTab: {
    transform: [{scale: 1.1}],
  },
});
