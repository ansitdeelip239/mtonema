import {useNavigation, DrawerActions} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import { ParamListBase } from '@react-navigation/native';

export const useDrawer = <T extends ParamListBase>() => {
  const navigation = useNavigation<DrawerNavigationProp<T>>();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return {openDrawer};
};
