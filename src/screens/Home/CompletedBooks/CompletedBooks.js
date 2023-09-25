import React, { useEffect } from 'react';
import { string, func, bool, number, arrayOf, shape } from 'prop-types';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Spinner from '~UI/Spinner';
import TotalCount from '~screens/Home/ActionBar/TotalCount';
import EmptyBoard from '~screens/Home/EmptyBoard';
import { IDLE } from '~constants/loadingStatuses';
import { COMPLETED } from '~constants/boardType';
import BooksList from '../BooksList';

const CompletedBooks = ({ loadingDataStatus, loadBookList, bookList, loadMoreBooks, shouldReloadData, totalItems }) => {
  const isFocused = useIsFocused();
  const { t } = useTranslation('common');

  useEffect(() => {
    if (isFocused && (loadingDataStatus === IDLE || shouldReloadData)) {
      loadBookList({
        boardType: COMPLETED,
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
        <BooksList data={bookList} loadMoreBooks={loadMoreBooks} boardType={COMPLETED} />
      </>
    );
  }
  if (bookList.length === 0) {
    return <EmptyBoard />;
  }
  return undefined;
};

CompletedBooks.propTypes = {
  loadingDataStatus: string.isRequired,
  loadBookList: func.isRequired,
  loadMoreBooks: func.isRequired,
  shouldReloadData: bool.isRequired,
  totalItems: number.isRequired,
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

export default CompletedBooks;
