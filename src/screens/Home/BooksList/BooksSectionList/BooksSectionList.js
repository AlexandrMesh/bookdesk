import React, { useCallback } from 'react';
import { arrayOf, shape, string, number, func } from 'prop-types';
import { SectionList, Platform, UIManager, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spinner } from '~UI/Spinner';
import { PENDING } from '~constants/loadingStatuses';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import useGetImgUrl from '~hooks/useGetImgUrl';
import BookItem from '../BookItem';
import ItemPlaceholder from '../ItemPlaceholder';
import styles from '../styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BookList = ({ data, loadMoreBooks = () => undefined, showModal, selectBook, loadingDataStatus }) => {
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

  const renderItem = useCallback(
    ({ item }) => <BookItem imgUrl={imgUrl} itemStyle={styles.bookItem} bookItem={item} showModal={showModal} selectBook={selectBook} />,
    [selectBook, showModal, imgUrl],
  );

  const onEndReached = useCallback(() => {
    if (loadingDataStatus !== PENDING) {
      loadMoreBooks();
    }
  }, [loadingDataStatus, loadMoreBooks]);

  const renderSectionHeader = useCallback(
    ({ section }) => (
      <View style={styles.stickyHeader}>
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>{section.title}</Text>
        </View>
        <View style={[styles.taskCount, styles.headerTitle]}>
          <Text style={styles.headerTitleText}>{t('count', { count: section.count })}</Text>
        </View>
      </View>
    ),
    [t],
  );

  const getKeyExtractor = useCallback((item) => item.bookId, []);

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

BookList.propTypes = {
  data: arrayOf(
    shape({
      _id: string,
      bookId: string,
      title: string,
      authorsList: arrayOf(string),
      bookStatus: string,
      categoryPath: string,
      coverPath: string,
      votesCount: number,
      status: string,
      added: number,
    }),
  ).isRequired,
  loadMoreBooks: func,
  showModal: func.isRequired,
  selectBook: func.isRequired,
  loadingDataStatus: loadingDataStatusShape,
};

export default BookList;
