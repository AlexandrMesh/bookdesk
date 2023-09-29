import React from 'react';
import { arrayOf, shape, string, number, func } from 'prop-types';
import { Platform, UIManager, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Spinner } from '~UI/Spinner';
import { PENDING } from '~constants/loadingStatuses';
import BookItem from './BookItem';
import styles from './styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BookList = ({ data, loadMoreBooks, showModal, selectBook, loadingDataStatus }) => {
  const getSpinner = () =>
    loadingDataStatus === PENDING ? (
      <View style={styles.listFooterComponent}>
        <Spinner />
      </View>
    ) : null;

  return (
    <View style={styles.container}>
      {data.length > 0 && (
        <FlashList
          estimatedItemSize={data.length}
          data={data}
          renderItem={({ item }) => <BookItem bookItem={item} showModal={showModal} selectBook={selectBook} />}
          keyExtractor={(item) => item.bookId}
          onEndReached={loadMoreBooks}
          onEndReachedThreshold={0.5}
          ListFooterComponent={getSpinner}
        />
      )}
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
  loadMoreBooks: func.isRequired,
  showModal: func.isRequired,
  selectBook: func.isRequired,
  loadingDataStatus: string.isRequired,
};

export default BookList;
