import React, { useCallback, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import TotalCount from '~screens/Home/ActionBar/TotalCount';
import EmptyBoard from '~screens/Home/EmptyBoard';
import { IDLE, PENDING, SUCCEEDED } from '~constants/loadingStatuses';
import { PLANNED } from '~constants/boardType';
import { useAppDispatch, useAppSelector } from '~hooks';
import {
  deriveLoadingBookListStatus,
  deriveShouldReloadBookList,
  deriveBookListTotalItems,
  deriveSectionedBookListData,
} from '~redux/selectors/books';
import { loadBookList, loadMoreBooks, setBoardType } from '~redux/actions/booksActions';
import { BookStatus } from '~types/books';
import BooksSectionList from '../BooksList/BooksSectionList';

const PlannedBooks = () => {
  const isFocused = useIsFocused();

  const dispatch = useAppDispatch();
  const _loadBookList = useCallback(
    ({ boardType, shouldLoadMoreResults }: { boardType: BookStatus; shouldLoadMoreResults: boolean }) =>
      dispatch(loadBookList({ boardType, shouldLoadMoreResults })),
    [dispatch],
  );
  const _loadMoreBooks = () => dispatch(loadMoreBooks(PLANNED));
  const _setBoardType = useCallback(() => dispatch(setBoardType(PLANNED)), [dispatch]);

  const sectionedBookListData = useAppSelector(deriveSectionedBookListData(PLANNED));
  const loadingDataStatus = useAppSelector(deriveLoadingBookListStatus(PLANNED));
  const shouldReloadData = useAppSelector(deriveShouldReloadBookList(PLANNED));
  const totalItems = useAppSelector(deriveBookListTotalItems(PLANNED));

  useEffect(() => {
    if (isFocused) {
      _setBoardType();
    }
  }, [isFocused, _setBoardType]);

  useEffect(() => {
    if (isFocused && (loadingDataStatus === IDLE || shouldReloadData)) {
      _loadBookList({
        boardType: PLANNED,
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

export default PlannedBooks;
