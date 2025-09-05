import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeProvider';
import AddAgentPropertyScreen from '../../screens/partner/AgentsPropertyScreen/AddAgentPropertyScreen';
import AgentDataScreen from '../../screens/partner/AgentsPropertyScreen/AgentsPropertyScreen';
import { AgentData } from '../../types';
import { PartnerDrawerParamList } from '../../types/navigation';
import GetIcon from '../../components/GetIcon';
import { useDrawer } from '../../hooks/useDrawer';

// Define the param list type for this stack
export type AgentDataStackParamList = {
  AgentDataScreen: undefined;
  AddAgentDataScreen: { editMode: boolean; propertyData: AgentData };
};

const Stack = createNativeStackNavigator<AgentDataStackParamList>();

// Define components outside of render to avoid unstable nested components warning
const DrawerToggleButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ marginLeft: 16, padding: 4 }}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <GetIcon iconName="hamburgerMenu" color="#fff" size={18} />
  </TouchableOpacity>
);

const AddButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ marginRight: 10 }}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add</Text>
  </TouchableOpacity>
);

const AgentDataScreenStack = () => {
  const { theme } = useTheme();
  const isIOS = Platform.OS === 'ios';

  const { openDrawer } = useDrawer<PartnerDrawerParamList>();

  return (
    <Stack.Navigator
      initialRouteName="AgentDataScreen"
      screenOptions={{
        headerShown: isIOS,
        headerStyle: { backgroundColor: theme.primaryColor },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerBackVisible: true,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="AgentDataScreen"
        component={AgentDataScreen}
        options={({ navigation }) => ({
          headerBackVisible: false, // hide back button on the root screen
          title: 'Agent Data',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => (
            <DrawerToggleButton onPress={openDrawer} />
          ),
          // eslint-disable-next-line react/no-unstable-nested-components
          headerRight: () => (
            <AddButton
              onPress={() =>
                navigation.navigate({
                  name: 'AddAgentDataScreen',
                  params: { editMode: false, propertyData: {} as AgentData },
                })
              }
            />
          ),
        })}
      />
      <Stack.Screen
        name="AddAgentDataScreen"
        component={AddAgentPropertyScreen}
        options={{
          title: 'Add Agent Property',
        }}
      />
    </Stack.Navigator>
  );
};

export default AgentDataScreenStack;
