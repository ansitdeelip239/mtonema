import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TeamMember} from '../../types';
import {useTheme} from '../../context/ThemeProvider';
import TeamsScreen from '../../screens/partner/TeamsScreen/TeamsScreen';
import AddTeamScreen from '../../screens/partner/TeamsScreen/AddTeamScreen/AddTeamScreen';

export type TeamStackParamList = {
  'Teams Screen': undefined;
  'Add Teams Screen': {
    editMode?: boolean;
    teamData?: TeamMember;
  } | undefined;
};

const Stack = createNativeStackNavigator<TeamStackParamList>();

const TeamStack = () => {
  const {theme} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {backgroundColor: theme.primaryColor},
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerBackVisible: true,
        headerBackTitle: 'Back',
      }}
      initialRouteName="Teams Screen">
      <Stack.Screen
        name="Teams Screen"
        component={TeamsScreen}
        options={{
          title: 'Content',
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="Add Teams Screen"
        component={AddTeamScreen}
        options={{
          title: 'Add Content',
          headerLeft: undefined, // only back button is shown, no drawer icon
        }}
      />
    </Stack.Navigator>
  );
};

export default TeamStack;
