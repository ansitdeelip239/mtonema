import React, {useEffect, useState} from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../../../../constants/Colors';
import FilterOption from '../../../../components/FilterOption';
import {useMaster} from '../../../../context/MasterProvider';
import {MaterialTextInput} from '../../../../components/MaterialTextInput';
import {Button} from 'react-native-paper';
import {ClientActivityDataModel} from '../../../../types';
import GetIcon from '../../../../components/GetIcon';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import { useTheme } from '../../../../context/ThemeProvider';

interface AddActivityModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (type: number, description: string, activityId?: number) => void;
  isLoading: boolean;
  editMode?: boolean;
  activityToEdit?: ClientActivityDataModel;
  onDelete?: (activityId: number) => void;
  closeMenu?: () => void;
  isDeletingActivity?: boolean;
  initialActivityType?: number | null; // Add this prop
}

interface ActivityFormData {
  activityType: number | null;
  description: string;
}

const AddActivityModal: React.FC<AddActivityModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isLoading,
  editMode = false,
  activityToEdit,
  onDelete,
  closeMenu,
  isDeletingActivity = false,
  initialActivityType = null, // Default to null
}) => {
  const [formData, setFormData] = React.useState<ActivityFormData>({
    activityType: null,
    description: '',
  });
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const {masterData} = useMaster();
  const {theme} = useTheme();

  useEffect(() => {
    if (!visible) {
      setFormData({
        activityType: null,
        description: '',
      });
    } else if (editMode && activityToEdit) {
      setFormData({
        activityType: activityToEdit.activityType.id,
        description: activityToEdit.description,
      });
    } else if (initialActivityType) {
      // Use the initialActivityType if provided
      setFormData(prev => ({
        ...prev,
        activityType: initialActivityType,
      }));
    }
  }, [visible, editMode, activityToEdit, initialActivityType]);

  const handleSubmit = () => {
    if (formData.activityType) {
      onSubmit(
        formData.activityType,
        formData.description,
        editMode ? activityToEdit?.id : undefined,
      );
      setFormData({activityType: null, description: ''});
    }
  };

  const handleFormChange = (
    field: keyof ActivityFormData,
    value: string | boolean,
  ) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleActivityTypeSelect = (value: string) => {
    const selectedOption = masterData?.ActivityType.find(
      option => option.masterDetailName === value,
    );

    setFormData(prev => ({
      ...prev,
      activityType:
        prev.activityType === selectedOption?.id
          ? null
          : selectedOption?.id ?? null,
    }));
  };

  const handleDelete = () => {
    closeMenu && closeMenu();
    if (editMode && activityToEdit?.id && onDelete) {
      setIsDeleteModalVisible(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (editMode && activityToEdit?.id && onDelete) {
      await onDelete(activityToEdit.id);
      setIsDeleteModalVisible(false);
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editMode ? 'Edit Activity' : 'Add Activity'}
              </Text>
              {editMode && (
                <TouchableOpacity
                  onPress={handleDelete}
                  style={styles.deleteButton}>
                  <GetIcon iconName="delete" size="24" color={Colors.red} />
                </TouchableOpacity>
              )}
            </View>

            <FilterOption
              label="Select Activity Type"
              options={masterData?.ActivityType || []}
              selectedValue={
                masterData?.ActivityType.find(
                  option => option.id === formData.activityType,
                )?.masterDetailName ?? null
              }
              onSelect={handleActivityTypeSelect}
            />

            <MaterialTextInput
              label="Description"
              field="description"
              formInput={formData}
              setFormInput={handleFormChange}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
              outlineColor={theme.primaryColor}
              activeOutlineColor={theme.primaryColor}
              theme={{
                colors: {
                  primary: theme.primaryColor,
                  background: 'white',
                  placeholder: '#666',
                  text: '#000',
                  onSurfaceVariant: '#666',
                  onSurface: '#000',
                },
              }}
              textColor="#000"
            />

            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                style={[styles.modalButton, {borderColor: theme.primaryColor}]}
                labelStyle={[styles.cancelButtonText, {color: theme.primaryColor}]}
                onPress={onClose}>
                Cancel
              </Button>

              <Button
                mode="contained"
                style={[styles.modalButton, {backgroundColor: theme.primaryColor}]}
                labelStyle={styles.buttonText}
                onPress={handleSubmit}
                loading={isLoading}
                disabled={isLoading}>
                Submit
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <ConfirmationModal
        visible={isDeleteModalVisible}
        title="Delete Activity"
        message="Are you sure you want to delete this activity?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        isLoading={isDeletingActivity}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    // marginBottom: 20,
    // textAlign: 'center',
    color: '#000',
  },
  input: {
    backgroundColor: 'white',
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  deleteButton: {
    // padding: 8,
  },
});

export default AddActivityModal;
