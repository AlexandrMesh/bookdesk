import { getNewCustomBookName, getSuggestedBooksSortParams } from '~redux/selectors/customBook';
import { ALL } from '~constants/boardType';
import DataService from '~http/services/books';
import i18n from '~translations/i18n';

const PREFIX = 'CUSTOM_BOOKS';

export const SET_NEW_CUSTOM_BOOK_NAME = `${PREFIX}/SET_NEW_CUSTOM_BOOK_NAME`;
export const START_LOADING_SUGGESTED_BOOKS = `${PREFIX}/START_LOADING_SUGGESTED_BOOKS`;
export const LOADING_SUGGESTED_BOOKS_FAILED = `${PREFIX}/LOADING_SUGGESTED_BOOKS_FAILED`;
export const SUGGESTED_BOOKS_LOADED = `${PREFIX}/SUGGESTED_BOOKS_LOADED`;
export const CLEAR_SUGGESTED_BOOKS = `${PREFIX}/CLEAR_SUGGESTED_BOOKS`;
export const UPDATE_SUGGESTED_BOOK = `${PREFIX}/UPDATE_SUGGESTED_BOOK`;
export const UPDATE_BOOK_VOTES_IN_SUGGESTED_BOOK = `${PREFIX}/UPDATE_BOOK_VOTES_IN_SUGGESTED_BOOK`;

export const SET_BOOK_EXISTS = `${PREFIX}/SET_BOOK_EXISTS`;

export const COMPLETE_STEP = `${PREFIX}/COMPLETE_STEP`;
export const REMOVE_COMPLETED_STEP = `${PREFIX}/REMOVE_COMPLETED_STEP`;

export const completeStep = (step) => ({
  type: COMPLETE_STEP,
  step,
});

export const removeCompletedStep = (step) => ({
  type: REMOVE_COMPLETED_STEP,
  step,
});

export const setNewCustomBookName = (name) => ({
  type: SET_NEW_CUSTOM_BOOK_NAME,
  name,
});

export const setBookExists = (bookExists) => ({
  type: SET_BOOK_EXISTS,
  bookExists,
});

export const clearSuggestedBooks = {
  type: CLEAR_SUGGESTED_BOOKS,
};

export const startLoadingSuggestedBooks = {
  type: START_LOADING_SUGGESTED_BOOKS,
};

export const loadingSuggestedBooksFailed = {
  type: LOADING_SUGGESTED_BOOKS_FAILED,
};

export const suggestedBooksLoaded = ({ data = [], totalItems = 0, hasNextPage = false }) => ({
  type: SUGGESTED_BOOKS_LOADED,
  data,
  totalItems,
  hasNextPage,
});

export const updateSuggestedBook = (bookId, bookStatus, added) => ({
  type: UPDATE_SUGGESTED_BOOK,
  bookId,
  bookStatus,
  added,
});

export const updateBookVotesInSuggestedBook = (bookId, votesCount) => ({
  type: UPDATE_BOOK_VOTES_IN_SUGGESTED_BOOK,
  bookId,
  votesCount,
});

export const loadSuggestedBooks = () => async (dispatch, getState) => {
  const state = getState();
  const bookName = getNewCustomBookName(state);
  const sortParams = getSuggestedBooksSortParams(state);
  const { language } = i18n;

  const params = {
    limit: 10,
    pageIndex: 0,
    boardType: ALL,
    title: bookName,
    sortType: sortParams.type,
    sortDirection: sortParams.direction,
    language,
  };

  try {
    dispatch(startLoadingSuggestedBooks);
    const { data } = (await DataService().getBookList({ ...params, exact: true })) || {};
    const { items, pagination } = data || {};
    if (data && items.length > 0) {
      dispatch(setBookExists(true));
      dispatch(
        suggestedBooksLoaded({
          data: items || [],
          totalItems: pagination?.totalItems || 0,
          hasNextPage: pagination?.hasNextPage || false,
        }),
      );
    } else {
      const { data } = (await DataService().getBookList({ ...params })) || {};
      const { items, pagination } = data || {};
      dispatch(
        suggestedBooksLoaded({
          data: items || [],
          totalItems: pagination?.totalItems || 0,
          hasNextPage: pagination?.hasNextPage || false,
        }),
      );
    }
  } catch (error) {
    dispatch(loadingSuggestedBooksFailed);
  }
};
