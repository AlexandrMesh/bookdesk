import intersection from 'lodash/intersection';
import difference from 'lodash/difference';
import { PAGE_SIZE } from '~constants/bookList';
import DataService from '~http/services/books';
import {
  deriveBookListHasNextPage,
  deriveBookListPageIndex,
  deriveBookListTotalItems,
  deriveSearchQuery,
  deriveBookListSortParams,
  deriveBookListData,
  getSearchResultsHasNextPage,
  getSearchResultsPageIndex,
  getSearchResults,
  deriveNestedCategories,
  deriveManageTopLevelCategorySelection,
  deriveFilterBookCategoryPaths,
  getCategoriesData,
  getSearchSortParams,
} from '~redux/selectors/books';
import { ALL } from '~constants/boardType';

const PREFIX = 'BOOKS';

export const SET_SEARCH_QUERY = `${PREFIX}/SET_SEARCH_QUERY`;
export const START_LOADING_SEARCH_RESULTS = `${PREFIX}/START_LOADING_SEARCH_RESULTS`;
export const LOADING_SEARCH_RESULTS_FAILED = `${PREFIX}/LOADING_SEARCH_RESULTS_FAILED`;
export const SEARCH_RESULTS_LOADED = `${PREFIX}/SEARCH_RESULTS_LOADED`;

export const BOOK_LIST_LOADED = `${PREFIX}/BOOK_LIST_LOADED`;
export const START_LOADING_BOOK_LIST = `${PREFIX}/START_LOADING_BOOK_LIST`;
export const LOADING_BOOK_LIST_FAILED = `${PREFIX}/LOADING_BOOK_LIST_FAILED`;

export const START_LOADING_USERS_BOOK_LIST = `${PREFIX}/START_LOADING_USERS_BOOK_LIST`;
export const LOADING_USERS_BOOK_LIST_FAILED = `${PREFIX}/LOADING_USERS_BOOK_LIST_FAILED`;

export const START_UPDATING_USERS_BOOK = `${PREFIX}/START_UPDATING_USERS_BOOK`;
export const USER_BOOK_UPDATED = `${PREFIX}/USER_BOOK_UPDATED`;
export const UPDATING_USERS_BOOK_FAILED = `${PREFIX}/UPDATING_USERS_BOOK_FAILED`;

export const REMOVE_BOOK = `${PREFIX}/REMOVE_BOOK`;

export const ADD_FILTER_VALUE = `${PREFIX}/ADD_FILTER_VALUE`;
export const REMOVE_FILTER_VALUE = `${PREFIX}/REMOVE_FILTER_VALUE`;
export const CLEAR_FILTERS = `${PREFIX}/CLEAR_FILTERS`;
export const POPULATE_FILTERS = `${PREFIX}/POPULATE_FILTERS`;
export const RESET_FILTER_PARAMS = `${PREFIX}/RESET_FILTER_PARAMS`;

export const SET_SORT_TYPE = `${PREFIX}/SET_SORT_TYPE`;
export const SET_SORT_DIRECTION = `${PREFIX}/SET_SORT_DIRECTION`;

export const UPDATE_BOOK = `${PREFIX}/UPDATE_BOOK`;
export const ADD_BOOK = `${PREFIX}/ADD_BOOK`;

export const UPDATE_BOOK_IN_SEARCH_RESULTS = `${PREFIX}/UPDATE_BOOK_IN_SEARCH_RESULTS`;
export const CLEAR_SEARCH_RESULTS = `${PREFIX}/CLEAR_SEARCH_RESULTS`;
export const INCREMENT_PAGE_INDEX = `${PREFIX}/INCREMENT_PAGE_INDEX`;
export const INCREMENT_SEARCH_RESULT_PAGE_INDEX = `${PREFIX}/INCREMENT_SEARCH_RESULT_PAGE_INDEX`;
export const TRIGGER_RELOAD_BOOK_LIST = `${PREFIX}/TRIGGER_RELOAD_BOOK_LIST`;
export const TRIGGER_RELOAD_SEARCH_RESULTS = `${PREFIX}/TRIGGER_RELOAD_SEARCH_RESULTS`;
export const CLEAR_BOOKS_DATA = `${PREFIX}/CLEAR_BOOKS_DATA`;

