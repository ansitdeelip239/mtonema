import React, {useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ClientStackParamList} from '../../../navigator/components/ClientScreenStack';
import Header from '../../../components/Header';
import {PartnerDrawerParamList} from '../../../types/navigation';
import {useFocusEffect} from '@react-navigation/native';
import {useBottomTab} from '../../../context/BottomTabProvider';
import GetIcon, { IconEnum } from '../../../components/GetIcon';

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'ChooseMessageTypeScreen'
>;

type MessageType = 'email' | 'whatsapp' | 'sms';
interface MessageTypes {
  type: MessageType;
  title: string;
  subtitle: string;
  icon: IconEnum;
  color: string;
  available: boolean;
  unavailableReason?: string;
}

const ChooseMessageTypeScreen: React.FC<Props> = ({route, navigation}) => {
  const {clientId, clientName, clientPhone, clientWhatsapp, clientEmail} =
    route.params;
  const {hideBottomTabs, showBottomTabs} = useBottomTab();

  // Hide bottom tabs when this screen is focused
  useFocusEffect(
    useCallback(() => {
      hideBottomTabs();

      return () => {
        showBottomTabs();
      };
    }, [hideBottomTabs, showBottomTabs]),
  );

  const handleMessageTypePress = useCallback(
    (messageType: MessageType) => {
      navigation.navigate('MessageTemplateScreen', {
        clientId,
        clientName,
        clientPhone,
        clientWhatsapp,
        clientEmail,
        messageType,
      });
    },
    [
      clientId,
      clientName,
      clientPhone,
      clientWhatsapp,
      clientEmail,
      navigation,
    ],
  );

  const messageTypes: MessageTypes[] = [
    {
      type: 'email',
      title: 'Email',
      subtitle: 'Send via Email',
      icon: 'email',
      color: '#4CAF50',
      available: !!clientEmail,
      unavailableReason: !clientEmail ? 'No email address available' : '',
    },
    {
      type: 'whatsapp',
      title: 'WhatsApp',
      subtitle: 'Send via WhatsApp',
      icon: 'whatsapp',
      color: '#25D366',
      available: !!clientWhatsapp,
      unavailableReason: !clientWhatsapp ? 'No WhatsApp number available' : '',
    },
    {
      type: 'sms',
      title: 'SMS',
      subtitle: 'Send via SMS',
      icon: 'message',
      color: '#2196F3',
      available: !!clientPhone,
      unavailableReason: !clientPhone ? 'No phone number available' : '',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header<PartnerDrawerParamList>
        title="Choose Message Type"
        navigation={navigation}
        backButton={true}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Select Message Type</Text>
          <Text style={styles.headerSubtitle}>
            Choose how you want to send the message to {clientName}
          </Text>
        </View>

        <View style={styles.messageTypeContainer}>
          {messageTypes.map(messageType => (
            <TouchableOpacity
              key={messageType.type}
              style={[
                styles.messageTypeButton,
                !messageType.available && styles.messageTypeButtonDisabled,
              ]}
              onPress={() => messageType.available && handleMessageTypePress(messageType.type)}
              activeOpacity={messageType.available ? 0.7 : 1}>
              <View style={styles.messageTypeContent}>
                <View
                  style={[
                    styles.iconContainer,
                    // eslint-disable-next-line react-native/no-inline-styles
                    {backgroundColor: messageType.available ? messageType.color : '#ccc'},
                  ]}>
                  <GetIcon
                    iconName={messageType.icon as any}
                    color="white"
                    size={24}
                  />
                </View>
                <View style={styles.messageTypeText}>
                  <Text
                    style={[
                      styles.messageTypeTitle,
                      !messageType.available && styles.messageTypeTextDisabled,
                    ]}>
                    {messageType.title}
                  </Text>
                  <Text
                    style={[
                      styles.messageTypeSubtitle,
                      !messageType.available && styles.messageTypeTextDisabled,
                    ]}>
                    {messageType.available
                      ? messageType.subtitle
                      : messageType.unavailableReason}
                  </Text>
                </View>
                <View style={styles.arrow}>
                  <GetIcon
                    iconName="chevronRight"
                    color={messageType.available ? '#666' : '#ccc'}
                    size={16}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Select a message type to choose from available templates and send
            personalized messages.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  messageTypeContainer: {
    marginBottom: 24,
  },
  messageTypeButton: {
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
  messageTypeButtonDisabled: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowOpacity: 0.05,
    elevation: 2,
  },
  messageTypeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  messageTypeText: {
    flex: 1,
  },
  messageTypeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  messageTypeSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  messageTypeTextDisabled: {
    color: '#999',
  },
  arrow: {
    marginLeft: 8,
  },
  infoContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 16,
    marginTop: 'auto',
  },
  infoText: {
    fontSize: 14,
    color: '#1976d2',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ChooseMessageTypeScreen;
