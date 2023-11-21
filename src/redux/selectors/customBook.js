import { createSelector } from 'reselect';
import { SUCCEEDED } from '~constants/loadingStatuses';

const getCustomBook = (state) => state.customBook;
const getAddCustomBook = (state) => getCustomBook(state).add;
const getAddCustomBookSteps = (state) => getAddCustomBook(state).steps;
const getAddCustomBookStep1 = (state) => getAddCustomBookSteps(state)[1];
const getAddCustomBookStep2 = (state) => getAddCustomBookSteps(state)[2];
const getSuggestedBooks = (state) => getAddCustomBookStep1(state).suggestedBooks;
const getSuggestedBooksPagination = (state) => getSuggestedBooks(state).pagination;

export const getCompletedSteps = (state) => getAddCustomBook(state).completedSteps;

// step 1
export const getNewCustomBookName = (state) => getAddCustomBookStep1(state).name;
export const getBookExists = (state) => getAddCustomBookStep1(state).bookExists;
export const getSuggestedBooksSortParams = (state) => getSuggestedBooks(state).sortParams;
export const getSuggestedBooksData = (state) => getSuggestedBooks(state).data;
export const getSuggestedBooksLoadingStatus = (state) => getSuggestedBooks(state).loadingDataStatus;
export const getSuggestedBooksTotalItems = (state) => getSuggestedBooksPagination(state).totalItems;

// step 2
export const getShouldAddCover = (state) => getAddCustomBookStep2(state).shouldAddCover;
export const getSuggestedCovers = (state) => getAddCustomBookStep2(state).suggestedCovers;
export const getSelectedCover = (state) => getAddCustomBookStep2(state).selectedCover;
export const getSuggestedCoversData = (state) => getSuggestedCovers(state).data;
export const getSuggestedCoversLoadingDataStatus = (state) => getSuggestedCovers(state).loadingDataStatus;

export const deriveAllowsNextActionInTheStep1 = createSelector(
  [getBookExists, getNewCustomBookName, getSuggestedBooksLoadingStatus],
  (bookExists, bookName, loadingDataStatus) => !bookExists && !!bookName && loadingDataStatus === SUCCEEDED,
);

export const deriveAllowsNextActionInTheStep2 = createSelector(
  [getShouldAddCover, getSelectedCover, getSuggestedBooksLoadingStatus],
  (shouldAddCover, selectedCover) => shouldAddCover === false || (shouldAddCover === true && !!selectedCover),
);

export const deriveIsStepCompleted = (step) => createSelector([getCompletedSteps], (completedSteps) => completedSteps.includes(step));
