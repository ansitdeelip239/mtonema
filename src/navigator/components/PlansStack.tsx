import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useTheme} from '../../context/ThemeProvider';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {PartnerDrawerParamList} from '../../types/navigation';
import GetIcon from '../../components/GetIcon';
import PlansScreen from '../../screens/partner/Plans/PlansScreen';
import AddPlanScreen from '../../screens/partner/Plans/AddPlanScreen';
import Colors from '../../constants/Colors';
import {Plan} from '../../types/payment';

export type PlansStackParamList = {
  'Plans Screen': undefined;
  'Add Plan Screen': {editMode?: boolean; planData?: Plan};
};

const Stack = createNativeStackNavigator<PlansStackParamList>();

const PlansStack = () => {
  const {theme} = useTheme();
  const isIOS = Platform.OS === 'ios';

  const drawerNavigation =
    useNavigation<DrawerNavigationProp<PartnerDrawerParamList>>();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: isIOS,
        headerStyle: {backgroundColor: theme.primaryColor},
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerBackVisible: true,
        headerBackTitle: 'Back',
        // eslint-disable-next-line react/no-unstable-nested-components
        headerLeft: () => {
          const hamburgerButtonStyle = {marginLeft: 16, padding: 4};
          return (
            <TouchableOpacity
              onPress={() => drawerNavigation.toggleDrawer()}
              style={hamburgerButtonStyle}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <GetIcon iconName="hamburgerMenu" color="#fff" size={18} />
            </TouchableOpacity>
          );
        },
      }}
      initialRouteName="Plans Screen">
      <Stack.Screen
        name="Plans Screen"
        component={PlansScreen}
        options={({navigation}) => ({
          title: 'Plans',
          headerBackVisible: false, // hide back button on root screen
          // eslint-disable-next-line react/no-unstable-nested-components
          headerRight: () => (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('Add Plan Screen', {editMode: false})}
              activeOpacity={0.8}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="Add Plan Screen"
        component={AddPlanScreen}
        options={{
          title: 'Add Plan',
          headerBackVisible: true, // show back button to go back to plans list
          headerLeft: undefined,
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 24,
  },
});

export default PlansStack;
