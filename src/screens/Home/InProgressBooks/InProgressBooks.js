import React, { useEffect } from 'react';
import { string, func, bool, number, arrayOf, shape } from 'prop-types';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Spinner from '~UI/Spinner';
import EmptyBoard from '~screens/Home/EmptyBoard';
import TotalCount from '~screens/Home/ActionBar/TotalCount';
import { IDLE } from '~constants/loadingStatuses';
import { IN_PROGRESS } from '~constants/boardType';
import BooksList from '../BooksList';

const InProgressBooks = ({ loadingDataStatus, loadBookList, bookList, totalItems, loadMoreBooks, shouldReloadData }) => {
  const isFocused = useIsFocused();
  const { t } = useTranslation('common');

  useEffect(() => {
    if (isFocused && (loadingDataStatus === IDLE || shouldReloadData)) {
      loadBookList({
        boardType: IN_PROGRESS,
        shouldLoadMoreResults: false,
      });
    }
  }, [loadingDataStatus, shouldReloadData, isFocused]);

  if (loadingDataStatus === IDLE || shouldReloadData) {
    return <Spinner label={t('loadingData')} />;
  }
  if (bookList.length > 0) {
    return (
      <>
        <TotalCount count={totalItems} />
        <BooksList data={bookList} loadMoreBooks={loadMoreBooks} boardType={IN_PROGRESS} />
      </>
    );
  }
  if (bookList.length === 0) {
    return <EmptyBoard />;
  }
  return undefined;
};

InProgressBooks.propTypes = {
  loadingDataStatus: string.isRequired,
  loadBookList: func.isRequired,
  loadMoreBooks: func.isRequired,
  shouldReloadData: bool.isRequired,
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
