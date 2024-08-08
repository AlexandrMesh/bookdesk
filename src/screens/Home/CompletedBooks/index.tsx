import React, { useCallback, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import TotalCount from '~screens/Home/ActionBar/TotalCount';
import EmptyBoard from '~screens/Home/EmptyBoard';
import { IDLE, SUCCEEDED, PENDING } from '~constants/loadingStatuses';
import {
  deriveLoadingBookListStatus,
  deriveShouldReloadBookList,
  deriveBookListTotalItems,
  deriveSectionedBookListData,
} from '~redux/selectors/books';
import { loadBookList, loadMoreBooks, setBoardType } from '~redux/actions/booksActions';
import { COMPLETED } from '~constants/boardType';
import { BookStatus } from '~types/books';
import { useAppDispatch, useAppSelector } from '~hooks';
import BooksSectionList from '../BooksList/BooksSectionList';

const CompletedBooks = () => {
  const isFocused = useIsFocused();

  const dispatch = useAppDispatch();
  const _loadBookList = useCallback(
    ({ boardType, shouldLoadMoreResults }: { boardType: BookStatus; shouldLoadMoreResults: boolean }) =>
      dispatch(loadBookList({ boardType, shouldLoadMoreResults })),
    [dispatch],
  );
  const _loadMoreBooks = useCallback(() => dispatch(loadMoreBooks(COMPLETED)), [dispatch]);
  const _setBoardType = useCallback(() => dispatch(setBoardType(COMPLETED)), [dispatch]);

  const sectionedBookListData = useAppSelector(deriveSectionedBookListData(COMPLETED));
  const loadingDataStatus = useAppSelector(deriveLoadingBookListStatus(COMPLETED));
  const shouldReloadData = useAppSelector(deriveShouldReloadBookList(COMPLETED));
  const totalItems = useAppSelector(deriveBookListTotalItems(COMPLETED));

  useEffect(() => {
    if (isFocused) {
      _setBoardType();
    }
  }, [isFocused, _setBoardType]);

  useEffect(() => {
    if (isFocused && (loadingDataStatus === IDLE || shouldReloadData)) {
      _loadBookList({
        boardType: COMPLETED,
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

export default CompletedBooks;
