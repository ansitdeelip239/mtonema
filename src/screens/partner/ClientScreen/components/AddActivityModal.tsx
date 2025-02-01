import React, {useEffect} from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';
import Colors from '../../../../constants/Colors';
import FilterOption from '../../../../components/FilterOption';
import {useMaster} from '../../../../context/MasterProvider';
import {MaterialTextInput} from '../../../../components/MaterialTextInput';
import {Button} from 'react-native-paper';
import {ClientActivityDataModel} from '../../../../types';

interface AddActivityModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (type: number, description: string, activityId?: number) => void;
  isLoading: boolean;
  editMode?: boolean;
  activityToEdit?: ClientActivityDataModel;
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
}) => {
  const [formData, setFormData] = React.useState<ActivityFormData>({
    activityType: null,
    description: '',
  });
  const {masterData} = useMaster();

  useEffect(() => {
    if (editMode && activityToEdit) {
      setFormData({
        activityType: activityToEdit.ActivityType.ID,
        description: activityToEdit.Description,
      });
    }
  }, [editMode, activityToEdit]);

  const handleSubmit = () => {
    if (formData.activityType) {
      onSubmit(
        formData.activityType,
        formData.description,
        editMode ? activityToEdit?.Id : undefined,
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
      option => option.MasterDetailName === value,
    );

    setFormData(prev => ({
      ...prev,
      activityType:
        prev.activityType === selectedOption?.ID
          ? null
          : selectedOption?.ID ?? null,
    }));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {editMode ? 'Edit Activity' : 'Add Activity'}
          </Text>

          <FilterOption
            label="Select Activity Type"
            options={masterData?.ActivityType || []}
            selectedValue={
              masterData?.ActivityType.find(
                option => option.ID === formData.activityType,
              )?.MasterDetailName ?? null
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
            outlineColor={Colors.main}
            activeOutlineColor={Colors.main}
            theme={{
              colors: {
                primary: Colors.main,
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
              style={[styles.modalButton, styles.cancelButton]}
              labelStyle={styles.cancelButtonText}
              onPress={onClose}>
              Cancel
            </Button>

            <Button
              mode="contained"
              style={[styles.modalButton, styles.submitButton]}
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
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  cancelButton: {
    borderColor: Colors.main,
  },
  cancelButtonText: {
    color: Colors.main,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: Colors.main,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AddActivityModal;
