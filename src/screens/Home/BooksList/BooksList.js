/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { bool, any, arrayOf, shape, string, number, func } from 'prop-types';
import { Platform, UIManager, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Spinner } from '~UI/Spinner';
import { PENDING } from '~constants/loadingStatuses';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import BookItem from './BookItem';
import ItemPlaceholder from './ItemPlaceholder';
import styles from './styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// eslint-disable-next-line react/display-name
const BookList = ({ data, loadMoreBooks = () => undefined, loadingDataStatus, horizontal, extraData }) => {
  const getSpinner = () =>
    loadingDataStatus === PENDING && data.length > 0 ? (
      <View style={styles.listFooterComponent}>
        <Spinner />
      </View>
    ) : null;

  return (
    <View style={styles.container}>
      <FlashList
        horizontal={horizontal}
        estimatedItemSize={210}
        data={data}
        extraData={extraData}
        renderItem={({ item }) => <BookItem bookItem={item} />}
        keyExtractor={(item) => item.bookId}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <>
            <ItemPlaceholder />
            <ItemPlaceholder />
            <ItemPlaceholder />
          </>
        }
        onEndReached={() => {
          if (loadingDataStatus !== PENDING) {
            loadMoreBooks();
          }
        }}
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
