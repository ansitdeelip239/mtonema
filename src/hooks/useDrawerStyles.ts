import {useTheme} from '../context/ThemeProvider';
import {Platform} from 'react-native';
import Colors from '../constants/Colors';
import { DrawerNavigationOptions } from '@react-navigation/drawer';

export const useDrawerStyles = () => {
  const {theme} = useTheme();
  const isIOS = Platform.OS === 'ios';

  const drawerStyles: DrawerNavigationOptions = {
    drawerType: 'back' as const,
    drawerActiveTintColor: 'white',
    drawerInactiveTintColor: theme.textColor || 'black',
    drawerActiveBackgroundColor: theme.primaryColor,
    drawerStyle: {
      width: 280,
      backgroundColor: theme.backgroundColor || '#f5f5f5',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    headerStyle: {
      backgroundColor: theme.primaryColor,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    headerTintColor: Colors.SECONDARY_3,
    drawerItemStyle: {
      borderRadius: 10,
      marginVertical: 2,
      marginHorizontal: 10,
    },
  };

  return {
    drawerStyles,
    isIOS,
  };
};