export const START_LOADING_CATEGORIES = `${PREFIX}/START_LOADING_CATEGORIES`;
export const CATEGORIES_LOADED = `${PREFIX}/CATEGORIES_LOADED`;
export const LOADING_CATEGORIES_FAILED = `${PREFIX}/LOADING_CATEGORIES_FAILED`;
export const TOGGLE_COLLAPSED_CATEGORY = `${PREFIX}/TOGGLE_COLLAPSED_CATEGORY`;
export const ADD_TO_INDETERMINATED_CATEGORIES = `${PREFIX}/ADD_TO_INDETERMINATED_CATEGORIES`;
export const CLEAR_INDETERMINATED_CATEGORIES = `${PREFIX}/CLEAR_INDETERMINATED_CATEGORIES`;

export const triggerReloadBookList = (boardType) => ({
  type: TRIGGER_RELOAD_BOOK_LIST,
  boardType,
});

export const startLoadingCategories = {
  type: START_LOADING_CATEGORIES,
};

export const loadingCategoriesFailed = {
  type: LOADING_CATEGORIES_FAILED,
};

export const categoriesLoaded = (data) => ({
  type: CATEGORIES_LOADED,
  data,
});

export const toggleCollapsedCategory = (path, boardType) => ({
  type: TOGGLE_COLLAPSED_CATEGORY,
  path,
  boardType,
});

export const addToIndeterminatedCategories = (boardType, value) => ({
  type: ADD_TO_INDETERMINATED_CATEGORIES,
  boardType,
  value,
});

export const clearIndeterminatedCategories = (boardType) => ({
  type: CLEAR_INDETERMINATED_CATEGORIES,
  boardType,
});

export const triggerReloadSearchResults = {
  type: TRIGGER_RELOAD_SEARCH_RESULTS,
};

export const clearBooksData = {
  type: CLEAR_BOOKS_DATA,
};

export const startUpdatingUsersBook = {
  type: START_UPDATING_USERS_BOOK,
};

export const incrementPageIndex = (boardType) => ({
  type: INCREMENT_PAGE_INDEX,
  boardType,
});

export const incrementSearchResultPageIndex = {
  type: INCREMENT_SEARCH_RESULT_PAGE_INDEX,
};

export const clearSearchResults = {
  type: CLEAR_SEARCH_RESULTS,
};

export const userBookUpdated = (bookId, bookStatus) => ({
  type: USER_BOOK_UPDATED,
  bookId,
  bookStatus,
});

export const updatingUsersBookFailed = {
  type: UPDATING_USERS_BOOK_FAILED,
};

export const addFilterValue = (boardType, filterParam, value) => ({
  type: ADD_FILTER_VALUE,
  boardType,
  filterParam,
  value,
});

export const removeFilterValue = (boardType, filterParam, value) => ({
  type: REMOVE_FILTER_VALUE,
  boardType,
  filterParam,
  value,
});

export const setSortType = (boardType, sortType) => ({
  type: SET_SORT_TYPE,
  boardType,
  sortType,
});

export const setSortDirection = (boardType, sortDirection) => ({
  type: SET_SORT_DIRECTION,
  boardType,
  sortDirection,
});

export const loadingSearchResultsFailed = {
  type: LOADING_SEARCH_RESULTS_FAILED,
};

export const startLoadingSearchResults = {
  type: START_LOADING_SEARCH_RESULTS,
};

export const removeBook = (id, boardType) => ({
  type: REMOVE_BOOK,
  id,
  boardType,
});

export const updateBook = (bookId, boardType, bookStatus, added) => ({
  type: UPDATE_BOOK,
  bookId,
  boardType,
  bookStatus,
  added,
});

export const updateBookInSearchResults = (bookId, boardType, bookStatus, added) => ({
  type: UPDATE_BOOK_IN_SEARCH_RESULTS,
  bookId,
  boardType,
  bookStatus,
  added,
});

export const addBook = (book, boardType) => ({
  type: ADD_BOOK,
  book,
  boardType,
});

export const setSearchQuery = (query) => (dispatch) => {
  dispatch({
    type: SET_SEARCH_QUERY,
    query,
  });
  dispatch(triggerReloadSearchResults);
};

