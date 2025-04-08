import React, {useState, useCallback, memo, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
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
  styles: any;
  isLoading?: boolean;
}

const ColorButton = memo(
  ({
    color,
    isSelected,
    onPress,
  }: {
    color: any;
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      key={color.id}
      style={[
        modalStyles.colorButton,
        {backgroundColor: color.masterDetailName},
        isSelected && modalStyles.selectedColorButton,
      ]}
      onPress={onPress}>
      {isSelected && (
        <View style={modalStyles.checkmarkContainer}>
          <GetIcon iconName="checkmark" size={14} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  ),
);

const AddGroupModal: React.FC<AddGroupModalProps> = ({
  visible,
  onClose,
  onSave,
  styles,
}) => {
  const [groupName, setGroupName] = useState('');
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const {masterData} = useMaster();

  const handleSave = useCallback(() => {
    if (groupName.trim() && selectedColorId) {
      setSaving(true);
      onSave(groupName, selectedColorId);
      // Don't reset states here as they will be reset on successful save or modal close
    }
  }, [groupName, selectedColorId, onSave]);

  const handleClose = useCallback(() => {
    setGroupName('');
    setSelectedColorId(null);
    setSaving(false);
    onClose();
  }, [onClose]);

  const selectColor = useCallback((id: number) => {
    setSelectedColorId(id);
  }, []);

  // Reset saving state when modal becomes invisible
  useEffect(() => {
    if (!visible) {
      setSaving(false);
      setGroupName('');
      setSelectedColorId(null);
    }
  }, [visible]);

  const colors = masterData?.GroupColor || [];

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
            placeholderTextColor={'#999'}
            value={groupName}
            onChangeText={setGroupName}
            autoFocus={true}
            editable={!saving}
          />

          <Text style={modalStyles.colorSectionTitle}>Select Color</Text>

          <ScrollView style={modalStyles.colorContainer}>
            <View style={modalStyles.colorGrid}>
              {colors.length > 0 ? (
                colors.map((color: any) => (
                  <ColorButton
                    key={color.id}
                    color={color}
                    isSelected={selectedColorId === color.id}
                    onPress={() => selectColor(color.id)}
                  />
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
              onPress={handleClose}
              disabled={saving}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.saveButton,
                (!groupName.trim() || !selectedColorId || saving) &&
                  modalStyles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={!groupName.trim() || !selectedColorId || saving}>
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Save</Text>
              )}
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
    maxHeight: 180,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Evenly distribute items
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  colorButton: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: 6,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  selectedColorButton: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  checkmarkContainer: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noColorsText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666',
    padding: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default memo(AddGroupModal);
