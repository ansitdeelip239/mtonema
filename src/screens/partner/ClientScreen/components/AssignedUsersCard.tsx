import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import GetIcon from '../../../../components/GetIcon';

interface AssignedUsersCardProps {
  assignedUsersCount: number;
  isLoading?: boolean;
  onPress?: () => void;
}

const AssignedUsersCard: React.FC<AssignedUsersCardProps> = ({
  assignedUsersCount,
  isLoading = false,
  onPress,
}) => {
  const isAssigned = assignedUsersCount > 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress || isLoading}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <GetIcon
            iconName="user"
            color={isAssigned ? '#0066cc' : '#999'}
            size={20}
          />
        </View>

        <View style={styles.textContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#666" />
              <Text style={styles.loadingText}>Loading assignments...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.label}>
                {isAssigned ? 'Assigned To' : 'Unassigned'}
              </Text>
              {isAssigned && (
                <Text style={styles.description}>
                  {assignedUsersCount} user{assignedUsersCount > 1 ? 's' : ''}
                </Text>
              )}
            </>
          )}
        </View>

        {!isLoading && isAssigned && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{assignedUsersCount}</Text>
          </View>
        )}

        {!isLoading && onPress && (
          <View style={styles.arrowContainer}>
            <GetIcon iconName="chevronRight" color="#999" size={16} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  countBadge: {
    backgroundColor: '#0066cc',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  countText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  arrowContainer: {
    padding: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
});

export default AssignedUsersCard;