export const searchResultsLoaded = ({ boardType, data = [], totalItems = 0, hasNextPage = false, shouldLoadMoreResults }) => ({
  type: SEARCH_RESULTS_LOADED,
  boardType,
  data,
  totalItems,
  hasNextPage,
  shouldLoadMoreResults,
});

export const bookListLoaded = ({ boardType, data = [], totalItems = 0, hasNextPage = false, shouldLoadMoreResults }) => ({
  type: BOOK_LIST_LOADED,
  boardType,
  data,
  totalItems,
  hasNextPage,
  shouldLoadMoreResults,
});

export const startLoadingBookList = (boardType) => ({
  type: START_LOADING_BOOK_LIST,
  boardType,
});

export const loadingBookListFailed = (boardType) => ({
  type: LOADING_BOOK_LIST_FAILED,
  boardType,
});

export const clearFilters = (boardType) => ({
  type: CLEAR_FILTERS,
  boardType,
});

export const populateFilters = (boardType) => ({
  type: POPULATE_FILTERS,
  boardType,
});

export const resetFilterParams = (boardType) => ({
  type: RESET_FILTER_PARAMS,
  boardType,
});

export const manageTopLevelCategorySelection = (path, boardType) => (dispatch, getState) => {
  const { shouldSelectTopLevelCategory, shouldUnselectTopLevelCategory, shouldIndeterminateTopLevelCategory, categoryPath } =
    deriveManageTopLevelCategorySelection(path, boardType)(getState()) || {};
  // if we click on the first or the second level categories we should clear indeterminate state
  dispatch(clearIndeterminatedCategories(boardType));
  if ((shouldIndeterminateTopLevelCategory || []).length > 0) {
    dispatch(addToIndeterminatedCategories(boardType, shouldIndeterminateTopLevelCategory));
  }
  if (shouldSelectTopLevelCategory) {
    dispatch(addFilterValue(boardType, 'categoryPaths', categoryPath));
  } else if (shouldUnselectTopLevelCategory) {
    dispatch(removeFilterValue(boardType, 'categoryPaths', categoryPath));
  }
};

const addAndManageFilters = (path, boardType, filterParam, value) => (dispatch) => {
  dispatch(addFilterValue(boardType, filterParam, value));
  dispatch(manageTopLevelCategorySelection(path, boardType));
};

const removeAndManageFilters = (path, boardType, filterParam, value) => (dispatch) => {
  dispatch(removeFilterValue(boardType, filterParam, value));
  dispatch(manageTopLevelCategorySelection(path, boardType));
};

export const manageFilters = (path, boardType, categoryPaths) => (dispatch, getState) => {
  const nestedCategories = deriveNestedCategories(path)(getState());
  const intersectedCategories = intersection(categoryPaths, nestedCategories);
  if (nestedCategories.length > 0) {
    if (intersectedCategories.length === nestedCategories.length && difference(nestedCategories, intersectedCategories).length === 0) {
      return dispatch(removeAndManageFilters(path, boardType, 'categoryPaths', nestedCategories));
    }
    dispatch(addAndManageFilters(path, boardType, 'categoryPaths', nestedCategories));
  } else if (categoryPaths.includes(path)) {
    return dispatch(removeAndManageFilters(path, boardType, 'categoryPaths', path));
  } else {
    return dispatch(addAndManageFilters(path, boardType, 'categoryPaths', path));
  }
  // remove if click on top level all multi selection category
  return undefined;
};

export const loadSearchResults = (shouldLoadMoreResults) => async (dispatch, getState) => {
  const state = getState();
  const pageIndex = getSearchResultsPageIndex(state);
  const searchText = deriveSearchQuery(state);
  const sortParams = getSearchSortParams(state);

  const params = {
    limit: PAGE_SIZE,
    pageIndex: shouldLoadMoreResults ? pageIndex + 1 : 0,
    boardType: ALL,
    title: searchText,
    sortType: sortParams.type,
    sortDirection: sortParams.direction,
  };
  try {
    dispatch(startLoadingSearchResults);
    const { data } = (await DataService().getBookList({ ...params })) || {};
    const { items, pagination } = data || {};
    dispatch(
      searchResultsLoaded({
        boardType: ALL,
        data: items,
        totalItems: pagination.totalItems,
        hasNextPage: pagination.hasNextPage,
        shouldLoadMoreResults,
      }),
    );
    if (!shouldLoadMoreResults) {
      dispatch(incrementSearchResultPageIndex);
    }
  } catch (error) {
    dispatch(loadingSearchResultsFailed);
  }
};

