import React from 'react';
import {View, Text, StyleSheet, Linking, TouchableOpacity} from 'react-native';
import {Client} from '../../../../types';
import {formatDate} from '../../../../utils/dateUtils';
import GroupBadges from './GroupBadge';
import {ClientStackParamList} from '../../../../navigator/components/ClientScreenStack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import GetIcon from '../../../../components/GetIcon';
import { getPastelColor } from '../../../../utils/getPastelColor';

interface ClientCardProps {
  client: Client;
  navigation: NativeStackNavigationProp<
    ClientStackParamList,
    'ClientScreen',
    undefined
  >;
  onContactPress?: (
    type: 'phone' | 'whatsapp',
    client: Client,
    activityTypeId?: number | null,
  ) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  navigation,
  onContactPress,
}) => {
  const handleWhatsapp = () => {
    // Open WhatsApp
    Linking.openURL(
      `https://api.whatsapp.com/send?phone=${client.whatsappNumber}`,
    );

    // Trigger activity recording if handler is provided
    if (onContactPress) {
      onContactPress('whatsapp', client);
    }
  };

  const handlePhone = () => {
    // Make phone call
    Linking.openURL(`tel:${client.mobileNumber}`);

    // Trigger activity recording if handler is provided
    if (onContactPress) {
      onContactPress('phone', client);
    }
  };

  const handleCardPress = () => {
    navigation.navigate('ClientProfileScreen', {clientId: client.id});
  };

  return (
    <TouchableOpacity onPress={handleCardPress} activeOpacity={0.7}>
      <View style={styles.clientCard}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.avatar,
                {backgroundColor: getPastelColor(client.clientName)},
              ]}>
              <Text style={styles.avatarText}>
                {client.clientName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.nameStatusContainer}>
              <Text style={styles.clientName}>{client.clientName}</Text>
              <View style={styles.statusRow}>
                {(() => {
                  const now = new Date();
                  const createdDate = new Date(client.createdOn);
                  const oneDayAgo = new Date(
                    now.getTime() - 24 * 60 * 60 * 1000,
                  );
                  const isNewClient = createdDate > oneDayAgo;
                  return isNewClient ? (
                    <View style={[styles.statusBadge, styles.newStatus]}>
                      <Text style={styles.statusText}>New</Text>
                    </View>
                  ) : null;
                })()}
                <Text style={styles.timeText}>
                  {client.lastActivityDate
                    ? formatDate(client.lastActivityDate, 'h:mm a')
                    : formatDate(client.createdOn, 'h:mm a')}
                </Text>
              </View>
            </View>
            <View style={styles.actionIconsRow}>
              {client.whatsappNumber && (
                <TouchableOpacity
                  onPress={handleWhatsapp}
                  style={[styles.iconButton, styles.whatsappButton]}
                >
                  <GetIcon iconName="whatsapp" size={20} color="#fff" />
                </TouchableOpacity>
              )}
              {client.mobileNumber && (
                <TouchableOpacity onPress={handlePhone} style={[styles.iconButton, styles.phoneButton]}>
                  <GetIcon iconName="phone" size={14} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View style={styles.cardContent}>
          {/* Phone and email info hidden as requested */}
          {/* {client.lastActivityDate && (
            <View style={styles.lastActivityRow}>
              <Text style={styles.lastActivityText}>
                Last Activity: {formatDate(client.lastActivityDate, 'MMM d, yyyy h:mm a')}
              </Text>
            </View>
          )} */}

          {/* Assigned Team Members - Compact version */}
          {client.assignedTeamIds && client.assignedTeamIds.length > 0 && (
            <View style={styles.assignedContainer}>
              <Text style={styles.assignedLabel}>Assigned:</Text>
              <View style={styles.assignedBadgesWrapper}>
                {client.assignedTeamIds.map(member => (
                  <View key={member.id} style={styles.assignedBadge}>
                    <Text style={styles.assignedBadgeText}>{member.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Groups - Compact version */}
          {client.groups.length > 0 && (
            <View style={styles.groupsCompact}>
              <GroupBadges groups={client.groups} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  clientCard: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  nameStatusContainer: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  newStatus: {
    backgroundColor: '#e8f5e8',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#333',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  actionIconsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 12,
    marginTop: -18,
    gap: 2,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginRight: 8,
    elevation: 2,
    padding: 0,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  phoneButton: {
    backgroundColor: '#007AFF',
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
  },
  separator: {
    fontSize: 13,
    color: '#ccc',
    marginHorizontal: 8,
  },
  assignedContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  assignedLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 6,
    fontWeight: '500',
    marginTop: 2,
  },
  assignedBadgesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    gap: 4,
  },
  assignedBadge: {
    backgroundColor: '#e6f0fa',
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#b3d4fc',
  },
  assignedBadgeText: {
    color: '#0066cc',
    fontWeight: '500',
    fontSize: 11,
  },
  assignedText: {
    fontSize: 12,
    color: '#0066cc',
    fontWeight: '500',
    flex: 1,
  },
  groupsCompact: {
    marginTop: 4,
  },
  lastActivityRow: {
    marginBottom: 8,
  },
  lastActivityText: {
    fontSize: 12,
    color: '#888',
  },
});
