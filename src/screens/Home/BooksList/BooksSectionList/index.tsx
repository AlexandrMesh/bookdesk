import React, { FC, useCallback } from 'react';
import { SectionList, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spinner } from '~UI/Spinner';
import { IDLE, PENDING } from '~constants/loadingStatuses';
import useGetImgUrl from '~hooks/useGetImgUrl';
import { LoadingType } from '~types/loadingTypes';
import { IBook } from '~types/books';
import BookItem from '../BookItem';
import ItemPlaceholder from '../ItemPlaceholder';
import styles from '../styles';

export type Props = {
  data: {
    title: string;
    count: number;
    data: IBook[];
  }[];
  loadMoreBooks: () => void;
  loadingDataStatus: LoadingType;
};

const BookList: FC<Props> = ({ data, loadMoreBooks = () => undefined, loadingDataStatus }) => {
  const { t } = useTranslation('common');
  const imgUrl = useGetImgUrl();

  const getSpinner = useCallback(
    () =>
      loadingDataStatus === PENDING && data.length > 0 ? (
        <View style={styles.listFooterComponent}>
          <Spinner />
        </View>
      ) : null,
    [loadingDataStatus, data.length],
  );

  const getEmotyListComponent = useCallback(
    () => (
      <>
        <ItemPlaceholder />
        <ItemPlaceholder />
        <ItemPlaceholder />
      </>
    ),
    [],
  );

  const renderItem = useCallback((item: { item: IBook }) => <BookItem imgUrl={imgUrl} itemStyle={styles.bookItem} bookItem={item.item} />, [imgUrl]);

  const onEndReached = useCallback(() => {
    if (data.length > 0 && loadingDataStatus !== PENDING && loadingDataStatus !== IDLE) {
      loadMoreBooks();
    }
  }, [data.length, loadingDataStatus, loadMoreBooks]);

  const renderSectionHeader = useCallback(
    (section: { section: { title: string; count: number } }) => (
      <View style={styles.stickyHeader}>
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>{section.section.title}</Text>
        </View>
        <View style={[styles.taskCount, styles.headerTitle]}>
          <Text style={styles.headerTitleText}>{t('count', { count: section.section.count })}</Text>
        </View>
      </View>
    ),
    [t],
  );

  const getKeyExtractor = useCallback((item: IBook) => item.bookId, []);

  return (
    <View style={styles.container}>
      <SectionList
        initialNumToRender={5}
        keyExtractor={getKeyExtractor}
        windowSize={11}
        maxToRenderPerBatch={20}
        sections={data}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={getSpinner}
        ListEmptyComponent={getEmotyListComponent}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
      />
    </View>
  );
};

export default BookList;
