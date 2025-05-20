import React, {createContext, useState, useRef, useCallback} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Modal as RNModal,
  Dimensions,
} from 'react-native';
import { Text, Portal} from 'react-native-paper';
import Colors from '../constants/Colors';

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
        <RNModal
          transparent
          visible={visible}
          onRequestClose={hideDialog}
          animationType="fade">
          <TouchableWithoutFeedback onPress={hideDialog}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.dialogContainer}>
                  <View style={styles.dialog}>
                    <View style={styles.closeButtonContainer}>
                      <TouchableOpacity
                        onPress={hideDialog}
                        style={styles.closeButton}>
                        <Image
                          source={require('../assets/Icon/crossicon.png')}
                          style={styles.closeIcon}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.titleText}>Error</Text>
                    <View style={styles.contentContainer}>
                      <Text style={styles.contentText}>{errorMessage}</Text>
                    </View>
                    <View style={styles.actionContainer}>
                      <TouchableOpacity
                        style={styles.okButton}
                        onPress={hideDialog}>
                        <Text style={styles.okButtonText}>OK</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </RNModal>
      </Portal>
    </DialogContext.Provider>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: width * 0.85,
  },
  dialog: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButtonContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  closeButton: {
    padding: 10,
  },
  closeIcon: {
    width: 20,
    height: 20,
    tintColor: '#000000',
  },
  titleText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  contentContainer: {
    marginVertical: 20,
  },
  contentText: {
    color: '#000000',
    textAlign: 'center',
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  okButton: {
    backgroundColor: Colors.MT_PRIMARY_1,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  okButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DialogProvider;
