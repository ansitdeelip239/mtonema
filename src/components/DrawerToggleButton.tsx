import {TouchableOpacity} from 'react-native';
import GetIcon from './GetIcon';
import { useDrawer } from '../hooks/useDrawer';
import { ParamListBase } from '@react-navigation/native';

const DrawerToggleButton = <T extends ParamListBase>() => {
  const {openDrawer} = useDrawer<T>();
  return (
    <TouchableOpacity
      onPress={openDrawer}
      style={{marginLeft: 16, padding: 4}}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
      <GetIcon iconName="hamburgerMenu" color="#fff" size={18} />
    </TouchableOpacity>
  );
};

export default DrawerToggleButton;
