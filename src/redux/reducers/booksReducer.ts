import { createReducer } from '@reduxjs/toolkit';
import union from 'lodash/union';
import uniqBy from 'lodash/uniqBy';
import * as booksActions from '~redux/actions/booksActions';
import { IDLE, PENDING, SUCCEEDED, FAILED } from '~constants/loadingStatuses';
import { ALL } from '~constants/boardType';
import { BookStatus, IBook, ICategory, IComment, IRating, IVote } from '~types/books';
import { LoadingType } from '~types/loadingTypes';

export interface ICategoriesState {
  data: ICategory[];
  shouldReloadData: boolean;
  loadingDataStatus: LoadingType;
}

export interface IPaginationState {
  pageIndex: number;
  totalItems: number;
  hasNextPage: boolean;
}

export interface ISortParamsState {
  type: string;
  direction: number | null;
}

export interface ISearchState {
  data: IBook[];
  query: string;
  loadingDataStatus: LoadingType;
  shouldClearSearchQuery: boolean;
  shouldReloadData: boolean;
  pagination: IPaginationState;
  sortParams: ISortParamsState;
}

export interface IFilterParamsState {
  [x: string]: string[] | string;
  categoryPaths: string[];
  categorySearchQuery: string;
  indeterminated: string[];
  expanded: string[];
}

export interface IBookDetailsState {
  data: IBook;
  loadingDataStatus: LoadingType;
}

const getDefaultCategoriesState = (): ICategoriesState => ({
  data: [],
  shouldReloadData: false,
  loadingDataStatus: IDLE,
});

const getDefaultPaginationState = (): IPaginationState => ({
  pageIndex: -1,
  totalItems: 0,
  hasNextPage: false,
});

const getDefaultSearchState = (): ISearchState => ({
  data: [],
  query: '',
  loadingDataStatus: IDLE,
  shouldClearSearchQuery: false,
  shouldReloadData: false,
  pagination: getDefaultPaginationState(),
  sortParams: {
    type: 'votesCount',
    direction: -1,
  },
});

const getDefaultFilterParamsState = (): IFilterParamsState => ({
  categorySearchQuery: '',
  categoryPaths: [],
  expanded: [],
  indeterminated: [],
});

const getDefaultBookDetailsState = (): IBookDetailsState => ({
  data: {
    bookId: '',
    title: '',
    coverPath: '',
    bookStatus: null,
    authorsList: [],
    pages: 0,
    categoryValue: '',
    votesCount: 0,
    annotation: '',
    comment: '',
    commentAdded: null,
  },
  loadingDataStatus: IDLE,
});

export interface IBoardState {
  data: IBook[];
  booksCountByYear: any[];
  loadingDataStatus: LoadingType;
  shouldReloadData: boolean;
  editableFilterParams: IFilterParamsState;
  filterParams: IFilterParamsState;
  sortParams: ISortParamsState;
  pagination: IPaginationState;
}

const getDefaultBoardState = ({ sortType = '', sortDirection = null }: { sortType: string; sortDirection: null | number }): IBoardState => ({
  data: [],
  booksCountByYear: [],
  loadingDataStatus: IDLE,
  shouldReloadData: false,
  editableFilterParams: getDefaultFilterParamsState(),
  filterParams: getDefaultFilterParamsState(),
  sortParams: {
    type: sortType,
    direction: sortDirection,
  },
  pagination: getDefaultPaginationState(),
});

export interface IBookCommentState {
  data: IComment;
  loadingDataStatus: LoadingType;
  updatingDataStatus: LoadingType;
  deletingDataStatus: LoadingType;
}

const getDefaultBookCommentState = (): IBookCommentState => ({
  data: {
    bookId: '',
    comment: '',
    added: 0,
  },
  loadingDataStatus: IDLE,
  updatingDataStatus: IDLE,
  deletingDataStatus: IDLE,
});

export interface IUpdatedBookValuesState {
  bookToUpdate: {
    bookId: string;
    bookStatus: BookStatus;
  };
  valuesToUpdate: {
    added: number | null;
  };
  loadingDataStatus: LoadingType;
}

const getUpdatedBookValuesState = (): IUpdatedBookValuesState => ({
  bookToUpdate: {
    bookId: '',
    bookStatus: 'all',
  },
  valuesToUpdate: {
    added: null,
  },
  loadingDataStatus: IDLE,
});

