import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  I18nManager,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../../../components/Header';
import {PartnerDrawerParamList} from '../../../types/navigation';
import {ContentTemplate} from '../../../types';
import PartnerService from '../../../services/PartnerService';
import {useTheme} from '../../../context/ThemeProvider';
import ContentHeader from './components/ContentHeader';
import ContentLoadingIndicator from './components/ContentLoadingIndicator';
import ContentTemplatesList from './components/ContentTemplateList';
import GetIcon from '../../../components/GetIcon';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ContentTemplateStackParamList} from '../../../navigator/components/ContentTemplateStack';
import {usePartner} from '../../../context/PartnerProvider';
import {useAuth} from '../../../context/AuthProvider';
import {useDialog} from '../../../context/DialogProvider';

type Props = NativeStackScreenProps<
  ContentTemplateStackParamList,
  'ContentTemplateScreen'
>;

const PAGE_SIZE = 20;

const ContentScreen: React.FC<Props> = ({navigation}) => {
  const {user} = useAuth();
  const {showError} = useDialog();
  const {theme} = useTheme();
  const {messageTemplateUpdated} = usePartner();
  const {t} = useTranslation();

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
          showError(
            t(
              'contentScreen.errors.fetchFailed',
              'Failed to fetch content templates',
            ),
          );
        }
      } catch (error) {
        console.error('Error fetching content templates:', error);
        showError(
          t(
            'contentScreen.errors.loadingError',
            'Error loading content templates',
          ),
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [user?.id, showError, t],
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

  // Handle template actions
  const handleTemplatePress = useCallback((item: ContentTemplate) => {
    console.log('Template pressed:', item.name);
  }, []);

  const handleTemplateView = useCallback((item: ContentTemplate) => {
    console.log('View template:', item.name);
  }, []);

  const handleTemplateEdit = useCallback(
    (item: ContentTemplate) => {
      navigation.navigate('AddContentTempleteScreen', {
        editMode: true,
        templateData: item,
      });
    },
    [navigation],
  );

  // Handle FAB press
  const handleAddContent = useCallback(() => {
    navigation.navigate('AddContentTempleteScreen', {
      editMode: false,
    });
  }, [navigation]);

  // Main loading state
  if (loading && contentTemplates.length === 0) {
    return (
      <View style={styles.container}>
        {Platform.OS === 'android' && (
          <Header<PartnerDrawerParamList>
            title={t(
              'contentScreen.headers.contentTemplates',
              'Content Templates',
            )}
          />
        )}
        <ContentLoadingIndicator type="initial" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'android' && (
        <Header<PartnerDrawerParamList>
          title={t(
            'contentScreen.headers.contentTemplates',
            'Content Templates',
          )}
        />
      )}

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

        {/* Simple FAB with fixed text */}
        <TouchableOpacity
          style={[styles.fab, {backgroundColor: theme.primaryColor}]}
          onPress={handleAddContent}
          activeOpacity={0.8}>
          <View style={styles.fabContent}>
            <GetIcon iconName="plus" color="white" size={24} />
            <Text style={styles.fabText}>
              {t('contentScreen.buttons.addTemplate', 'Add Template')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
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
  fab: {
    bottom: 16,
    right: I18nManager.isRTL ? undefined : 16,
    left: I18nManager.isRTL ? 16 : undefined,
    position: 'absolute',
    minWidth: 140,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 28,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  fabText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  fabContent: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default ContentScreen;
