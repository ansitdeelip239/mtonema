import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, TouchableOpacity } from 'react-native';
import ContentScreen from '../../screens/partner/ContentScreen/ContentScreen';
import AddContentScreen from '../../screens/partner/ContentScreen/AddContentScreen';
import { ContentTemplate } from '../../types';
import { useTheme } from '../../context/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { PartnerDrawerParamList } from '../../types/navigation';
import GetIcon from '../../components/GetIcon';

export type ContentTemplateStackParamList = {
  ContentTemplateScreen: undefined;
  AddContentTempleteScreen: {
    editMode?: boolean;
    templateData?: ContentTemplate;
  };
};

const Stack = createNativeStackNavigator<ContentTemplateStackParamList>();

const ContentTemplateScreenStack = () => {
  const { theme } = useTheme();
  const isIOS = Platform.OS === 'ios';
  const drawerNavigation =
    useNavigation<DrawerNavigationProp<PartnerDrawerParamList>>();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: isIOS,
        headerStyle: { backgroundColor: theme.primaryColor },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerBackVisible: true,
        headerBackTitle: 'Back',
      }}
      initialRouteName="ContentTemplateScreen"
    >
      <Stack.Screen
        name="ContentTemplateScreen"
        component={ContentScreen}
        options={{
          title: 'Content',
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => drawerNavigation.toggleDrawer()}
              style={{ marginLeft: 16, padding: 4 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <GetIcon iconName="hamburgerMenu" color="#fff" size={18} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="AddContentTempleteScreen"
        component={AddContentScreen}
        options={{
          title: 'Add Content',
          headerLeft: undefined, // only back button is shown, no drawer icon
        }}
      />
    </Stack.Navigator>
  );
};

export default ContentTemplateScreenStack;

