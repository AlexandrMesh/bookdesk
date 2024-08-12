import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import intersection from 'lodash/intersection';
import difference from 'lodash/difference';
import isEmpty from 'lodash/isEmpty';
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
  getSearchQuery,
  getBookDetailsData,
  getShouldReloadCategories,
  getBookToUpdate,
} from '~redux/selectors/books';

import { updateSuggestedBook, updateBookVotesInSuggestedBook } from '~redux/actions/customBookActions';
import { triggerReloadStat } from '~redux/actions/statisticActions';
import { ALL } from '~constants/boardType';
import i18n from '~translations/i18n';
import { BookStatus, IBook, IComment, IRating, IVote } from '~types/books';
import { AppThunkAPI } from '~redux/store/configureStore';

const PREFIX = 'BOOKS';

export const clearBookComment = createAction(`${PREFIX}/clearBookComment`);
export const startLoadingBookComment = createAction(`${PREFIX}/startLoadingBookComment`);
export const loadingBookCommentFailed = createAction(`${PREFIX}/loadingBookCommentFailed`);
export const startUpdatingUserBookRating = createAction(`${PREFIX}/startUpdatingUserBookRating`);
export const updatingUserBookRatingFailed = createAction(`${PREFIX}/updatingUserBookRatingFailed`);
export const startUpdatingBookComment = createAction(`${PREFIX}/startUpdatingBookComment`);
export const updatingBookCommentFailed = createAction(`${PREFIX}/updatingBookCommentFailed`);
export const commentUpdated = createAction<IComment>(`${PREFIX}/commentUpdated`);
export const userBookRatingsLoaded = createAction<IRating[]>(`${PREFIX}/userBookRatingsLoaded`);
export const startDeletingBookComment = createAction(`${PREFIX}/startDeletingBookComment`);
export const deletingBookCommentFailed = createAction(`${PREFIX}/deletingBookCommentFailed`);
export const bookCommentDeleted = createAction(`${PREFIX}/bookCommentDeleted`);
export const setBookToUpdate = createAction<{ bookId: string; bookStatus: BookStatus }>(`${PREFIX}/setBookToUpdate`);
export const setBookValuesToUpdate = createAction<number>(`${PREFIX}/setBookValuesToUpdate`);
export const setBoardType = createAction<BookStatus>(`${PREFIX}/setBoardType`);
export const setBookCountByYear = createAction<{
  boardType: BookStatus;
  data: { monthAndYear: string; count: number; month: string; year: string }[];
}>(`${PREFIX}/setBookCountByYear`);
export const showModal = createAction<string>(`${PREFIX}/showModal`);
export const clearBoardType = createAction(`${PREFIX}/clearBoardType`);
export const hideModal = createAction(`${PREFIX}/hideModal`);
export const searchCategory = createAction<{ boardType: BookStatus; query: string }>(`${PREFIX}/searchCategory`);
export const clearSearchQueryForCategory = createAction<BookStatus>(`${PREFIX}/clearSearchQueryForCategory`);
export const resetCategories = createAction<BookStatus>(`${PREFIX}/resetCategories`);
export const triggerReloadBookList = createAction<BookStatus>(`${PREFIX}/triggerReloadBookList`);
export const triggerReloadCategories = createAction(`${PREFIX}/triggerReloadCategories`);
export const startUpdatingBookAddedDate = createAction(`${PREFIX}/startUpdatingBookAddedDate`);
export const updatingBookAddedDateFailed = createAction(`${PREFIX}/updatingBookAddedDateFailed`);
export const bookAddedDateUpdated = createAction(`${PREFIX}/bookAddedDateUpdated`);
export const startLoadingBookDetails = createAction(`${PREFIX}/startLoadingBookDetails`);
export const loadingBookDetailsFailed = createAction(`${PREFIX}/loadingBookDetailsFailed`);
export const bookDetailsLoaded = createAction<IBook>(`${PREFIX}/bookDetailsLoaded`);
export const clearBookDetails = createAction(`${PREFIX}/clearBookDetails`);
export const toggleExpandedCategoryBooks = createAction<{ path: string; boardType: BookStatus }>(`${PREFIX}/toggleExpandedCategoryBooks`);
export const addToIndeterminatedCategories = createAction<{ boardType: BookStatus; value: string }>(`${PREFIX}/addToIndeterminatedCategories`);
export const clearIndeterminatedCategories = createAction<{ boardType: BookStatus; path: string }>(`${PREFIX}/toggleExpandedCategory`);
export const setBookVotes = createAction<IVote[]>(`${PREFIX}/setBookVotes`);
export const updateBookVotesAction = createAction<{ bookStatus: BookStatus; bookId: string; votesCount: number }>(`${PREFIX}/updateBookVotesAction`);
export const updateBookVotesInSearch = createAction<{ bookId: string; votesCount: number }>(`${PREFIX}/updateBookVotesInSearch`);
export const updateBookVotesInBookDetails = createAction<number>(`${PREFIX}/updateBookVotesInBookDetails`);
export const triggerReloadSearchResults = createAction(`${PREFIX}/triggerReloadSearchResults`);
export const clearBooksData = createAction(`${PREFIX}/clearBooksData`);
export const clearDataForChangeLanguage = createAction(`${PREFIX}/clearDataForChangeLanguage`);
export const startUpdatingUsersBook = createAction(`${PREFIX}/startUpdatingUsersBook`);
export const incrementPageIndex = createAction<BookStatus>(`${PREFIX}/incrementPageIndex`);
export const incrementSearchResultPageIndex = createAction(`${PREFIX}/incrementSearchResultPageIndex`);
export const clearSearchResults = createAction(`${PREFIX}/clearSearchResults`);
export const triggerShouldNotClearSearchQuery = createAction(`${PREFIX}/triggerShouldNotClearSearchQuery`);
export const updatingUsersBookFailed = createAction(`${PREFIX}/updatingUsersBookFailed`);
export const addFilterValue = createAction<{ boardType: BookStatus; filterParam: string; value: string | string[] }>(`${PREFIX}/addFilterValue`);
export const removeFilterValue = createAction<{ boardType: BookStatus; filterParam: string; value: string | string[] }>(
  `${PREFIX}/removeFilterValue`,
);
export const loadingSearchResultsFailed = createAction(`${PREFIX}/loadingSearchResultsFailed`);
export const startLoadingSearchResults = createAction(`${PREFIX}/startLoadingSearchResults`);
export const removeBook = createAction<{ id: string; boardType: BookStatus }>(`${PREFIX}/removeBook`);
export const updateBook = createAction<{ bookId: string; boardType: BookStatus; bookStatus: BookStatus; added: number }>(`${PREFIX}/updateBook`);
export const updateBookDetails = createAction<{ bookStatus: BookStatus; added: number }>(`${PREFIX}/updateBookDetails`);
export const updateUserBookCommentInBookDetails = createAction<{ comment: string; commentAdded: number }>(
  `${PREFIX}/updateUserBookCommentInBookDetails`,
);
export const updateBookInSearchResults = createAction<{ bookId: string; boardType: BookStatus; bookStatus: BookStatus; added: number }>(
  `${PREFIX}/updateBookInSearchResults`,
);
export const setSearchQueryAction = createAction<string>(`${PREFIX}/setSearchQueryAction`);
export const searchResultsLoaded = createAction<{
  boardType: BookStatus;
  data: IBook[];
  totalItems: number;
  hasNextPage: boolean;
  shouldLoadMoreResults: boolean;
}>(`${PREFIX}/searchResultsLoaded`);
export const startLoadingBookList = createAction<BookStatus>(`${PREFIX}/startLoadingBookList`);
export const clearFilters = createAction<BookStatus>(`${PREFIX}/clearFilters`);
export const clearAllFilters = createAction<BookStatus>(`${PREFIX}/clearAllFilters`);
export const populateFilters = createAction<BookStatus>(`${PREFIX}/populateFilters`);

