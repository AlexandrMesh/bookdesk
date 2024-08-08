import React, { useCallback, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import EmptyBoard from '~screens/Home/EmptyBoard';
import TotalCount from '~screens/Home/ActionBar/TotalCount';
import { IDLE, PENDING, SUCCEEDED } from '~constants/loadingStatuses';
import { IN_PROGRESS } from '~constants/boardType';
import { useAppDispatch, useAppSelector } from '~hooks';
import {
  deriveLoadingBookListStatus,
  deriveBookListTotalItems,
  deriveShouldReloadBookList,
  deriveSectionedBookListData,
} from '~redux/selectors/books';
import { loadBookList, loadMoreBooks, setBoardType } from '~redux/actions/booksActions';
import { BookStatus } from '~types/books';
import BooksSectionList from '../BooksList/BooksSectionList';

const InProgressBooks = () => {
  const isFocused = useIsFocused();

  const dispatch = useAppDispatch();
  const _loadBookList = useCallback(
    ({ boardType, shouldLoadMoreResults }: { boardType: BookStatus; shouldLoadMoreResults: boolean }) =>
      dispatch(loadBookList({ boardType, shouldLoadMoreResults })),
    [dispatch],
  );
  const _loadMoreBooks = () => dispatch(loadMoreBooks(IN_PROGRESS));
  const _setBoardType = useCallback(() => dispatch(setBoardType(IN_PROGRESS)), [dispatch]);

  const sectionedBookListData = useAppSelector(deriveSectionedBookListData(IN_PROGRESS));
  const loadingDataStatus = useAppSelector(deriveLoadingBookListStatus(IN_PROGRESS));
  const shouldReloadData = useAppSelector(deriveShouldReloadBookList(IN_PROGRESS));
  const totalItems = useAppSelector(deriveBookListTotalItems(IN_PROGRESS));

  useEffect(() => {
    if (isFocused) {
      _setBoardType();
    }
  }, [isFocused, _setBoardType]);

  useEffect(() => {
    if (isFocused && (loadingDataStatus === IDLE || shouldReloadData)) {
      _loadBookList({
        boardType: IN_PROGRESS,
        shouldLoadMoreResults: false,
      });
    }
  }, [_loadBookList, loadingDataStatus, shouldReloadData, isFocused]);

  if (sectionedBookListData.length === 0 && loadingDataStatus === SUCCEEDED && !shouldReloadData) {
    return <EmptyBoard />;
  }

  return (
    <>
      {loadingDataStatus !== IDLE && loadingDataStatus !== PENDING ? <TotalCount count={totalItems} /> : null}
      <BooksSectionList data={sectionedBookListData} loadMoreBooks={_loadMoreBooks} loadingDataStatus={loadingDataStatus} />
    </>
  );
};

export default InProgressBooks;
