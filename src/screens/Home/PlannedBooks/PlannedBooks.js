import React, { useEffect } from 'react';
import { any, func, bool, number } from 'prop-types';
import { useIsFocused } from '@react-navigation/native';
import TotalCount from '~screens/Home/ActionBar/TotalCount';
import EmptyBoard from '~screens/Home/EmptyBoard';
import { IDLE, PENDING, SUCCEEDED } from '~constants/loadingStatuses';
import { PLANNED } from '~constants/boardType';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import BooksSectionList from '../BooksList/BooksSectionList';

const PlannedBooks = ({ loadingDataStatus, loadBookList, loadMoreBooks, shouldReloadData, totalItems, setBoardType, sectionedBookListData }) => {
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

  if (sectionedBookListData.length === 0 && loadingDataStatus === SUCCEEDED && !shouldReloadData) {
    return <EmptyBoard />;
  }

  return isFocused ? (
    <>
      {loadingDataStatus !== IDLE && loadingDataStatus !== PENDING ? <TotalCount count={totalItems} /> : null}
      <BooksSectionList data={sectionedBookListData} loadMoreBooks={loadMoreBooks} loadingDataStatus={loadingDataStatus} />
    </>
  ) : (
    <EmptyBoard shouldNotDisplayContent />
  );
};

PlannedBooks.propTypes = {
  loadingDataStatus: loadingDataStatusShape,
  loadBookList: func.isRequired,
  loadMoreBooks: func.isRequired,
  shouldReloadData: bool.isRequired,
  totalItems: number.isRequired,
  setBoardType: func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  sectionedBookListData: any,
};

export default PlannedBooks;
