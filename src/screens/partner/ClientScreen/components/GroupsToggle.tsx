import React, {useState, useCallback, useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {usePartner} from '../../../../context/PartnerProvider';
import GetIcon from '../../../../components/GetIcon';
import Colors from '../../../../constants/Colors';
import AddGroupModal from '../../GroupsScreen/components/AddGroupModal';
import PartnerService from '../../../../services/PartnerService';
import Toast from 'react-native-toast-message';
import {useAuth} from '../../../../hooks/useAuth';
import {useTheme} from '../../../../context/ThemeProvider';

interface GroupsToggleComponentProps {
  selectedGroups: number[];
  onGroupsChange: (groups: number[]) => void;
}

const GroupsToggleComponent: React.FC<GroupsToggleComponentProps> = ({
  selectedGroups,
  onGroupsChange,
}) => {
  const {groups, reloadGroups} = usePartner();
  const {user} = useAuth();
  const {theme} = useTheme();
  const [showAllGroups, setShowAllGroups] = useState(false);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);

  // Function to handle group creation
  const handleAddGroup = useCallback(
    async (groupName: string, colorId: number) => {
      if (!groupName.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Group name is required',
        });
        return;
      }

      try {
        setIsAddingGroup(true);

        // Call the API to add the group
        const response = await PartnerService.createGroup(
          groupName,
          colorId,
          user?.email as string,
        );

        if (response.success) {
          Toast.show({
            type: 'success',
            text1: 'Group added successfully',
          });

          reloadGroups();

          // Close the modal
          setShowAddGroupModal(false);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Failed to add group',
            text2: response.message || 'Please try again',
          });
        }
      } catch (error) {
        console.error('Error adding group:', error);
        Toast.show({
          type: 'error',
          text1: 'Failed to add group',
          text2: 'An unexpected error occurred',
        });
      } finally {
        setIsAddingGroup(false);
      }
    },
    [reloadGroups, user?.email],
  );

  const toggleGroup = useCallback(
    (groupId: number) => {
      const updatedGroups = selectedGroups.includes(groupId)
        ? selectedGroups.filter(id => id !== groupId)
        : [...selectedGroups, groupId];

      onGroupsChange(Array.from(new Set(updatedGroups)));
    },
    [selectedGroups, onGroupsChange],
  );

  // Calculate all the groups data in one useMemo
  const groupsData = useMemo(() => {
    const initialGroupsToShow = 10;

    // First, get all selected groups - these will always be shown
    const selected =
      groups?.filter(group => selectedGroups.includes(group.id)) || [];

    // Then, get unselected groups
    const unselected =
      groups?.filter(group => !selectedGroups.includes(group.id)) || [];

    // Determine which unselected groups to show
    const toShow = showAllGroups
      ? unselected
      : unselected.slice(0, Math.max(0, initialGroupsToShow - selected.length));

    // Combine the selected and unselected groups
    const visible = [...selected, ...toShow];

    // Determine if there are more unselected groups to show
    const hasMore = unselected.length > toShow.length;

    return {
      visibleGroups: visible,
      hasMoreGroups: hasMore,
      unselectedGroups: unselected,
      unselectedToShow: toShow,
    };
  }, [groups, selectedGroups, showAllGroups]);

  // Destructure directly from groupsData to avoid redeclaration issues
  const {visibleGroups, hasMoreGroups, unselectedGroups, unselectedToShow} =
    groupsData;

  return (
    <View style={styles.groupsContainer}>
      {/* Header with Select Groups label and Add Group button */}
      <View style={styles.groupsLabelRow}>
        <TouchableOpacity
          style={styles.groupLabelWithIcon}
          onPress={() => setShowAllGroups(!showAllGroups)}>
          <Text style={styles.groupsLabel}>Select Groups</Text>
          <View style={styles.foldIconButton}>
            <GetIcon
              iconName={showAllGroups ? 'fold' : 'unfold'}
              size={18}
              color={theme.primaryColor}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowAddGroupModal(true)}
          style={[styles.addGroupButton, {backgroundColor: theme.primaryColor}]}>
          <GetIcon iconName="plus" size={16} color="white" />
          <Text style={styles.addGroupButtonText}>Add Group</Text>
        </TouchableOpacity>
      </View>

      {/* Group buttons container */}
      <View style={styles.groupButtonsContainer}>
        {visibleGroups.map(group => (
          <TouchableOpacity
            key={group.id}
            style={[
              styles.groupButton,
              {borderColor: theme.primaryColor},
              selectedGroups.includes(group.id) && {
                backgroundColor: group.color.name,
                borderColor: group.color.name,
              },
            ]}
            onPress={() => toggleGroup(group.id)}>
            <Text
              style={[
                styles.groupButtonText,
                {color: theme.primaryColor},
                selectedGroups.includes(group.id) &&
                  styles.groupButtonTextSelected,
              ]}>
              {group.groupName}
            </Text>
          </TouchableOpacity>
        ))}

        {hasMoreGroups && !showAllGroups && (
          <TouchableOpacity
            style={[
              styles.groupButton,
              styles.moreButton,
              {borderColor: theme.primaryColor},
            ]}
            onPress={() => setShowAllGroups(true)}>
            <Text style={styles.moreButtonText}>
              +{unselectedGroups.length - unselectedToShow.length} More
            </Text>
          </TouchableOpacity>
        )}

        {showAllGroups && unselectedGroups.length > 0 && (
          <TouchableOpacity
            style={[
              styles.groupButton,
              styles.moreButton,
              {borderColor: theme.primaryColor},
            ]}
            onPress={() => setShowAllGroups(false)}>
            <Text style={styles.moreButtonText}>Show Less</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Add Group Modal */}
      {showAddGroupModal && (
        <AddGroupModal
          visible={showAddGroupModal}
          onClose={() => setShowAddGroupModal(false)}
          onSave={handleAddGroup} // Use the async function here
          styles={{
            modalContainer: {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            modalContent: {
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 20,
              width: '80%',
              maxWidth: 400,
            },
            modalTitle: {
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 16,
              color: theme.primaryColor,
            },
            input: {
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              backgroundColor: '#f9f9f9',
              marginBottom: 16,
            },
            modalButtons: {
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 16,
            },
            modalButton: {
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 8,
              marginLeft: 12,
            },
            cancelButton: {
              backgroundColor: Colors.ligthGray,
            },
            saveButton: {
              backgroundColor: theme.primaryColor,
            },
            buttonText: {
              fontWeight: 'bold',
              fontSize: 14,
              color: 'white',
            },
          }}
          isLoading={isAddingGroup} // Pass loading state to show spinner
        />
      )}
    </View>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  groupsContainer: {
    marginBottom: 16,
  },
  groupsLabel: {
    fontSize: 16,
    color: '#000',
    marginRight: 4,
  },
  groupButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  groupButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  groupButtonText: {
    fontSize: 14,
  },
  groupButtonTextSelected: {
    color: '#fff',
  },
  moreButton: {
    backgroundColor: '#f0f0f0',
    borderColor: '#d0d0d0',
  },
  moreButtonText: {
    color: '#555',
    fontSize: 14,
    fontWeight: '500',
  },
  groupsLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupLabelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  foldIconButton: {
    marginLeft: 4,
  },
  addGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addGroupButtonText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 14,
  },
});

export default GroupsToggleComponent;
