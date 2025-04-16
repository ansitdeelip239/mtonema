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
import {Group2} from '../../../../types';

// Get screen width to calculate button size and spacing
const screenWidth = Dimensions.get('window').width;
const contentWidth = screenWidth * 0.8 - 40; // 80% of screen width minus padding
const itemsPerRow = 5;
const buttonSize = contentWidth / itemsPerRow - 10; // Account for margins

interface AddGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (groupName: string, colorId: number, groupId?: number) => void;
  onDelete?: (groupId: number) => void;
  styles: any;
  isLoading?: boolean;
  isDeleting?: boolean;
  group?: Group2 | null; // Optional group for edit mode
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
  onDelete,
  styles,
  isLoading = false,
  isDeleting = false,
  group,
}) => {
  const [groupName, setGroupName] = useState('');
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const {masterData} = useMaster();

  // Determine if we're in edit mode
  const isEditMode = !!group;

  // Update form when group data changes
  useEffect(() => {
    if (group) {
      setGroupName(group.groupName || '');
      setSelectedColorId(group.color?.id || null);
    } else {
      setGroupName('');
      setSelectedColorId(null);
    }
  }, [group, visible]);

  const handleSave = useCallback(() => {
    if (groupName.trim() && selectedColorId) {
      if (isEditMode && group) {
        onSave(groupName, selectedColorId, group.id);
      } else {
        onSave(groupName, selectedColorId);
      }
    }
  }, [groupName, selectedColorId, onSave, isEditMode, group]);

  const handleClose = useCallback(() => {
    setGroupName('');
    setSelectedColorId(null);
    setShowDeleteConfirmation(false);
    onClose();
  }, [onClose]);

  const selectColor = useCallback((id: number) => {
    setSelectedColorId(id);
  }, []);

  const handleDeleteRequest = useCallback(() => {
    setShowDeleteConfirmation(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (isEditMode && group && onDelete) {
      onDelete(group.id);
    }
    setShowDeleteConfirmation(false);
  }, [isEditMode, group, onDelete]);

  // Reset state when modal becomes invisible
  useEffect(() => {
    if (!visible) {
      setShowDeleteConfirmation(false);
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
          {/* Modal Header with conditional Delete Button */}
          <View style={modalStyles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEditMode ? 'Edit Group' : 'Add New Group'}
            </Text>
            {isEditMode && onDelete && (
              <TouchableOpacity
                onPress={handleDeleteRequest}
                disabled={isLoading || isDeleting}
                style={modalStyles.deleteIcon}>
                <GetIcon iconName="delete" size={20} color="#e74c3c" />
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Group Name"
            placeholderTextColor={'#999'}
            value={groupName}
            onChangeText={setGroupName}
            autoFocus={!isEditMode}
            editable={!isLoading && !isDeleting}
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
              disabled={isLoading || isDeleting}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.saveButton,
                (!groupName.trim() ||
                  !selectedColorId ||
                  isLoading ||
                  isDeleting) &&
                  modalStyles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={
                !groupName.trim() || !selectedColorId || isLoading || isDeleting
              }>
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Delete Confirmation */}
          {showDeleteConfirmation && (
            <View style={modalStyles.confirmationOverlay}>
              <View style={modalStyles.confirmationBox}>
                <Text style={modalStyles.confirmationTitle}>Delete Group</Text>
                <Text style={modalStyles.confirmationText}>
                  Are you sure you want to delete this group?
                </Text>
                <View style={modalStyles.confirmationButtons}>
                  <TouchableOpacity
                    style={modalStyles.confirmCancel}
                    onPress={() => setShowDeleteConfirmation(false)}
                    disabled={isDeleting}>
                    <Text style={modalStyles.confirmCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={modalStyles.confirmDelete}
                    onPress={handleConfirmDelete}
                    disabled={isDeleting}>
                    {isDeleting ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={modalStyles.confirmDeleteText}>Delete</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  deleteIcon: {
    padding: 8,
  },
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
  confirmationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '90%',
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#e74c3c',
  },
  confirmationText: {
    fontSize: 15,
    marginBottom: 20,
    color: '#333',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmCancel: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
  },
  confirmCancelText: {
    fontWeight: 'bold',
    color: '#666',
  },
  confirmDelete: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#e74c3c',
    alignItems: 'center',
  },
  confirmDeleteText: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default memo(AddGroupModal);
