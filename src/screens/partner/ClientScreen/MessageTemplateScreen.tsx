import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, SafeAreaView, Linking} from 'react-native';
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

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'MessageTemplateScreen'
>;

const PAGE_SIZE = 20;

const MessageTemplateScreen: React.FC<Props> = ({route, navigation}) => {
  const {clientName, clientPhone, clientWhatsapp, clientEmail} =
    route.params;
  const {user} = useAuth();
  const {showError} = useDialog();

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
  }, [fetchContentTemplates]);

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

  // Handle template selection
  const handleTemplatePress = useCallback(
    (item: ContentTemplate) => {
      console.log('Template selected:', item.name, item.content);
      // Replace placeholders in template content
      let processedContent = item.content;
      if (clientName) {
        processedContent = processedContent.replace(/{name}/g, clientName);
      }
      if (clientPhone) {
        processedContent = processedContent.replace(
          /{phoneNumber}/g,
          clientPhone,
        );
      }
      if (clientWhatsapp) {
        processedContent = processedContent.replace(
          /{whatsappNumber}/g,
          clientWhatsapp,
        );
      }
      if (clientEmail) {
        processedContent = processedContent.replace(/{email}/g, clientEmail);
      }

      // Create WhatsApp deep link with prefilled message
      const whatsappUrl = `whatsapp://send?phone=${clientWhatsapp}&text=${encodeURIComponent(
        processedContent,
      )}`;
      Linking.openURL(whatsappUrl).catch(() => {
        // Fallback to web WhatsApp if app is not installed
        const webWhatsappUrl = `https://wa.me/${clientWhatsapp}?text=${encodeURIComponent(
          processedContent,
        )}`;
        Linking.openURL(webWhatsappUrl);
      });
      // TODO: Navigate to send message screen with selected template
      // navigation.navigate('SendMessageScreen', {
      //   templateId: item.id,
      //   templateContent: item.content,
      //   clientId,
      //   clientName,
      //   clientPhone,
      //   clientWhatsapp,
      //   clientEmail,
      // });
    },
    [clientEmail, clientName, clientPhone, clientWhatsapp],
  );

  const handleTemplateView = useCallback((item: ContentTemplate) => {
    console.log('View template:', item.name);
    // TODO: Show template preview
  }, []);

  const handleTemplateEdit = useCallback((item: ContentTemplate) => {
    console.log('Edit template:', item.name);
    // TODO: Navigate to edit template screen
  }, []);

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
          onTemplateView={handleTemplateView}
          onTemplateEdit={handleTemplateEdit}
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
