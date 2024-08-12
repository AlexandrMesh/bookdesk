import React, { FC, useCallback } from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Spinner } from '~UI/Spinner';
import { IDLE, PENDING } from '~constants/loadingStatuses';
import useGetImgUrl from '~hooks/useGetImgUrl';
import { IBook } from '~types/books';
import { LoadingType } from '~types/loadingTypes';
import BookItem from './BookItem';
import ItemPlaceholder from './ItemPlaceholder';
import styles from './styles';

export type Props = {
  horizontal?: boolean;
  data: IBook[];
  loadMoreBooks?: () => void;
  loadingDataStatus: LoadingType;
};

const BookList: FC<Props> = ({ data, loadMoreBooks = () => undefined, loadingDataStatus, horizontal }) => {
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
    if (data.length > 0 && loadingDataStatus !== PENDING && loadingDataStatus !== IDLE) {
      loadMoreBooks();
    }
  }, [data.length, loadMoreBooks, loadingDataStatus]);

  const getKeyExtractor = useCallback((item: IBook) => item.bookId, []);

  const renderItem = useCallback((item: { item: IBook }) => <BookItem imgUrl={imgUrl} bookItem={item.item} />, [imgUrl]);

  return (
    <View style={styles.container}>
      <FlashList
        horizontal={horizontal}
        estimatedItemSize={210}
        data={data}
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

export default BookList;