export const loadBookList =
  ({ boardType, shouldLoadMoreResults }) =>
  async (dispatch, getState) => {
    const state = getState();
    const pageIndex = deriveBookListPageIndex(boardType)(state);
    const filterParams = deriveFilterBookCategoryPaths(boardType)(state);
    const sortParams = deriveBookListSortParams(boardType)(state);

    const params = {
      pageIndex: shouldLoadMoreResults ? pageIndex + 1 : 0,
      limit: PAGE_SIZE,
      boardType,
      categoryPaths: filterParams,
      sortType: sortParams.type,
      sortDirection: sortParams.direction,
    };

    try {
      const { data } = (await DataService().getBookList({ ...params })) || {};
      const { items, pagination } = data || {};
      dispatch(
        bookListLoaded({
          boardType,
          data: items,
          totalItems: pagination.totalItems,
          hasNextPage: pagination.hasNextPage,
          shouldLoadMoreResults,
        }),
      );
      if (!shouldLoadMoreResults) {
        dispatch(incrementPageIndex(boardType));
      }
    } catch (error) {
      dispatch(loadingBookListFailed(boardType));
    }
  };

export const loadMoreBooks = (boardType) => async (dispatch, getState) => {
  const state = getState();
  const hasNextPage = deriveBookListHasNextPage(boardType)(state);
  const bookList = deriveBookListData(boardType)(state);
  try {
    if (bookList.length >= PAGE_SIZE && hasNextPage) {
      await dispatch(loadBookList({ boardType, shouldLoadMoreResults: true }));
      dispatch(incrementPageIndex(boardType));
    }
  } catch (e) {
    console.error(e);
  }
};

export const loadCategories = () => async (dispatch, getState) => {
  const categories = getCategoriesData(getState());
  if (categories.length === 0) {
    try {
      dispatch(startLoadingCategories);
      const { data } = (await DataService().getCategories()) || {};
      dispatch(categoriesLoaded(data));
    } catch (e) {
      dispatch(loadingCategoriesFailed);
    }
  }
};

export const loadMoreSearchResults = () => async (dispatch, getState) => {
  const state = getState();
  const hasNextPage = getSearchResultsHasNextPage(state);
  const bookList = getSearchResults(state);
  try {
    if (bookList.length >= PAGE_SIZE && hasNextPage) {
      await dispatch(loadSearchResults(true));
      dispatch(incrementSearchResultPageIndex);
    }
  } catch (e) {
    console.error(e);
  }
};

export const reloadBookList = (boardType) => async (dispatch, getState) => {
  const state = getState();
  const bookList = deriveBookListData(boardType)(state);
  const totalItems = deriveBookListTotalItems(boardType)(state);

  // for reloading data if we removed all items from page and we have some other items as well
  if (bookList.length === 0 && bookList.length < totalItems) {
    dispatch(triggerReloadBookList(boardType));
  }
};

export const updateUserBook =
  ({ book, newBookStatus, boardType, isCalledFromDetails }) =>
  async (dispatch) => {
    dispatch(startUpdatingUsersBook);
    const { bookId, bookStatus } = book;
    try {
      const { data } = await DataService().updateUserBook({ bookId, bookStatus: newBookStatus });
      if (isCalledFromDetails) {
        // dispatch(updateBookDetails('bookStatus', data.bookStatus));
      }
      if (boardType !== ALL) {
        dispatch(removeBook(bookId, boardType));
      }
      if (bookStatus && boardType === ALL) {
        dispatch(removeBook(bookId, bookStatus));
      }
      // It's because we don't want to refresh all books list to preserve scrolling
      dispatch(updateBook(bookId, ALL, data.bookStatus, data.added));
      dispatch(updateBookInSearchResults(bookId, ALL, data.bookStatus, data.added));

      // ставим метку о том что надо перезагрузить определенную доску где произошли изменения (добавилась книга например)
      dispatch(triggerReloadBookList(newBookStatus));

      dispatch(reloadBookList(boardType));
    } catch (e) {
      dispatch(updatingUsersBookFailed);
    }
  };