export interface IBooksState {
  updatingBookStatus: LoadingType;
  boardType: BookStatus | null;
  activeModal: string | null;
  activeAlert: string | null;
  updatedBookValues: IUpdatedBookValuesState;
  bookVotes: IVote[];
  bookComment: IBookCommentState;
  bookRatings: IRating[];
  bookDetails: IBookDetailsState;
  board: {
    all: IBoardState;
    planned: IBoardState;
    inProgress: IBoardState;
    completed: IBoardState;
  };
  categories: ICategoriesState;
  search: ISearchState;
}

const getDefaultState = (): IBooksState => ({
  updatingBookStatus: IDLE,
  boardType: ALL,
  activeModal: null,
  activeAlert: null,
  updatedBookValues: getUpdatedBookValuesState(),
  bookVotes: [],
  bookComment: getDefaultBookCommentState(),
  bookRatings: [],
  bookDetails: getDefaultBookDetailsState(),
  board: {
    all: getDefaultBoardState({ sortType: 'votesCount', sortDirection: -1 }),
    planned: getDefaultBoardState({ sortType: 'added', sortDirection: -1 }),
    inProgress: getDefaultBoardState({ sortType: 'added', sortDirection: -1 }),
    completed: getDefaultBoardState({ sortType: 'added', sortDirection: -1 }),
  },
  categories: getDefaultCategoriesState(),
  search: getDefaultSearchState(),
});

const defaultState = getDefaultState();

