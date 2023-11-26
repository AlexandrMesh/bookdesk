import { getNewCustomBookNameValue, getSuggestedBooksSortParams, deriveCustomBookParams, getStatus } from '~redux/selectors/customBook';
// eslint-disable-next-line import/no-cycle
import { triggerReloadBookList } from '~redux/actions/booksActions';
import { ALL } from '~constants/boardType';
import DataService from '~http/services/books';
import CustomBooksService from '~http/services/customBooks';
import i18n, { getT } from '~translations/i18n';

const PREFIX = 'CUSTOM_BOOKS';

// step 1
export const SET_NEW_CUSTOM_BOOK_NAME = `${PREFIX}/SET_NEW_CUSTOM_BOOK_NAME`;
export const SET_NEW_CUSTOM_BOOK_NAME_ERROR = `${PREFIX}/SET_NEW_CUSTOM_BOOK_NAME_ERROR`;
export const START_LOADING_SUGGESTED_BOOKS = `${PREFIX}/START_LOADING_SUGGESTED_BOOKS`;
export const LOADING_SUGGESTED_BOOKS_FAILED = `${PREFIX}/LOADING_SUGGESTED_BOOKS_FAILED`;
export const SUGGESTED_BOOKS_LOADED = `${PREFIX}/SUGGESTED_BOOKS_LOADED`;
export const CLEAR_SUGGESTED_BOOKS = `${PREFIX}/CLEAR_SUGGESTED_BOOKS`;
export const UPDATE_SUGGESTED_BOOK = `${PREFIX}/UPDATE_SUGGESTED_BOOK`;
export const UPDATE_BOOK_VOTES_IN_SUGGESTED_BOOK = `${PREFIX}/UPDATE_BOOK_VOTES_IN_SUGGESTED_BOOK`;
export const ALLOW_TO_ADD_BOOK = `${PREFIX}/ALLOW_TO_ADD_BOOK`;

// step 2
export const SET_SHOULD_ADD_COVER = `${PREFIX}/SET_SHOULD_ADD_COVER`;
export const START_LOADING_SUGGESTED_COVERS = `${PREFIX}/START_LOADING_SUGGESTED_COVERS`;
export const LOADING_SUGGESTED_COVERS_FAILED = `${PREFIX}/LOADING_SUGGESTED_COVERS_FAILED`;
export const SUGGESTED_COVERS_LOADED = `${PREFIX}/SUGGESTED_COVERS_LOADED`;
export const SELECT_COVER = `${PREFIX}/SELECT_COVER`;
export const CLEAR_STEP_2 = `${PREFIX}/CLEAR_STEP_2`;

// step 3
export const TOGGLE_EXPANDED_CATEGORY = `${PREFIX}/TOGGLE_EXPANDED_CATEGORY`;
export const SELECT_CATEGORY = `${PREFIX}/SELECT_CATEGORY`;
export const SET_STATUS = `${PREFIX}/SET_STATUS`;
export const SET_PAGES = `${PREFIX}/SET_PAGES`;
export const ADD_AUTHOR = `${PREFIX}/ADD_AUTHOR`;
export const REMOVE_AUTHOR = `${PREFIX}/REMOVE_AUTHOR`;
export const UPDATE_AUTHOR = `${PREFIX}/UPDATE_AUTHOR`;
export const SET_ANNOTATION = `${PREFIX}/SET_ANNOTATION`;
export const SET_ANNOTATION_ERROR = `${PREFIX}/SET_ANNOTATION_ERROR`;
export const CLEAR_STEP_3 = `${PREFIX}/CLEAR_STEP_3`;

// common
export const SET_SEARCH_QUERY = `${PREFIX}/SET_SEARCH_QUERY`;
export const CLEAR_CATEGORY = `${PREFIX}/CLEAR_CATEGORY`;
export const SUBMIT_CATEGORY = `${PREFIX}/SUBMIT_CATEGORY`;
export const CLEAR_ADD_CUSTOM_BOOK_STATE = `${PREFIX}/CLEAR_ADD_CUSTOM_BOOK_STATE`;
export const SET_CURRENT_STEP = `${PREFIX}/SET_CURRENT_STEP`;
export const SET_AVAILABLE_STEP = `${PREFIX}/SET_AVAILABLE_STEP`;
export const BOOK_ADDED = `${PREFIX}/BOOK_ADDED`;
export const START_ADDING_BOOK = `${PREFIX}/START_ADDING_BOOK`;
export const ADDING_BOOK_FAILED = `${PREFIX}/ADDING_BOOK_FAILED`;

