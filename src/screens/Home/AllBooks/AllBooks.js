import React, { useEffect } from 'react';
import { string, func, bool, number, arrayOf, shape } from 'prop-types';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { IDLE } from '~constants/loadingStatuses';
import { ALL } from '~constants/boardType';
import EmptyResults from '~screens/Home/EmptyResults';
import Spinner from '~UI/Spinner';
import ActionBar from '../ActionBar/ActionBar';
import BooksList from '../BooksList';

const AllBooks = ({
  loadingDataStatus,
  loadBookList,
  loadMoreBooks,
  bookList,
  filterParams,
  editableFilterParams,
  shouldReloadData,
  totalItems,
  loadCategories,
  resetFilterParams,
}) => {
  const isFocused = useIsFocused();
  const { t } = useTranslation(['books', 'common']);

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
  }, [loadingDataStatus, shouldReloadData, isFocused]);

  if (loadingDataStatus === IDLE || shouldReloadData) {
    return <Spinner label={t('common:loadingData')} />;
  }

  if (bookList.length > 0) {
    return (
      <>
        <ActionBar
          filterParams={filterParams}
          editableFilterParams={editableFilterParams}
          boardType={ALL}
          totalItems={totalItems}
          resetFilterParams={resetFilterParams}
        />
        <BooksList boardType={ALL} data={bookList} loadMoreBooks={loadMoreBooks} />
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
  resetFilterParams: func.isRequired,
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
  editableFilterParams: shape({
    categoryPaths: arrayOf(string),
  }),
};

export default AllBooks;
