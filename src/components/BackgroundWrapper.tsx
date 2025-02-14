import React from 'react';
import {ImageBackground, StyleSheet} from 'react-native';
import Images from '../constants/Images';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

export const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({
  children,
}) => {
  return (
    <ImageBackground
      source={Images.BACKGROUND_IMAGE}
      style={styles.backgroundImage}
      resizeMode="cover">
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