export const manageTopLevelCategorySelection = (path: string, boardType: BookStatus) => (dispatch: any, getState: any) => {
  const { shouldSelectTopLevelCategory, shouldUnselectTopLevelCategory, shouldIndeterminateTopLevelCategory, categoryPath } =
    deriveManageTopLevelCategorySelection(path, boardType)(getState()) || {};
  // if we click on the first or the second level categories we should clear indeterminate state
  dispatch(clearIndeterminatedCategories({ boardType, path }));
  // очищать только топ 1 и топ 2 категорийй в indeterminated
  if ((shouldIndeterminateTopLevelCategory || []).length > 0) {
    dispatch(addToIndeterminatedCategories({ boardType, value: shouldIndeterminateTopLevelCategory as string }));
  }
  if (shouldSelectTopLevelCategory) {
    dispatch(addFilterValue({ boardType, filterParam: 'categoryPaths', value: categoryPath as string }));
  } else if (shouldUnselectTopLevelCategory) {
    dispatch(removeFilterValue({ boardType, filterParam: 'categoryPaths', value: categoryPath as string }));
  }
};

export const setSearchQuery = (query: string) => (dispatch: any, getState: any) => {
  const searchQuery = getSearchQuery(getState());
  if (searchQuery.toLowerCase().trim() !== query.toLowerCase().trim()) {
    dispatch(setSearchQueryAction(query));
    dispatch(triggerReloadSearchResults());
  }
};

