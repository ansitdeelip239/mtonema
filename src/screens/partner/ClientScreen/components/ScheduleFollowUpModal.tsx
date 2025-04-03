import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import GetIcon, {IconEnum} from '../../../../components/GetIcon';
import Colors from '../../../../constants/Colors';
import {format} from 'date-fns';
import ConfirmationModal from '../../../../components/ConfirmationModal';

interface ScheduleFollowUpModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (date: Date | null) => void;
  onDelete?: () => void;
  currentDate: Date | null;
  isLoading: boolean;
  isSomedayFollowUp?: boolean; // Add this prop
}

const ScheduleFollowUpModal: React.FC<ScheduleFollowUpModalProps> = ({
  visible,
  onClose,
  onSubmit,
  onDelete,
  currentDate,
  isLoading,
  isSomedayFollowUp = false, // Default to false
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customDate, setCustomDate] = useState<Date>(new Date());
  const [customTime, setCustomTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [finalDate, setFinalDate] = useState<Date | null>(currentDate);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    if (visible) {
      if (currentDate) {
        // Regular date-based follow-up
        setSelectedOption('custom');
        setCustomDate(currentDate);
        setCustomTime(currentDate);
        setFinalDate(currentDate);
      } else if (isSomedayFollowUp) {
        // "Someday" follow-up
        setSelectedOption('someday');
        setFinalDate(null);
      } else {
        // No follow-up scheduled
        setSelectedOption(null);
        setFinalDate(null);
      }
    }
  }, [visible, currentDate, isSomedayFollowUp]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);

    let newDate: Date | null = null;
    const currentTime = new Date();

    switch (option) {
      case 'today':
        // Set to today, one hour from current time
        newDate = new Date();
        newDate.setHours(
          currentTime.getHours() + 1,
          currentTime.getMinutes(),
          0,
          0,
        );
        break;
      case 'tomorrow':
        // Set to tomorrow at current time
        newDate = new Date();
        newDate.setDate(newDate.getDate() + 1);
        // Keep current time
        break;
      case 'nextWeek':
        // Set to next week same day at current time
        newDate = new Date();
        newDate.setDate(newDate.getDate() + 7);
        // Keep current time
        break;
      case 'nextMonth':
        // Set to next month same day at current time
        newDate = new Date();
        newDate.setMonth(newDate.getMonth() + 1);
        // Keep current time
        break;
      case 'someday':
        // Set to null for someday
        newDate = null;
        break;
      case 'custom':
        // Open date picker in next step
        setShowDatePicker(true);
        return; // Don't set finalDate yet
    }

    setFinalDate(newDate);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const updatedDate = selectedDate || customDate;
    setShowDatePicker(Platform.OS === 'ios');
    setCustomDate(updatedDate);

    // After selecting date, show time picker
    if (Platform.OS !== 'ios' && selectedDate) {
      setTimeout(() => setShowTimePicker(true), 300);
    }

    // For iOS, we'll update the final date once both date and time are set
    if (Platform.OS === 'ios') {
      const combined = new Date(updatedDate);
      combined.setHours(customTime.getHours(), customTime.getMinutes());
      setFinalDate(combined);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    const updatedTime = selectedTime || customTime;
    setShowTimePicker(Platform.OS === 'ios');
    setCustomTime(updatedTime);

    // Combine date and time for the final date
    if (selectedTime || Platform.OS === 'ios') {
      const combined = new Date(customDate);
      combined.setHours(updatedTime.getHours(), updatedTime.getMinutes());
      setFinalDate(combined);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirmation(false);
    onClose();
    if (onDelete) {
      onDelete();
    }
  };

  const renderOption = (option: string, label: string, icon: IconEnum) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        selectedOption === option && styles.selectedOption,
      ]}
      onPress={() => handleOptionSelect(option)}>
      <GetIcon iconName={icon} size={20} />
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );

  const formatDisplayDate = (date: Date | null) => {
    if (!date) {
      return 'No specific date';
    }
    return `${format(date, 'PPP')} at ${format(date, 'p')}`;
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              selectedOption === 'custom' && styles.addModalHeight,
            ]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Follow-up</Text>
              {/* Show trash icon if there's any follow-up (date-based or someday) */}
              {(currentDate || isSomedayFollowUp) ? (
                <TouchableOpacity onPress={handleDelete} style={styles.deleteIcon}>
                  <GetIcon iconName="delete" size={20} color="#e74c3c" />
                </TouchableOpacity>
              ) : (
                <View style={styles.emptyHeaderSpace} />
              )}
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.sectionTitle}>Select an option</Text>

              <View style={styles.optionsContainer}>
                {renderOption('today', 'Today', 'calendarToday')}
                {renderOption('tomorrow', 'Tomorrow', 'calendarUpcoming')}
                {renderOption('nextWeek', 'Next Week', 'calendarUpcoming')}
                {renderOption('nextMonth', 'Next Month', 'calendarUpcoming')}
                {renderOption('someday', 'Someday', 'calendarSomeday')}
                {renderOption('custom', 'Custom Date', 'calendar')}
              </View>

              {selectedOption === 'custom' && (
                <View style={styles.customDateSection}>
                  <Text style={styles.dateTimeLabel}>Selected Date & Time:</Text>
                  <TouchableOpacity
                    style={styles.dateTimeDisplay}
                    onPress={() => setShowDatePicker(true)}>
                    <GetIcon iconName="calendar" size={20} color={Colors.main} />
                    <Text style={styles.dateTimeText}>
                      {formatDisplayDate(finalDate)}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {selectedOption &&
                selectedOption !== 'custom' &&
                selectedOption !== 'someday' && (
                  <View style={styles.datePreview}>
                    <Text style={styles.datePreviewLabel}>Scheduled for:</Text>
                    <Text style={styles.datePreviewText}>
                      {formatDisplayDate(finalDate)}
                    </Text>
                  </View>
                )}

              {selectedOption === 'someday' && (
                <View style={styles.datePreview}>
                  <Text style={styles.datePreviewLabel}>Scheduled for:</Text>
                  <Text style={styles.datePreviewText}>
                    Someday (no specific date)
                  </Text>
                </View>
              )}

              {/* Button row for Submit and Cancel */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!selectedOption || isLoading) && styles.disabledButton,
                  ]}
                  disabled={!selectedOption || isLoading}
                  onPress={() => onSubmit(finalDate)}>
                  <Text style={styles.submitButtonText}>
                    {isLoading ? 'Saving...' : 'Submit'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>

              {/* Add more bottom padding when custom date is selected */}
              <View
                style={[
                  styles.bottomPadding,
                  selectedOption === 'custom' && styles.extendedBottomPadding,
                ]}
              />
            </ScrollView>

            {/* Date Picker Modal - iOS renders as modal, Android as dropdown */}
            {showDatePicker && (
              <DateTimePicker
                value={customDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
                style={styles.datePicker}
              />
            )}

            {/* Time Picker Modal */}
            {showTimePicker && (
              <DateTimePicker
                value={customTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
                style={styles.datePicker}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal for deletion */}
      <ConfirmationModal
        visible={showDeleteConfirmation}
        title="Remove Follow-up"
        message="Are you sure you want to remove this follow-up?"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirmation(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  addModalHeight: {
    height: '65%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteIcon: {
    padding: 4,
  },
  emptyHeaderSpace: {
    width: 28, // Matches the size of the delete icon with padding
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
    maxHeight: 400,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
    width: '48%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedOption: {
    backgroundColor: Colors.main + '20',
    borderColor: Colors.main,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  customDateSection: {
    marginTop: 16,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateTimeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  dateTimeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateTimeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  datePreview: {
    marginTop: 16,
    backgroundColor: '#f5f9ff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0e0ff',
  },
  datePreviewLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4a86e8',
    marginBottom: 4,
  },
  datePreviewText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  submitButton: {
    flex: 1,
    backgroundColor: Colors.main,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  datePicker: {
    backgroundColor: 'white',
    width: '100%',
  },
  bottomPadding: {
    height: 20,
    width: '100%',
  },
  extendedBottomPadding: {
    height: 60, // Increased padding for custom date selection
  },
});

export default ScheduleFollowUpModal;
