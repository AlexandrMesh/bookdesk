import React, { useEffect } from 'react';
import { string, func, bool, number, arrayOf, shape } from 'prop-types';
import { useIsFocused } from '@react-navigation/native';
import { IDLE } from '~constants/loadingStatuses';
import { ALL } from '~constants/boardType';
import EmptyResults from '~screens/Home/EmptyResults';
import { Spinner } from '~UI/Spinner';
import ActionBar from '../ActionBar/ActionBar';
import BooksList from '../BooksList';

const AllBooks = ({
  loadingDataStatus,
  loadBookList,
  loadMoreBooks,
  bookList,
  filterParams,
  shouldReloadData,
  totalItems,
  loadCategories,
  setBoardType,
  clearBoardType,
  showFilters,
}) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setBoardType();
    } else {
      clearBoardType();
    }
  }, [isFocused, setBoardType, clearBoardType]);

  useEffect(() => {
    if (isFocused && (loadingDataStatus === IDLE || shouldReloadData)) {
      const loadData = async () => {
        await loadCategories();
        loadBookList({
          boardType: ALL,
          shouldLoadMoreResults: false,
        });
      };
      loadData();
    }
  }, [loadCategories, loadBookList, loadingDataStatus, shouldReloadData, isFocused]);

  if (loadingDataStatus === IDLE || shouldReloadData) {
    return <Spinner />;
  }

  if (bookList.length > 0) {
    return (
      <>
        <ActionBar filterParams={filterParams} totalItems={totalItems} showFilters={showFilters} />
        <BooksList boardType={ALL} data={bookList} loadMoreBooks={loadMoreBooks} loadingDataStatus={loadingDataStatus} />
      </>
    );
  }
  if (bookList.length === 0) {
    return <EmptyResults />;
  }
  return undefined;
};

AllBooks.propTypes = {
  loadingDataStatus: string.isRequired,
  loadBookList: func.isRequired,
  loadMoreBooks: func.isRequired,
  shouldReloadData: bool.isRequired,
  totalItems: number.isRequired,
  loadCategories: func.isRequired,
  setBoardType: func.isRequired,
  clearBoardType: func.isRequired,
  bookList: arrayOf(
    shape({
      _id: string,
      title: string,
      categoryPath: string,
      coverPath: string,
      votesCount: number,
      type: string,
    }),
  ).isRequired,
  filterParams: shape({
    categoryPaths: arrayOf(string),
  }),
  showFilters: func.isRequired,
};

export default AllBooks;
