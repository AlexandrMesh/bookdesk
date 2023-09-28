import React from 'react';
import { arrayOf, shape, string, number, func } from 'prop-types';
import { Platform, UIManager, View, VirtualizedList } from 'react-native';
import { PAGE_SIZE } from '~constants/bookList';
import BookItem from './BookItem';
import styles from './styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BookList = ({ data, loadMoreBooks, showModal, selectBook }) => {
  const getItem = (data, index) => ({
    bookId: data[index].bookId,
    title: data[index].title,
    authorsList: data[index].authorsList,
    categoryValue: data[index].categoryValue,
    categoryPath: data[index].categoryPath,
    pages: data[index].pages,
    coverPath: data[index].coverPath,
    votesCount: data[index].votesCount,
    bookStatus: data[index].bookStatus,
    added: data[index].added,
  });

  return (
    <View style={styles.container}>
      {data.length > 0 && (
        <VirtualizedList
          initialNumToRender={PAGE_SIZE}
          getItemCount={() => data.length}
          getItem={getItem}
          data={data}
          renderItem={({ item }) => <BookItem bookItem={item} showModal={showModal} selectBook={selectBook} />}
          keyExtractor={(item) => item.bookId}
          onEndReached={loadMoreBooks}
          onEndReachedThreshold={0.5}
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
};

export default BookList;
