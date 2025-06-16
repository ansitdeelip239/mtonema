import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
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
    clientId,
    clientName,
    clientPhone,
    clientWhatsapp,
    clientEmail,
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

  // Handle template selection - navigate to message preview
  const handleTemplatePress = useCallback(
    (item: ContentTemplate) => {
      console.log('Template selected:', item.name);

      const processedContent = processTemplateContent(item.content);

      // Navigate to message preview screen
      navigation.navigate('MessagePreviewScreen', {
        clientId,
        clientName,
        clientPhone,
        clientWhatsapp,
        clientEmail,
        messageContent: processedContent,
        templateName: item.name,
      });
    },
    [
      processTemplateContent,
      navigation,
      clientId,
      clientName,
      clientPhone,
      clientWhatsapp,
      clientEmail,
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
          title="Select Message Template"
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
        title="Select Message Template"
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
