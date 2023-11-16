import React from 'react';
import { bool, arrayOf, shape, string, number, func } from 'prop-types';
import { Platform, UIManager, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Spinner } from '~UI/Spinner';
import { PENDING, REFRESHING } from '~constants/loadingStatuses';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import BookItem from './BookItem';
import styles from './styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BookList = ({
  data,
  loadMoreBooks,
  showModal,
  selectBook,
  loadingDataStatus,
  triggerReloadBookList,
  boardType,
  horizontal,
  enablePullRefresh,
}) => {
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
          horizontal={horizontal}
          estimatedItemSize={data.length}
          data={data}
          renderItem={({ item }) => <BookItem bookItem={item} showModal={showModal} selectBook={selectBook} />}
          keyExtractor={(item) => item.bookId}
          onRefresh={() => enablePullRefresh && triggerReloadBookList(boardType, true)}
          refreshing={enablePullRefresh && loadingDataStatus === REFRESHING}
          onEndReached={loadMoreBooks}
          onEndReachedThreshold={0.5}
          ListFooterComponent={getSpinner}
        />
      )}
    </View>
  );
};

BookList.defaultProps = {
  loadMoreBooks: () => undefined,
  enablePullRefresh: true,
};

BookList.propTypes = {
  horizontal: bool,
  enablePullRefresh: bool,
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
  triggerReloadBookList: func.isRequired,
  boardType: string,
  selectBook: func.isRequired,
  loadingDataStatus: loadingDataStatusShape,
};

export default BookList;