export const bookAdded = {
  type: BOOK_ADDED,
};

export const startAddingBook = {
  type: START_ADDING_BOOK,
};

export const addingBookFailed = {
  type: ADDING_BOOK_FAILED,
};

export const submitCategory = {
  type: SUBMIT_CATEGORY,
};

export const clearCategory = {
  type: CLEAR_CATEGORY,
};

export const clearAddCustomBookState = {
  type: CLEAR_ADD_CUSTOM_BOOK_STATE,
};

export const clearStep2 = {
  type: CLEAR_STEP_2,
};

export const clearStep3 = {
  type: CLEAR_STEP_3,
};

export const setCurrentStep = (step) => ({
  type: SET_CURRENT_STEP,
  step,
});

export const setAvailableStep = (step) => ({
  type: SET_AVAILABLE_STEP,
  step,
});

export const addAuthor = (id) => ({
  type: ADD_AUTHOR,
  id,
});

export const setAnnotation = (annotation, error) => ({
  type: SET_ANNOTATION,
  annotation,
  error,
});

export const setAnnotationError = (error) => ({
  type: SET_ANNOTATION_ERROR,
  error,
});

export const updateAuthor = (id, name, error) => ({
  type: UPDATE_AUTHOR,
  id,
  name,
  error,
});

export const removeAuthor = (id) => ({
  type: REMOVE_AUTHOR,
  id,
});

export const setPages = (pages, error) => ({
  type: SET_PAGES,
  pages,
  error,
});

export const selectCover = (cover) => ({
  type: SELECT_COVER,
  cover,
});

export const setSearchQuery = (query) => ({
  type: SET_SEARCH_QUERY,
  query,
});

export const setShouldAddCover = (add) => ({
  type: SET_SHOULD_ADD_COVER,
  add,
});

export const setNewCustomBookName = (name, error) => ({
  type: SET_NEW_CUSTOM_BOOK_NAME,
  name,
  error,
});

export const allowToAddBook = (allow) => ({
  type: ALLOW_TO_ADD_BOOK,
  allow,
});

export const setNewCustomBookError = (error) => ({
  type: SET_NEW_CUSTOM_BOOK_NAME_ERROR,
  error,
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

export const suggestedBooksLoaded = ({ data = [], totalItems = 0, hasNextPage = false, allowToAddBook }) => ({
  type: SUGGESTED_BOOKS_LOADED,
  data,
  totalItems,
  hasNextPage,
  allowToAddBook,
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

export const selectCategory = (category) => ({
  type: SELECT_CATEGORY,
  category,
});

export const setStatus = (status) => ({
  type: SET_STATUS,
  status,
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

export const loadSuggestedBooks = (bookName) => async (dispatch, getState) => {
  const state = getState();
  if (bookName.error) {
    return false;
  }
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
      dispatch(setNewCustomBookError(getT('errors')('bookExists')));
      dispatch(allowToAddBook(false));
      dispatch(
        suggestedBooksLoaded({
          data: items || [],
          totalItems: pagination?.totalItems || 0,
          hasNextPage: pagination?.hasNextPage || false,
          allowToAddBook: false,
        }),
      );
      return getT('errors')('bookExists');
      // eslint-disable-next-line no-else-return
    } else {
      const { data } = (await DataService().getBookList({ ...params })) || {};
      const { items, pagination } = data || {};
      dispatch(allowToAddBook(true));
      dispatch(
        suggestedBooksLoaded({
          data: items || [],
          totalItems: pagination?.totalItems || 0,
          hasNextPage: pagination?.hasNextPage || false,
          allowToAddBook: true,
        }),
      );
      return null;
    }
  } catch (error) {
    dispatch(loadingSuggestedBooksFailed);
    return null;
  }
};

export const loadSuggestedCovers = () => async (dispatch, getState) => {
  const state = getState();
  const bookName = getNewCustomBookNameValue(state);
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
    dispatch(loadingSuggestedCoversFailed);
  }
};

export const addCustomBook = () => async (dispatch, getState) => {
  const { language } = i18n;
  const state = getState();
  const bookStatus = getStatus(state);
  const customBookParams = deriveCustomBookParams(state);
  const params = { ...customBookParams, language };
  try {
    dispatch(startAddingBook);
    await CustomBooksService().addCustomBook({ ...params });
    dispatch(bookAdded);
    if (bookStatus !== ALL) {
      // ставим метку о том что надо перезагрузить определенную доску где произошли изменения (добавилась книга например)
      dispatch(triggerReloadBookList(bookStatus));
    }
  } catch (error) {
    dispatch(addingBookFailed);
  }
};
