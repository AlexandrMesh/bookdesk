import React, { useEffect } from 'react';
import { string, func, bool, number, arrayOf, shape } from 'prop-types';
import { useIsFocused } from '@react-navigation/native';
import { IDLE, PENDING, SUCCEEDED } from '~constants/loadingStatuses';
import { ALL } from '~constants/boardType';
import EmptyResults from '~screens/Home/EmptyResults';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import EmptyBoard from '../EmptyBoard';
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
  showFilters,
  activeFiltersCount,
}) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setBoardType();
    }
  }, [isFocused, setBoardType]);

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

  if (isFocused && bookList.length === 0 && loadingDataStatus === SUCCEEDED && !shouldReloadData) {
    return <EmptyResults />;
  }

  return (
    <>
      {loadingDataStatus !== IDLE && loadingDataStatus !== PENDING ? (
        <ActionBar filterParams={filterParams} activeFiltersCount={activeFiltersCount} totalItems={totalItems} showFilters={showFilters} />
      ) : null}
      {isFocused ? (
        <BooksList data={bookList} loadMoreBooks={loadMoreBooks} loadingDataStatus={loadingDataStatus} />
      ) : (
        <EmptyBoard shouldNotDisplayContent />
      )}
    </>
  );
};

AllBooks.propTypes = {
  loadingDataStatus: loadingDataStatusShape,
  loadBookList: func.isRequired,
  loadMoreBooks: func.isRequired,
  shouldReloadData: bool.isRequired,
  totalItems: number.isRequired,
  loadCategories: func.isRequired,
  setBoardType: func.isRequired,
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
  activeFiltersCount: number,
};

export default AllBooks;
