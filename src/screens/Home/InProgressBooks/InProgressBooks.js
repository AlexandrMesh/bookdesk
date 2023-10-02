import React, { useEffect } from 'react';
import { string, func, bool, number, arrayOf, shape } from 'prop-types';
import { useIsFocused } from '@react-navigation/native';
import { Spinner } from '~UI/Spinner';
import EmptyBoard from '~screens/Home/EmptyBoard';
import TotalCount from '~screens/Home/ActionBar/TotalCount';
import { IDLE } from '~constants/loadingStatuses';
import { IN_PROGRESS } from '~constants/boardType';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import BooksList from '../BooksList';

const InProgressBooks = ({
  loadingDataStatus,
  loadBookList,
  bookList,
  totalItems,
  loadMoreBooks,
  shouldReloadData,
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
        boardType: IN_PROGRESS,
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
        <BooksList data={bookList} loadMoreBooks={loadMoreBooks} boardType={IN_PROGRESS} loadingDataStatus={loadingDataStatus} />
      </>
    );
  }
  if (bookList.length === 0) {
    return <EmptyBoard />;
  }
  return undefined;
};

InProgressBooks.propTypes = {
  loadingDataStatus: loadingDataStatusShape,
  loadBookList: func.isRequired,
  loadMoreBooks: func.isRequired,
  shouldReloadData: bool.isRequired,
  shouldReloadWithPullRefresh: bool,
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
  totalItems: number.isRequired,
};

export default InProgressBooks;
