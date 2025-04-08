import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useMaster} from '../../../../context/MasterProvider';
import GetIcon from '../../../../components/GetIcon';

// Get screen width to calculate button size and spacing
const screenWidth = Dimensions.get('window').width;
const contentWidth = screenWidth * 0.8 - 40; // 80% of screen width minus padding
const itemsPerRow = 5;
const buttonSize = contentWidth / itemsPerRow - 10; // Account for margins

interface AddGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (groupName: string, colorId: number) => void;
  styles: any; // You can define a more specific type if needed
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({
  visible,
  onClose,
  onSave,
  styles,
}) => {
  const [groupName, setGroupName] = useState('');
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const {masterData} = useMaster();

  const handleSave = () => {
    onSave(groupName, selectedColorId as number);
    setGroupName('');
    setSelectedColorId(null);
  };

  const handleClose = () => {
    setGroupName('');
    setSelectedColorId(null);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Group</Text>

          <TextInput
            style={styles.input}
            placeholder="Group Name"
            value={groupName}
            onChangeText={setGroupName}
          />

          <Text style={modalStyles.colorSectionTitle}>Select Color</Text>

          <ScrollView horizontal={false} style={modalStyles.colorContainer}>
            <View style={modalStyles.colorGrid}>
              {masterData?.GroupColor && masterData.GroupColor.length > 0 ? (
                masterData.GroupColor.map((color: any) => (
                  <TouchableOpacity
                    key={color.id}
                    style={[
                      modalStyles.colorButton,
                      {backgroundColor: color.masterDetailName},
                      selectedColorId === color.id && modalStyles.selectedColorButton,
                    ]}
                    onPress={() => setSelectedColorId(color.id)}>
                    {selectedColorId === color.id && (
                      <View style={modalStyles.checkmarkContainer}>
                        <GetIcon iconName="checkmark" size={16} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={modalStyles.noColorsText}>
                  No colors available
                </Text>
              )}
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSave}
              disabled={!groupName.trim()}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  colorSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    color: '#333',
  },
  colorContainer: {
    maxHeight: 180, // Increased height for larger buttons
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Changed to space-between for better alignment
    marginBottom: 16,
  },
  colorButton: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: 8, // Slightly more rounded corners
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    elevation: 2, // Add a subtle shadow on Android
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  selectedColorButton: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    // Add a shadow/glow effect around selected button
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  checkmarkContainer: {
    // backgroundColor: 'rgba(0,0,0,0.3)',
    // borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
  noColorsText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666',
    padding: 10,
  },
});

export default AddGroupModal;
