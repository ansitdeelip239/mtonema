import React from 'react';
import {FlatList, RefreshControl, StyleSheet} from 'react-native';
import {ContentTemplate} from '../../../../types';
import Colors from '../../../../constants/Colors';
import ContentTemplateCard from './ContentTemplateCard';
import ContentEmptyState from './ContentEmptyState';
import ContentLoadingIndicator from './ContentLoadingIndicator';

interface ContentTemplatesListProps {
  data: ContentTemplate[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onScroll?: (event: any) => void; // Add onScroll prop
  onTemplatePress?: (item: ContentTemplate) => void;
  onTemplateView?: (item: ContentTemplate) => void;
  onTemplateEdit?: (item: ContentTemplate) => void;
}

const ContentTemplatesList: React.FC<ContentTemplatesListProps> = ({
  data,
  loading: _loading,
  refreshing,
  loadingMore,
  onRefresh,
  onLoadMore,
  onScroll,
  onTemplatePress,
  onTemplateEdit,
}) => {
  const renderContentTemplate = ({item}: {item: ContentTemplate}) => (
    <ContentTemplateCard
      item={item}
      onPress={onTemplatePress}
      onEdit={onTemplateEdit}
    />
  );

  const renderLoadingMore = () => {
    if (!loadingMore) {
      return null;
    }
    return <ContentLoadingIndicator type="loadMore" />;
  };

  return (
    <FlatList
      data={data}
      renderItem={renderContentTemplate}
      keyExtractor={item => item.id.toString()}
      ListEmptyComponent={<ContentEmptyState />}
      ListFooterComponent={renderLoadingMore}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.MT_PRIMARY_1]}
          tintColor={Colors.MT_PRIMARY_1}
        />
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      onScroll={onScroll} // Add onScroll prop to FlatList
      scrollEventThrottle={16} // Add throttling for smooth animation
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.listContainer,
        data.length === 0 && styles.emptyListContainer,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flex: 1,
  },
});

export default ContentTemplatesList;
