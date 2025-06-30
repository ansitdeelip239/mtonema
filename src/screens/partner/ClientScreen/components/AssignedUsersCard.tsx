import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import GetIcon from '../../../../components/GetIcon';

interface AssignedUser {
  id: number;
  name: string;
  email: string;
}

interface AssignedUsersCardProps {
  assignedUsers: AssignedUser[];
  isLoading?: boolean;
  onPress?: () => void;
}

const AssignedUsersCard: React.FC<AssignedUsersCardProps> = ({
  assignedUsers = [],
  isLoading = false,
  onPress,
}) => {
  const isAssigned = assignedUsers.length > 0;

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
                <View style={styles.badgesContainer}>
                  {assignedUsers.map(user => (
                    <View key={user.id} style={styles.userBadge}>
                      <Text style={styles.userBadgeText}>{user.name}</Text>
                    </View>
                  ))}
                </View>
              )}
              {!isAssigned && (
                <Text style={styles.description}>No users assigned</Text>
              )}
            </>
          )}
        </View>

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
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  userBadge: {
    backgroundColor: '#e6f2ff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#b3d4fc',
  },
  userBadgeText: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '500',
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
