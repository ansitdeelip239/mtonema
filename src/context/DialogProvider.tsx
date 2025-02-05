import React, {createContext, useState, useRef, useCallback} from 'react';
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
  const lastDismissTime = useRef(0);
  const isDismissing = useRef(false);

  const showError = (message: string) => {
    setErrorMessage(message);
    setVisible(true);
  };

  const hideDialog = useCallback(() => {
    const now = Date.now();
    if (isDismissing.current) {
      return;
    }

    if (now - lastDismissTime.current > 500) {
      isDismissing.current = true;
      lastDismissTime.current = now;
      setVisible(false);
      // Reset dismissing flag after animation completes
      setTimeout(() => {
        isDismissing.current = false;
      }, 300);
    }
  }, []);

  return (
    <DialogContext.Provider value={{showError, hideDialog}}>
      {children}
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={styles.dialog}
          dismissable={false}>
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity onPress={hideDialog} style={styles.closeButton}>
              <Image
                source={require('../assets/Icon/crossicon.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
          <Dialog.Title style={styles.titleText}>Error</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.contentText}>{errorMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button textColor="#000000" onPress={hideDialog}>
              OK
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
    backgroundColor: '#F5F5F5',
  },
  titleText: {
    color: '#000000',
  },
  contentText: {
    color: '#000000',
  },
  closeButtonContainer: {
    position: 'absolute',
    right: 20,
    top: 0,
    zIndex: 1,
  },
  closeButton: {},
  closeIcon: {
    width: 20,
    height: 20,
    tintColor: '#000000',
  },
});
