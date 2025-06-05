import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, SafeAreaView, Linking, Alert} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ClientStackParamList} from '../../../navigator/components/ClientScreenStack';
import Header from '../../../components/Header';
import {PartnerDrawerParamList} from '../../../types/navigation';
import {useAuth} from '../../../hooks/useAuth';
import {ContentTemplate} from '../../../types';
import PartnerService from '../../../services/PartnerService';
import {useDialog} from '../../../hooks/useDialog';
import ContentTemplatesList from '../ContentScreen/components/ContentTemplateList';
import ContentLoadingIndicator from '../ContentScreen/components/ContentLoadingIndicator';
import ContentHeader from '../ContentScreen/components/ContentHeader';
import {useFocusEffect} from '@react-navigation/native';
import {useBottomTab} from '../../../context/BottomTabProvider';
import { usePartner } from '../../../context/PartnerProvider';

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'MessageTemplateScreen'
>;

const PAGE_SIZE = 20;

const MessageTemplateScreen: React.FC<Props> = ({route, navigation}) => {
  const {
    clientName,
    clientPhone,
    clientWhatsapp,
    clientEmail,
    messageType = 'whatsapp',
  } = route.params;
  const {user} = useAuth();
  const {showError} = useDialog();
  const {messageTemplateUpdated} = usePartner();
  const {hideBottomTabs, showBottomTabs} = useBottomTab();

  // State management
  const [contentTemplates, setContentTemplates] = useState<ContentTemplate[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Get header title based on message type
  const getHeaderTitle = () => {
    switch (messageType) {
      case 'email':
        return 'Select Email Template';
      case 'whatsapp':
        return 'Select WhatsApp Template';
      case 'sms':
        return 'Select SMS Template';
      default:
        return 'Select Message Template';
    }
  };

  // Process template content with placeholders
  const processTemplateContent = useCallback(
    (content: string) => {
      let processedContent = content;

      // Client variables
      if (clientName) {
        processedContent = processedContent.replace(/{name}/g, clientName);
      }
      if (clientPhone) {
        processedContent = processedContent.replace(/{phone}/g, clientPhone);
        processedContent = processedContent.replace(/{phoneNumber}/g, clientPhone);
      }
      if (clientWhatsapp) {
        processedContent = processedContent.replace(/{whatsapp_number}/g, clientWhatsapp);
        processedContent = processedContent.replace(/{whatsappNumber}/g, clientWhatsapp);
      }
      if (clientEmail) {
        processedContent = processedContent.replace(/{email}/g, clientEmail);
      }

      // Sender/User variables
      if (user?.name) {
        processedContent = processedContent.replace(/{sender_name}/g, user.name);
      }
      if (user?.email) {
        processedContent = processedContent.replace(/{sender_email}/g, user.email);
      }
      if (user?.location) {
        processedContent = processedContent.replace(/{sender_address}/g, user.location);
      }
      if (user?.phone) {
        processedContent = processedContent.replace(/{sender_phone}/g, user.phone);
      }

      return processedContent;
    },
    [clientName, clientPhone, clientWhatsapp, clientEmail, user?.name, user?.email, user?.location, user?.phone],
  );

  // Handle WhatsApp deep linking
  const handleWhatsAppLink = useCallback(
    async (content: string) => {
      if (!clientWhatsapp) {
        Alert.alert('Error', 'WhatsApp number not available for this client.');
        return;
      }

      try {
        const whatsappUrl = `whatsapp://send?phone=${clientWhatsapp}&text=${encodeURIComponent(
          content,
        )}`;
        const canOpen = await Linking.canOpenURL(whatsappUrl);

        if (canOpen) {
          await Linking.openURL(whatsappUrl);
        } else {
          // Fallback to web WhatsApp
          const webWhatsappUrl = `https://wa.me/${clientWhatsapp}?text=${encodeURIComponent(
            content,
          )}`;
          await Linking.openURL(webWhatsappUrl);
        }
      } catch (error) {
        console.error('Error opening WhatsApp:', error);
        Alert.alert(
          'Error',
          'Failed to open WhatsApp. Please make sure WhatsApp is installed.',
        );
      }
    },
    [clientWhatsapp],
  );

  // Handle Email deep linking
  const handleEmailLink = useCallback(
    async (content: string) => {
      if (!clientEmail) {
        Alert.alert('Error', 'Email address not available for this client.');
        return;
      }

      try {
        const subject = `Message from ${user?.name || 'Agent'}`;
        const emailUrl = `mailto:${clientEmail}?subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(content)}`;

        await Linking.openURL(emailUrl);
      } catch (error) {
        console.error('Error opening email:', error);
        Alert.alert('Error', 'Failed to open email app.');
      }
    },
    [clientEmail, user?.name],
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

        // const canOpen = await Linking.canOpenURL(smsUrl);
        // if (canOpen) {
          await Linking.openURL(smsUrl);
        // } else {
        //   Alert.alert('Error', 'SMS not supported on this device.');
        // }
      } catch (error) {
        console.error('Error opening SMS:', error);
        Alert.alert('Error', 'Failed to open SMS app.');
      }
    },
    [clientPhone],
  );

  // Fetch content templates
  const fetchContentTemplates = useCallback(
    async (pageNumber: number = 1, isRefresh: boolean = false) => {
      if (!user?.id) {
        return;
      }

      try {
        if (pageNumber === 1) {
          isRefresh ? setRefreshing(true) : setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const response = await PartnerService.getContentTemplates(
          user.id,
          pageNumber,
          PAGE_SIZE,
        );

        if (response.success) {
          const {contentTemplates: newTemplates, responsePagingModel} =
            response.data;

          if (pageNumber === 1) {
            setContentTemplates(newTemplates);
          } else {
            setContentTemplates(prev => [...prev, ...newTemplates]);
          }

          setTotalCount(responsePagingModel.totalCount);
          setHasNextPage(responsePagingModel.nextPage);
          setCurrentPage(pageNumber);
        } else {
          showError('Failed to fetch content templates');
        }
      } catch (error) {
        console.error('Error fetching content templates:', error);
        showError('Error loading content templates');
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [user?.id, showError],
  );

  // Initial load
  useEffect(() => {
    fetchContentTemplates(1);
  }, [fetchContentTemplates, messageTemplateUpdated]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    setHasNextPage(true);
    fetchContentTemplates(1, true);
  }, [fetchContentTemplates]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasNextPage) {
      const nextPage = currentPage + 1;
      fetchContentTemplates(nextPage);
    }
  }, [loadingMore, hasNextPage, currentPage, fetchContentTemplates]);

  // Handle template selection with platform-specific deep linking
  const handleTemplatePress = useCallback(
    async (item: ContentTemplate) => {
      console.log('Template selected:', item.name, 'for', messageType);

      const processedContent = processTemplateContent(item.content);

      switch (messageType) {
        case 'whatsapp':
          await handleWhatsAppLink(processedContent);
          break;
        case 'email':
          await handleEmailLink(processedContent);
          break;
        case 'sms':
          await handleSMSLink(processedContent);
          break;
        default:
          // Default to WhatsApp
          await handleWhatsAppLink(processedContent);
      }
    },
    [
      messageType,
      processTemplateContent,
      handleWhatsAppLink,
      handleEmailLink,
      handleSMSLink,
    ],
  );

  // Hide bottom tabs when this screen is focused
  useFocusEffect(
    useCallback(() => {
      hideBottomTabs();

      return () => {
        showBottomTabs();
      };
    }, [hideBottomTabs, showBottomTabs]),
  );

  // Main loading state
  if (loading && contentTemplates.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header<PartnerDrawerParamList>
          title={getHeaderTitle()}
          navigation={navigation}
          backButton={true}
        />
        <ContentLoadingIndicator type="initial" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header<PartnerDrawerParamList>
        title={getHeaderTitle()}
        navigation={navigation}
        backButton={true}
      />

      <View style={styles.content}>
        <ContentHeader totalCount={totalCount} />

        <ContentTemplatesList
          data={contentTemplates}
          loading={loading}
          refreshing={refreshing}
          loadingMore={loadingMore}
          onRefresh={handleRefresh}
          onLoadMore={handleLoadMore}
          onTemplatePress={handleTemplatePress}
        />
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
});

export default MessageTemplateScreen;