export default createReducer(defaultState, (builder) => {
  builder
    .addCase(booksActions.setBoardType, (state, action) => {
      state.boardType = action.payload;
    })
    .addCase(booksActions.clearBoardType, (state) => {
      state.boardType = null;
    })
    .addCase(booksActions.showModal, (state, action) => {
      state.activeModal = action.payload;
    })
    .addCase(booksActions.hideModal, (state) => {
      state.activeModal = null;
    })
    .addCase(booksActions.startDeletingBookComment, (state) => {
      state.bookComment.deletingDataStatus = PENDING;
    })
    .addCase(booksActions.bookCommentDeleted, (state) => {
      state.bookComment.deletingDataStatus = SUCCEEDED;
      state.bookComment.data = { bookId: '', comment: '', added: 0 };
    })
    .addCase(booksActions.deletingBookCommentFailed, (state) => {
      state.bookComment.deletingDataStatus = FAILED;
    })
    .addCase(booksActions.startUpdatingBookComment, (state) => {
      state.bookComment.updatingDataStatus = PENDING;
    })
    .addCase(booksActions.commentUpdated, (state, action) => {
      state.bookComment.data = action.payload;
      state.bookComment.updatingDataStatus = SUCCEEDED;
      state.bookComment.loadingDataStatus = SUCCEEDED;
    })
    .addCase(booksActions.userBookRatingsLoaded, (state, action) => {
      state.bookRatings = action.payload;
    })
    .addCase(booksActions.clearBookComment, (state) => {
      state.bookComment = getDefaultBookCommentState();
    })
    .addCase(booksActions.startLoadingBookComment, (state) => {
      state.bookComment.loadingDataStatus = PENDING;
    })
    .addCase(booksActions.loadingBookCommentFailed, (state) => {
      state.bookComment.loadingDataStatus = FAILED;
    })
    .addCase(booksActions.updateBook, (state, { payload: { boardType, bookId, bookStatus, added } }) => {
      state.updatingBookStatus = SUCCEEDED;
      state.board[boardType].data = state.board[boardType].data.map((book) => (book.bookId === bookId ? { ...book, bookStatus, added } : book));
    })
    .addCase(booksActions.updateBookDetails, (state, { payload: { bookStatus, added } }) => {
      state.bookDetails.data.bookStatus = bookStatus;
      state.bookDetails.data.added = added;
    })
    .addCase(booksActions.updateUserBookCommentInBookDetails, (state, { payload: { comment, commentAdded } }) => {
      state.bookDetails.data.comment = comment;
      state.bookDetails.data.commentAdded = commentAdded;
    })
    .addCase(booksActions.setBookToUpdate, (state, { payload: { bookId, bookStatus } }) => {
      state.updatedBookValues.bookToUpdate.bookId = bookId;
      state.updatedBookValues.bookToUpdate.bookStatus = bookStatus;
    })
    .addCase(booksActions.setBookValuesToUpdate, (state, action) => {
      state.updatedBookValues.valuesToUpdate.added = action.payload;
    })
    .addCase(booksActions.startUpdatingBookAddedDate, (state) => {
      state.updatedBookValues.loadingDataStatus = PENDING;
    })
    .addCase(booksActions.updatingBookAddedDateFailed, (state) => {
      state.updatedBookValues.loadingDataStatus = FAILED;
    })
    .addCase(booksActions.bookAddedDateUpdated, (state) => {
      state.updatedBookValues.loadingDataStatus = SUCCEEDED;
    })
    .addCase(booksActions.clearBookDetails, (state) => {
      state.bookDetails = getDefaultBookDetailsState();
    })
    .addCase(booksActions.updateBookInSearchResults, (state, { payload: { bookId, bookStatus, added } }) => {
      state.updatingBookStatus = SUCCEEDED;
      state.search.data = state.search.data.map((book) => (book.bookId === bookId ? { ...book, bookStatus, added } : book));
    })
    .addCase(booksActions.setBookVotes, (state, action) => {
      state.bookVotes = action.payload;
    })
    .addCase(booksActions.updateBookVotesAction, (state, { payload: { bookStatus, bookId, votesCount } }) => {
      state.board[bookStatus].data = state.board[bookStatus].data.map((book) => (book.bookId === bookId ? { ...book, votesCount } : book));
    })
    .addCase(booksActions.updateBookVotesInSearch, (state, { payload: { bookId, votesCount } }) => {
      state.search.data = state.search.data.map((book) => (book.bookId === bookId ? { ...book, votesCount } : book));
    })
    .addCase(booksActions.updateBookVotesInBookDetails, (state, action) => {
      state.bookDetails.data.votesCount = action.payload;
    })
    .addCase(booksActions.clearSearchResults, (state) => {
      state.search = { ...getDefaultSearchState(), shouldClearSearchQuery: true };
    })
    .addCase(booksActions.incrementPageIndex, (state, action) => {
      state.board[action.payload].pagination.pageIndex += 1;
    })
    .addCase(booksActions.startUpdatingUsersBook, (state) => {
      state.updatingBookStatus = PENDING;
    })
    .addCase(booksActions.startLoadingBookList, (state, action) => {
      state.board[action.payload].loadingDataStatus = PENDING;
    })
    .addCase(booksActions.triggerReloadBookList, (state, action) => {
      state.board[action.payload].data = [];
      state.board[action.payload].shouldReloadData = true;
    })
    .addCase(
      booksActions.bookListLoaded,
      (state, { payload: { boardType, data = [], totalItems = 0, hasNextPage = false, shouldLoadMoreResults } }) => {
        state.board[boardType].loadingDataStatus = SUCCEEDED;
        state.board[boardType].data = shouldLoadMoreResults ? uniqBy([...state.board[boardType].data, ...data], 'bookId') : data;
        state.board[boardType].pagination.pageIndex = shouldLoadMoreResults ? state.board[boardType].pagination.pageIndex : -1;
        state.board[boardType].pagination.totalItems = totalItems;
        state.board[boardType].pagination.hasNextPage = hasNextPage;
      },
    )
    .addCase(booksActions.setBookCountByYear, (state, { payload: { boardType = ALL, data } }) => {
      state.board[boardType].booksCountByYear = data;
    })
    .addCase(booksActions.loadingBookListFailed, (state, action) => {
      state.board[action.payload].loadingDataStatus = FAILED;
      state.board[action.payload].shouldReloadData = false;
    })
    .addCase(booksActions.startLoadingCategories, (state) => {
      state.categories.loadingDataStatus = PENDING;
    })
    .addCase(booksActions.categoriesLoaded, (state, action) => {
      state.categories.data = action.payload;
      state.categories.shouldReloadData = false;
      state.categories.loadingDataStatus = SUCCEEDED;
    })
    .addCase(booksActions.loadingCategoriesFailed, (state) => {
      state.categories.shouldReloadData = false;
      state.categories.loadingDataStatus = FAILED;
    })
    .addCase(booksActions.triggerReloadCategories, (state) => {
      state.categories.shouldReloadData = true;
    })
    .addCase(booksActions.startLoadingBookDetails, (state) => {
      state.bookDetails.loadingDataStatus = PENDING;
    })
    .addCase(booksActions.bookDetailsLoaded, (state, action) => {
      state.bookDetails.data = action.payload;
      state.bookDetails.loadingDataStatus = SUCCEEDED;
    })
    .addCase(booksActions.loadingBookDetailsFailed, (state) => {
      state.bookDetails.loadingDataStatus = FAILED;
    })
    .addCase(booksActions.resetCategories, (state, action) => {
      state.board[action.payload].editableFilterParams.categorySearchQuery = '';
    })
    .addCase(booksActions.searchCategory, (state, { payload: { boardType, query } }) => {
      state.board[boardType].editableFilterParams.categorySearchQuery = query;
    })
    .addCase(booksActions.clearSearchQueryForCategory, (state, action) => {
      state.board[action.payload].editableFilterParams.categorySearchQuery = '';
    })
    .addCase(booksActions.toggleExpandedCategoryBooks, (state, { payload: { boardType, path } }) => {
      state.board[boardType].editableFilterParams.expanded = state.board[boardType].editableFilterParams.expanded.includes(path)
        ? state.board[boardType].editableFilterParams.expanded.filter((item) => item !== path)
        : [...state.board[boardType].editableFilterParams.expanded, path];
    })
    .addCase(booksActions.addToIndeterminatedCategories, (state, { payload: { boardType, value } }) => {
      state.board[boardType].editableFilterParams.indeterminated = Array.isArray(value)
        ? [...state.board[boardType].editableFilterParams.indeterminated, ...value]
        : [...state.board[boardType].editableFilterParams.indeterminated, value];
    })
    .addCase(booksActions.clearIndeterminatedCategories, (state, { payload: { boardType, path } }) => {
      state.board[boardType].editableFilterParams.indeterminated = state.board[boardType].editableFilterParams.indeterminated.filter((item) => {
        const splittedPath = path.split('.');
        if (splittedPath.length === 1) {
          return null;
        }
        const firstLevel = `${splittedPath[0]}`;
        const secondLevel = `${splittedPath[0]}.${splittedPath[1]}`;
        return item !== firstLevel && item !== secondLevel;
      });
    })
    .addCase(booksActions.clearFilters, (state, action) => {
      state.board[action.payload].editableFilterParams.categoryPaths = [];
      state.board[action.payload].editableFilterParams.indeterminated = [];
    })
    .addCase(booksActions.populateFilters, (state, action) => {
      state.board[action.payload].filterParams = state.board[action.payload].editableFilterParams;
    })
    .addCase(booksActions.addFilterValue, (state, { payload: { boardType, filterParam, value } }) => {
      state.board[boardType].editableFilterParams[filterParam] = Array.isArray(value)
        ? union([...state.board[boardType].editableFilterParams[filterParam], ...value])
        : [...state.board[boardType].editableFilterParams[filterParam], value];
    })
    .addCase(booksActions.removeFilterValue, (state, { payload: { boardType, filterParam, value } }) => {
      state.board[boardType].editableFilterParams[filterParam] = Array.isArray(value)
        ? (state.board[boardType].editableFilterParams[filterParam] as string[]).filter((param) => !value.includes(param))
        : (state.board[boardType].editableFilterParams[filterParam] as string[]).filter((param) => param !== value);
    })
    .addCase(booksActions.removeBook, (state, { payload: { boardType, id } }) => {
      state.board[boardType].data = state.board[boardType].data.filter((book) => book.bookId !== id);
      state.board[boardType].pagination.totalItems =
        state.board[boardType].pagination.totalItems > 0 ? state.board[boardType].pagination.totalItems - 1 : 0;
    })
    .addCase(booksActions.searchResultsLoaded, (state, { payload: { data = [], totalItems = 0, hasNextPage = false, shouldLoadMoreResults } }) => {
      state.search.data = shouldLoadMoreResults ? [...state.search.data, ...data] : data;
      state.search.loadingDataStatus = SUCCEEDED;
      state.search.shouldReloadData = false;
      state.search.pagination.totalItems = totalItems;
      state.search.pagination.hasNextPage = hasNextPage;
    })
    .addCase(booksActions.startLoadingSearchResults, (state) => {
      state.search.loadingDataStatus = PENDING;
    })
    .addCase(booksActions.triggerReloadSearchResults, (state) => {
      state.search.data = [];
      state.search.shouldReloadData = true;
    })
    .addCase(booksActions.loadingSearchResultsFailed, (state) => {
      state.search.loadingDataStatus = FAILED;
      state.search.shouldReloadData = false;
    })
    .addCase(booksActions.incrementSearchResultPageIndex, (state) => {
      state.search.pagination.pageIndex += 1;
    })
    .addCase(booksActions.triggerShouldNotClearSearchQuery, (state) => {
      state.search.shouldClearSearchQuery = false;
    })
    .addCase(booksActions.setSearchQueryAction, (state, action) => {
      state.search.shouldClearSearchQuery = false;
      state.search.query = action.payload;
    })
    .addCase(booksActions.clearDataForChangeLanguage, (state) => {
      state.bookVotes = [];
      state.activeModal = null;
    })
    .addCase(booksActions.clearBooksData, () => defaultState);
});
