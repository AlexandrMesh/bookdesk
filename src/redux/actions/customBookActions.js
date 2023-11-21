import { getNewCustomBookName, getSuggestedBooksSortParams } from '~redux/selectors/customBook';
import { ALL } from '~constants/boardType';
import DataService from '~http/services/books';
import CustomBooksService from '~http/services/customBooks';
import i18n from '~translations/i18n';

const PREFIX = 'CUSTOM_BOOKS';

// step 1
export const SET_NEW_CUSTOM_BOOK_NAME = `${PREFIX}/SET_NEW_CUSTOM_BOOK_NAME`;
export const START_LOADING_SUGGESTED_BOOKS = `${PREFIX}/START_LOADING_SUGGESTED_BOOKS`;
export const LOADING_SUGGESTED_BOOKS_FAILED = `${PREFIX}/LOADING_SUGGESTED_BOOKS_FAILED`;
export const SUGGESTED_BOOKS_LOADED = `${PREFIX}/SUGGESTED_BOOKS_LOADED`;
export const CLEAR_SUGGESTED_BOOKS = `${PREFIX}/CLEAR_SUGGESTED_BOOKS`;
export const UPDATE_SUGGESTED_BOOK = `${PREFIX}/UPDATE_SUGGESTED_BOOK`;
export const UPDATE_BOOK_VOTES_IN_SUGGESTED_BOOK = `${PREFIX}/UPDATE_BOOK_VOTES_IN_SUGGESTED_BOOK`;
export const SET_BOOK_EXISTS = `${PREFIX}/SET_BOOK_EXISTS`;

// step 2
export const SET_SHOULD_ADD_COVER = `${PREFIX}/SET_SHOULD_ADD_COVER`;
export const START_LOADING_SUGGESTED_COVERS = `${PREFIX}/START_LOADING_SUGGESTED_COVERS`;
export const LOADING_SUGGESTED_COVERS_FAILED = `${PREFIX}/LOADING_SUGGESTED_COVERS_FAILED`;
export const SUGGESTED_COVERS_LOADED = `${PREFIX}/SUGGESTED_COVERS_LOADED`;
export const SELECT_COVER = `${PREFIX}/SELECT_COVER`;

// step 3
export const TOGGLE_EXPANDED_CATEGORY = `${PREFIX}/TOGGLE_EXPANDED_CATEGORY`;

// common
export const COMPLETE_STEP = `${PREFIX}/COMPLETE_STEP`;
export const REMOVE_COMPLETED_STEP = `${PREFIX}/REMOVE_COMPLETED_STEP`;

export const selectCover = (cover) => ({
  type: SELECT_COVER,
  cover,
});

export const setShouldAddCover = (add) => ({
  type: SET_SHOULD_ADD_COVER,
  add,
});

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

export const startLoadingSuggestedCovers = {
  type: START_LOADING_SUGGESTED_COVERS,
};

export const loadingSuggestedCoversFailed = {
  type: LOADING_SUGGESTED_COVERS_FAILED,
};

export const suggestedCoversLoaded = ({ data = [] }) => ({
  type: SUGGESTED_COVERS_LOADED,
  data,
});

export const toggleExpandedCategory = (path) => ({
  type: TOGGLE_EXPANDED_CATEGORY,
  path,
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
    if (data && items?.length > 0) {
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

export const loadSuggestedCovers = () => async (dispatch, getState) => {
  const state = getState();
  const bookName = getNewCustomBookName(state);
  const { language } = i18n;

  const params = {
    bookName,
    language,
  };

  try {
    dispatch(startLoadingSuggestedCovers);
    const { data } = (await CustomBooksService().getSuggestCoversList({ ...params })) || {};
    const { items } = data || {};
    dispatch(
      suggestedCoversLoaded({
        data: items || [],
      }),
    );
  } catch (error) {
    console.log(error, 'error');
    dispatch(loadingSuggestedCoversFailed);
  }
};
