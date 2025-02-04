import React, {createContext, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Dialog, Portal, Text, Button} from 'react-native-paper';

type DialogContextType = {
  showError: (message: string) => void;
  hideDialog: () => void;
};

export const DialogContext = createContext<DialogContextType | undefined>(
  undefined,
);

export const DialogProvider = ({children}: {children: React.ReactNode}) => {
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const showError = (message: string) => {
    setErrorMessage(message);
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  return (
    <DialogContext.Provider value={{showError, hideDialog}}>
      {children}
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={[{backgroundColor: '#F5F5F5'}, styles.dialog]}>
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity onPress={hideDialog} style={styles.closeButton}>
              <Image
                source={require('../assets/Icon/crossicon.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
          <Dialog.Title style={{color: '#000000'}}>Error</Dialog.Title>
          <Dialog.Content>
            <Text style={{color: '#000000'}}>{errorMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button textColor="#000000" onPress={hideDialog}>
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </DialogContext.Provider>
  );
};

const styles = StyleSheet.create({
  dialog: {
    position: 'relative',
    // paddingTop: 20, // Make room for close button
  },
  closeButtonContainer: {
    position: 'absolute',
    right: 20,
    top: 0,
    zIndex: 1,
  },
  closeButton: {
    // padding: 8,
  },
  closeIcon: {
    width: 20,
    height: 20,
    tintColor: '#000000',
  },
});
