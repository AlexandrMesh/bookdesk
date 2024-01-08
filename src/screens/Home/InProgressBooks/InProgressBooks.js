import React, { useEffect } from 'react';
import { any, func, bool, number } from 'prop-types';
import { useIsFocused } from '@react-navigation/native';
import { Spinner } from '~UI/Spinner';
import EmptyBoard from '~screens/Home/EmptyBoard';
import TotalCount from '~screens/Home/ActionBar/TotalCount';
import { IDLE } from '~constants/loadingStatuses';
import { IN_PROGRESS } from '~constants/boardType';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import BooksSectionList from '../BooksList/BooksSectionList';

const InProgressBooks = ({ loadingDataStatus, loadBookList, loadMoreBooks, shouldReloadData, totalItems, setBoardType, sectionedBookListData }) => {
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

  if (loadingDataStatus === IDLE || shouldReloadData) {
    return <Spinner />;
  }
  if (sectionedBookListData.length > 0) {
    return (
      <>
        <TotalCount count={totalItems} />
        <BooksSectionList data={sectionedBookListData} loadMoreBooks={loadMoreBooks} loadingDataStatus={loadingDataStatus} />
      </>
    );
  }
  if (sectionedBookListData.length === 0) {
    return <EmptyBoard />;
  }
  return undefined;
};

InProgressBooks.propTypes = {
  loadingDataStatus: loadingDataStatusShape,
  loadBookList: func.isRequired,
  loadMoreBooks: func.isRequired,
  shouldReloadData: bool.isRequired,
  totalItems: number.isRequired,
  setBoardType: func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  sectionedBookListData: any,
};

export default InProgressBooks;
