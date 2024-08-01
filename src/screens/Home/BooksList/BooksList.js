/* eslint-disable react/forbid-prop-types */
import React, { useCallback } from 'react';
import { bool, any, arrayOf, shape, string, number, func } from 'prop-types';
import { Platform, UIManager, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Spinner } from '~UI/Spinner';
import { PENDING } from '~constants/loadingStatuses';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import useGetImgUrl from '~hooks/useGetImgUrl';
import BookItem from './BookItem';
import ItemPlaceholder from './ItemPlaceholder';
import styles from './styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BookList = ({ data, loadMoreBooks = () => undefined, loadingDataStatus, horizontal, extraData }) => {
  const imgUrl = useGetImgUrl();
  const getSpinner = useCallback(
    () =>
      loadingDataStatus === PENDING && data.length > 0 ? (
        <View style={styles.listFooterComponent}>
          <Spinner />
        </View>
      ) : null,
    [data.length, loadingDataStatus],
  );

  const getListEmptyComponent = useCallback(
    () => (
      <>
        <ItemPlaceholder />
        <ItemPlaceholder />
        <ItemPlaceholder />
      </>
    ),
    [],
  );

  const onEndReached = useCallback(() => {
    if (loadingDataStatus !== PENDING) {
      loadMoreBooks();
    }
  }, [loadMoreBooks, loadingDataStatus]);

  const getKeyExtractor = useCallback((item) => item.bookId, []);

  const renderItem = useCallback(({ item }) => <BookItem imgUrl={imgUrl} bookItem={item} />, [imgUrl]);

  return (
    <View style={styles.container}>
      <FlashList
        horizontal={horizontal}
        estimatedItemSize={210}
        data={data}
        extraData={extraData}
        renderItem={renderItem}
        keyExtractor={getKeyExtractor}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={getListEmptyComponent}
        onEndReached={onEndReached}
        ListFooterComponent={getSpinner}
      />
    </View>
  );
};

BookList.propTypes = {
  horizontal: bool,
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
  extraData: any,
  loadingDataStatus: loadingDataStatusShape,
};

export default BookList;
