import React, { useEffect } from 'react';
import { func, string, bool, number, arrayOf, shape } from 'prop-types';
import { useIsFocused } from '@react-navigation/native';
import { Spinner } from '~UI/Spinner';
import TotalCount from '~screens/Home/ActionBar/TotalCount';
import EmptyBoard from '~screens/Home/EmptyBoard';
import { IDLE } from '~constants/loadingStatuses';
import { PLANNED } from '~constants/boardType';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import BooksList from '../BooksList';

const PlannedBooks = ({
  loadingDataStatus,
  loadBookList,
  bookList,
  loadMoreBooks,
  shouldReloadData,
  totalItems,
  setBoardType,
  shouldReloadWithPullRefresh,
}) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setBoardType();
    }
  }, [isFocused, setBoardType]);

  useEffect(() => {
    if (isFocused && (loadingDataStatus === IDLE || shouldReloadData)) {
      loadBookList({
        boardType: PLANNED,
        shouldLoadMoreResults: false,
      });
    }
  }, [loadBookList, loadingDataStatus, shouldReloadData, isFocused]);

  if (!shouldReloadWithPullRefresh && (loadingDataStatus === IDLE || shouldReloadData)) {
    return <Spinner />;
  }
  if (bookList.length > 0) {
    return (
      <>
        <TotalCount count={totalItems} />
        <BooksList data={bookList} loadMoreBooks={loadMoreBooks} boardType={PLANNED} loadingDataStatus={loadingDataStatus} />
      </>
    );
  }
  if (bookList.length === 0) {
    return <EmptyBoard />;
  }
  return undefined;
};

PlannedBooks.propTypes = {
  loadingDataStatus: loadingDataStatusShape,
  loadBookList: func.isRequired,
  loadMoreBooks: func.isRequired,
  shouldReloadData: bool.isRequired,
  shouldReloadWithPullRefresh: bool,
  totalItems: number.isRequired,
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
};

export default PlannedBooks;
