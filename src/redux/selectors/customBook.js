import { createSelector } from 'reselect';
import { SUCCEEDED } from '~constants/loadingStatuses';

const getCustomBook = (state) => state.customBook;
const getAddCustomBook = (state) => getCustomBook(state).add;
const getSuggestedBooks = (state) => getAddCustomBook(state).suggestedBooks;
const getSuggestedBooksPagination = (state) => getSuggestedBooks(state).pagination;

export const getNewCustomBookName = (state) => getAddCustomBook(state).name;
export const getBookExists = (state) => getAddCustomBook(state).bookExists;
export const getCompletedSteps = (state) => getAddCustomBook(state).completedSteps;
export const getSuggestedBooksSortParams = (state) => getSuggestedBooks(state).sortParams;
export const getSuggestedBooksData = (state) => getSuggestedBooks(state).data;
export const getSuggestedBooksLoadingStatus = (state) => getSuggestedBooks(state).loadingDataStatus;
export const getSuggestedBooksTotalItems = (state) => getSuggestedBooksPagination(state).totalItems;

export const deriveAllowsNextActionInTheStep1 = createSelector(
  [getBookExists, getNewCustomBookName, getSuggestedBooksLoadingStatus],
  (bookExists, bookName, loadingDataStatus) => !bookExists && !!bookName && loadingDataStatus === SUCCEEDED,
);

export const deriveIsStepCompleted = (step) => createSelector([getCompletedSteps], (completedSteps) => completedSteps.includes(step));
