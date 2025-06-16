import React, {useCallback, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ClientStackParamList} from '../../../navigator/components/ClientScreenStack';
import Header from '../../../components/Header';
import {PartnerDrawerParamList} from '../../../types/navigation';
import {useFocusEffect} from '@react-navigation/native';
import {useBottomTab} from '../../../context/BottomTabProvider';
import GetIcon, {IconEnum} from '../../../components/GetIcon';
import {Menu} from 'react-native-paper';
import PartnerService from '../../../services/PartnerService';
import {useAuth} from '../../../hooks/useAuth';
import {usePartner} from '../../../context/PartnerProvider';

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'MessagePreviewScreen'
>;

type MessageType = 'email' | 'whatsapp' | 'sms';

interface MessageOption {
  type: MessageType;
  title: string;
  icon: IconEnum;
  color: string;
  available: boolean;
  unavailableReason?: string;
}

const MessagePreviewScreen: React.FC<Props> = ({route, navigation}) => {
  const {
    clientName,
    clientPhone,
    clientWhatsapp,
    clientEmail,
    messageContent,
    templateName,
    clientId,
  } = route.params;

  const {hideBottomTabs, showBottomTabs} = useBottomTab();
  const [menuVisible, setMenuVisible] = useState(false);

  const {user} = useAuth();
  const {setClientsUpdated} = usePartner();

  // Hide bottom tabs when this screen is focused
  useFocusEffect(
    useCallback(() => {
      hideBottomTabs();
      return () => {
        showBottomTabs();
      };
    }, [hideBottomTabs, showBottomTabs]),
  );

  // Handle WhatsApp deep linking
  const handleWhatsAppLink = useCallback(
    async (content: string) => {
      if (!clientWhatsapp) {
        Alert.alert('Error', 'WhatsApp number not available for this client.');
        return;
      }

      try {
        // Prepare WhatsApp URLs
        const encodedContent = encodeURIComponent(content);
        const whatsappUrl = `whatsapp://send?phone=${clientWhatsapp}&text=${encodedContent}`;
        const webWhatsappUrl = `https://wa.me/${clientWhatsapp}?text=${encodedContent}`;

        // Try to open WhatsApp app, fallback to web version
        const canOpenApp = await Linking.canOpenURL(whatsappUrl);
        const urlToOpen = canOpenApp ? whatsappUrl : webWhatsappUrl;

        await Linking.openURL(urlToOpen);

        // Log activity after successful WhatsApp opening
        const response = await PartnerService.addEditClientActivity(
          111,
          clientId,
          messageContent,
          user?.email as string,
        );

        if (response.success) {
          setClientsUpdated(prev => !prev);
        }
      } catch (error) {
        console.error('Error opening WhatsApp:', error);
        Alert.alert(
          'Error',
          'Failed to open WhatsApp. Please make sure WhatsApp is installed.',
        );
      }
    },
    [clientWhatsapp, clientId, messageContent, user?.email, setClientsUpdated],
  );

  // Handle Email deep linking
  const handleEmailLink = useCallback(
    async (content: string) => {
      if (!clientEmail) {
        Alert.alert('Error', 'Email address not available for this client.');
        return;
      }

      try {
        const subject = 'Message from Agent';
        const emailUrl = `mailto:${clientEmail}?subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(content)}`;

        await Linking.openURL(emailUrl);
      } catch (error) {
        console.error('Error opening email:', error);
        Alert.alert('Error', 'Failed to open email app.');
      }
    },
    [clientEmail],
  );

  // Handle SMS deep linking
  const handleSMSLink = useCallback(
    async (content: string) => {
      if (!clientPhone) {
        Alert.alert('Error', 'Phone number not available for this client.');
        return;
      }

      try {
        const smsUrl = `sms:${clientPhone}?body=${encodeURIComponent(content)}`;
        await Linking.openURL(smsUrl);
      } catch (error) {
        console.error('Error opening SMS:', error);
        Alert.alert('Error', 'Failed to open SMS app.');
      }
    },
    [clientPhone],
  );

  const handleSendMessage = useCallback(
    async (messageType: MessageType) => {
      setMenuVisible(false);

      switch (messageType) {
        case 'whatsapp':
          await handleWhatsAppLink(messageContent);
          break;
        case 'email':
          await handleEmailLink(messageContent);
          break;
        case 'sms':
          await handleSMSLink(messageContent);
          break;
      }
    },
    [messageContent, handleWhatsAppLink, handleEmailLink, handleSMSLink],
  );

  const messageOptions: MessageOption[] = [
    {
      type: 'whatsapp',
      title: 'Send via WhatsApp',
      icon: 'whatsapp',
      color: '#25D366',
      available: !!clientWhatsapp,
      unavailableReason: !clientWhatsapp ? 'No WhatsApp number available' : '',
    },
    {
      type: 'email',
      title: 'Send via Email',
      icon: 'email',
      color: '#4CAF50',
      available: !!clientEmail,
      unavailableReason: !clientEmail ? 'No email address available' : '',
    },
    {
      type: 'sms',
      title: 'Send via SMS',
      icon: 'message',
      color: '#2196F3',
      available: !!clientPhone,
      unavailableReason: !clientPhone ? 'No phone number available' : '',
    },
  ];

  const availableOptions = messageOptions.filter(option => option.available);
  const defaultWhatsAppOption = messageOptions.find(
    option => option.type === 'whatsapp' && option.available,
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header<PartnerDrawerParamList>
        title="Message Preview"
        navigation={navigation}
        backButton={true}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Message Preview</Text>
          <Text style={styles.headerSubtitle}>Sending to {clientName}</Text>
          <Text style={styles.templateName}>Template: {templateName}</Text>
        </View>

        <View style={styles.messagePreviewContainer}>
          <Text style={styles.messagePreviewLabel}>Message Content:</Text>
          <View style={styles.messagePreview}>
            <Text style={styles.messageContent}>{messageContent}</Text>
          </View>
        </View>

        <View style={styles.recipientInfo}>
          <Text style={styles.recipientInfoTitle}>Recipient Information:</Text>
          {clientWhatsapp && (
            <Text style={styles.recipientInfoText}>
              WhatsApp: {clientWhatsapp}
            </Text>
          )}
          {clientEmail && (
            <Text style={styles.recipientInfoText}>Email: {clientEmail}</Text>
          )}
          {clientPhone && (
            <Text style={styles.recipientInfoText}>Phone: {clientPhone}</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.actionButtonsContainer}>
        {/* Default WhatsApp Button */}
        {defaultWhatsAppOption && (
          <TouchableOpacity
            style={[
              styles.defaultSendButton,
              {backgroundColor: defaultWhatsAppOption.color},
            ]}
            onPress={() => handleSendMessage('whatsapp')}
            activeOpacity={0.8}>
            <GetIcon
              iconName={defaultWhatsAppOption.icon as any}
              color="white"
              size={20}
            />
            <Text style={styles.defaultSendButtonText}>
              {defaultWhatsAppOption.title}
            </Text>
          </TouchableOpacity>
        )}

        {/* Alternative Options Menu */}
        {availableOptions.length > 1 && (
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity
                style={styles.alternativeButton}
                onPress={() => setMenuVisible(true)}
                activeOpacity={0.8}>
                <GetIcon iconName="threeDots" color="#666" size={16} />
              </TouchableOpacity>
            }
            contentStyle={styles.menuContent}>
            {availableOptions
              .filter(
                option => option.type !== 'whatsapp' || !defaultWhatsAppOption,
              )
              .map(option => (
                <Menu.Item
                  key={option.type}
                  onPress={() => handleSendMessage(option.type)}
                  title={option.title}
                  titleStyle={styles.menuItemTitle}
                  // eslint-disable-next-line react/no-unstable-nested-components
                  leadingIcon={() => (
                    <GetIcon
                      iconName={option.icon as any}
                      color={option.color}
                      size={20}
                    />
                  )}
                />
              ))}
          </Menu>
        )}
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
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  templateName: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  messagePreviewContainer: {
    marginBottom: 24,
  },
  messagePreviewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  messagePreview: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  recipientInfo: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  recipientInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  recipientInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultSendButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginRight: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  defaultSendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  alternativeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  menuContent: {
    backgroundColor: 'white',
    borderRadius: 8,
  },
  menuItemTitle: {
    color: '#333',
    fontSize: 14,
  },
});

export default MessagePreviewScreen;
