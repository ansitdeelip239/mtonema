import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Client} from '../../../../types';

interface ProfileHeaderProps {
  client: Client;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({client}) => {
  return (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {client.clientName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.clientName}>{client.clientName}</Text>
      {client.displayName && (
        <Text style={styles.displayName}>{client.displayName}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  clientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  displayName: {
    fontSize: 16,
    color: '#666',
  },
});

export default ProfileHeader;