const addAndManageFilters = (path: string, boardType: BookStatus, filterParam: string, value: string | string[]) => (dispatch: any) => {
  dispatch(addFilterValue({ boardType, filterParam, value }));
  dispatch(manageTopLevelCategorySelection(path, boardType));
};

const removeAndManageFilters = (path: string, boardType: BookStatus, filterParam: string, value: string[] | string) => (dispatch: any) => {
  dispatch(removeFilterValue({ boardType, filterParam, value }));
  dispatch(manageTopLevelCategorySelection(path, boardType));
};

export const manageFilters = (path: string, boardType: BookStatus, categoryPaths: string[]) => (dispatch: any, getState: any) => {
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

export const loadSearchResults = createAsyncThunk(
  `${PREFIX}/loadSearchResults`,
  async (shouldLoadMoreResults: boolean, { dispatch, getState }: AppThunkAPI) => {
    const state = getState();
    const pageIndex = getSearchResultsPageIndex(state);
    const searchText = deriveSearchQuery(state);
    const sortParams = getSearchSortParams(state);
    const { language } = i18n;

    const params = {
      limit: PAGE_SIZE,
      pageIndex: shouldLoadMoreResults ? pageIndex + 1 : 0,
      boardType: ALL,
      title: searchText,
      sortType: sortParams.type,
      sortDirection: sortParams.direction,
      language,
    };
    try {
      dispatch(startLoadingSearchResults());
      const { data } = (await DataService().getBookList({ ...params })) || {};
      const { items, pagination } = data || {};
      dispatch(
        searchResultsLoaded({
          boardType: ALL,
          data: items || [],
          totalItems: pagination?.totalItems || 0,
          hasNextPage: pagination?.hasNextPage || false,
          shouldLoadMoreResults,
        }),
      );
      if (!shouldLoadMoreResults) {
        dispatch(incrementSearchResultPageIndex());
      }
    } catch (error) {
      console.error(error);
      dispatch(loadingSearchResultsFailed());
    }
  },
);

export const loadBookList = createAsyncThunk(
  `${PREFIX}/loadBookList`,
  async ({ boardType, shouldLoadMoreResults }: { boardType: BookStatus; shouldLoadMoreResults: boolean }, { dispatch, getState }: AppThunkAPI) => {
    const state = getState();
    const pageIndex = deriveBookListPageIndex(boardType)(state);
    const filterParams = deriveFilterBookCategoryPaths(boardType)(state);
    const sortParams = deriveBookListSortParams(boardType)(state);
    const { language } = i18n;

    const params = {
      pageIndex: shouldLoadMoreResults ? pageIndex + 1 : 0,
      limit: PAGE_SIZE,
      boardType,
      categoryPaths: filterParams,
      sortType: sortParams.type,
      sortDirection: sortParams.direction,
      language,
    };

    try {
      console.log(1111, '1111');
      const { data } =
        boardType !== ALL && !shouldLoadMoreResults ? await DataService().getBooksCountByYear({ boardType, language }) : { data: null };
      const result = await DataService().getBookList({ ...params });
      const { items, pagination } = result?.data || {};
      if (!shouldLoadMoreResults) {
        dispatch(incrementPageIndex(boardType));
      }
      console.log(data, 'data');
      return {
        boardType,
        data: items || [],
        totalItems: pagination?.totalItems,
        hasNextPage: pagination?.hasNextPage,
        shouldLoadMoreResults,
        booksCountByYear: data,
      };
    } catch (error) {
      console.error(error);
      throw boardType;
    }
  },
);

export const loadMoreBooks = createAsyncThunk(`${PREFIX}/loadMoreBooks`, async (boardType: BookStatus, { dispatch, getState }: AppThunkAPI) => {
  const state = getState();
  const hasNextPage = deriveBookListHasNextPage(boardType)(state);
  const bookList = deriveBookListData(boardType)(state);
  try {
    if (bookList.length >= PAGE_SIZE && hasNextPage) {
      dispatch(startLoadingBookList(boardType));
      await dispatch(loadBookList({ boardType, shouldLoadMoreResults: true }));
      dispatch(incrementPageIndex(boardType));
    }
  } catch (e) {
    console.error(e);
  }
});

export const loadCategories = createAsyncThunk(`${PREFIX}/loadCategories`, async (shouldRewrite: boolean, { getState }: AppThunkAPI) => {
  const state = getState();
  const categories = getCategoriesData(state);
  const shouldReloadCategories = getShouldReloadCategories(state);
  const { language } = i18n;
  console.log('loadCategories 0');
  if (categories.length === 0 || shouldReloadCategories || shouldRewrite) {
    try {
      console.log('loadCategories 1');
      const { data } = (await DataService().getCategories({ language })) || {};
      console.log('loadCategories 2');
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
});

export const loadBookDetails = createAsyncThunk(`${PREFIX}/loadBookDetails`, async (bookId: string, { dispatch }: AppThunkAPI) => {
  try {
    dispatch(startLoadingBookDetails());
    const { data } = (await DataService().getBookDetails({ bookId })) || {};
    dispatch(bookDetailsLoaded(data));
  } catch (error) {
    console.error(error);
    dispatch(loadingBookDetailsFailed());
  }
});

export const loadMoreSearchResults = createAsyncThunk(`${PREFIX}/loadMoreSearchResults`, async (_, { dispatch, getState }: AppThunkAPI) => {
  const state = getState();
  const hasNextPage = getSearchResultsHasNextPage(state);
  const bookList = getSearchResults(state);
  try {
    if (bookList.length >= PAGE_SIZE && hasNextPage) {
      await dispatch(loadSearchResults(true));
      dispatch(incrementSearchResultPageIndex());
    }
  } catch (e) {
    console.error(e);
  }
});

export const reloadBookList = createAsyncThunk(
  `${PREFIX}/reloadBookList`,
  async (boardType: BookStatus | null, { dispatch, getState }: AppThunkAPI) => {
    const state = getState();
    const bookList = deriveBookListData(boardType as BookStatus)(state);
    const totalItems = deriveBookListTotalItems(boardType as BookStatus)(state);

    // for reloading data if we removed all items from page and we have some other items as well
    if (bookList.length === 0 && bookList.length < totalItems) {
      dispatch(triggerReloadBookList(boardType as BookStatus));
    }
  },
);

export const updateUserBookAddedDate = createAsyncThunk(
  `${PREFIX}/updateUserBookAddedDate`,
  async (added: number, { dispatch, getState }: AppThunkAPI) => {
    try {
      const { language } = i18n;
      dispatch(startUpdatingBookAddedDate());
      const { bookId, bookStatus } = getBookToUpdate(getState());
      const { data } = await DataService().updateUserBookAddedValue({ bookId, date: added, language, boardType: bookStatus });
      dispatch(setBookCountByYear({ boardType: bookStatus, data: data.countByYear }));

      dispatch(updateBookDetails({ bookStatus, added: data.added }));
      dispatch(updateBook({ bookId, boardType: ALL, bookStatus, added: data.added }));
      dispatch(updateBook({ bookId, boardType: bookStatus, bookStatus, added: data.added }));
      dispatch(updateBookInSearchResults({ bookId, boardType: ALL, bookStatus, added: data.added }));
      dispatch(updateSuggestedBook({ bookId, bookStatus, added: data.added }));
      dispatch(bookAddedDateUpdated());
      dispatch(triggerReloadStat());
    } catch (error) {
      console.error(error);
      dispatch(updatingBookAddedDateFailed());
    }
  },
);

export const deleteUserComment = createAsyncThunk(`${PREFIX}/deleteUserComment`, async (bookId: string, { dispatch }: AppThunkAPI) => {
  dispatch(startDeletingBookComment());
  try {
    await DataService().deleteUserComment({ bookId });
    dispatch(bookCommentDeleted());
  } catch (error) {
    console.error(error);
    dispatch(deletingBookCommentFailed());
  }
});

export const deleteUserBookRating = createAsyncThunk(`${PREFIX}/deleteUserBookRating`, async (bookId: string, { dispatch }: AppThunkAPI) => {
  try {
    const { data } = await DataService().deleteUserBookRating({ bookId });
    dispatch(userBookRatingsLoaded(data));
  } catch (error) {
    console.error(error);
  }
});

export const updateUserBook = createAsyncThunk(
  `${PREFIX}/updateUserBook`,
  async (
    { book, newBookStatus, added, boardType }: { book: IBook; newBookStatus: BookStatus; added: number; boardType: BookStatus },
    { dispatch, getState }: AppThunkAPI,
  ) => {
    const { language } = i18n;
    dispatch(startUpdatingUsersBook());
    const { bookId, bookStatus } = book;
    const state = getState();
    const bookDetailsData = getBookDetailsData(state);
    try {
      const { data } = await DataService().updateUserBook({ bookId, added, bookStatus: newBookStatus, language, boardType: bookStatus });
      dispatch(setBookCountByYear({ boardType: bookStatus as BookStatus, data: data.countByYear }));

      if (newBookStatus === ALL) {
        await dispatch(deleteUserComment(bookId));
      }
      if (newBookStatus === ALL) {
        await dispatch(deleteUserBookRating(bookId));
      }

      if (!isEmpty(bookDetailsData)) {
        dispatch(updateBookDetails({ bookStatus: data.bookStatus, added: data.added }));
      }
      if (boardType !== ALL) {
        dispatch(removeBook({ id: bookId, boardType }));
      }
      if (bookStatus && boardType === ALL) {
        dispatch(removeBook({ id: bookId, boardType: bookStatus }));
      }
      // It's because we don't want to refresh all books list to preserve scrolling
      dispatch(updateBook({ bookId, boardType: ALL, bookStatus: data.bookStatus, added: data.added }));
      dispatch(updateBookInSearchResults({ bookId, boardType: ALL, bookStatus: data.bookStatus, added: data.added }));
      dispatch(updateSuggestedBook({ bookId, bookStatus: data.bookStatus, added: data.added }));

      if (newBookStatus !== ALL) {
        // ставим метку о том что надо перезагрузить определенную доску где произошли изменения (добавилась книга например)
        dispatch(triggerReloadBookList(newBookStatus));
      }

      dispatch(reloadBookList(boardType));
      dispatch(triggerReloadStat());
    } catch (error) {
      console.error(error);
      dispatch(updatingUsersBookFailed());
    }
  },
);

export const updateUserComment = createAsyncThunk(
  `${PREFIX}/updateUserComment`,
  async ({ bookId, comment, added }: { bookId: string; comment: string; added: number }, { dispatch }: AppThunkAPI) => {
    dispatch(startUpdatingBookComment());
    try {
      const { data } = await DataService().updateUserComment({ bookId, added, comment });
      dispatch(commentUpdated(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(updatingBookCommentFailed());
      return false;
    }
  },
);

export const getBookComment = createAsyncThunk(`${PREFIX}/getBookComment`, async (bookId: string, { dispatch }: AppThunkAPI) => {
  dispatch(startLoadingBookComment());
  try {
    const { data } = await DataService().getBookComment({ bookId });
    dispatch(commentUpdated(data));
    return data;
  } catch (error) {
    console.error(error);
    dispatch(loadingBookCommentFailed());
    return {};
  }
});

export const updateUserBookRating = createAsyncThunk(
  `${PREFIX}/updateUserBookRating`,
  async ({ bookId, rating, added }: { bookId: string; rating: number; added: number }, { dispatch }: AppThunkAPI) => {
    dispatch(startUpdatingUserBookRating());
    try {
      const { data } = await DataService().updateUserBookRating({ bookId, added, rating });
      dispatch(userBookRatingsLoaded(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(updatingUserBookRatingFailed());
      return false;
    }
  },
);

export const updateBookVotes = createAsyncThunk(
  `${PREFIX}/updateBookVotes`,
  async ({ bookId, shouldAdd, bookStatus }: { bookId: string; shouldAdd: boolean; bookStatus: BookStatus }, { dispatch, getState }: AppThunkAPI) => {
    try {
      const state = getState();
      const bookDetailsData = getBookDetailsData(state);
      const { data } = await DataService().updateBookVotes({ bookId, shouldAdd });

      dispatch(setBookVotes(data.userVotes));
      dispatch(updateBookVotesAction({ bookStatus: ALL, bookId, votesCount: data.votesCount }));
      dispatch(updateBookVotesInSearch({ bookId, votesCount: data.votesCount }));
      dispatch(updateBookVotesInSuggestedBook({ bookId, votesCount: data.votesCount }));
      if (!isEmpty(bookDetailsData)) {
        dispatch(updateBookVotesInBookDetails(data.votesCount));
      }
      if (bookStatus) {
        dispatch(updateBookVotesAction({ bookStatus, bookId, votesCount: data.votesCount }));
      }
    } catch (e) {
      console.error(e);
    }
  },
);
