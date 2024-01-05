import union from 'lodash/union';
import createReducer from '~utils/createReducer';
import updateIn from '~utils/updateIn';
import { IDLE, PENDING, REFRESHING, SUCCEEDED, FAILED } from '~constants/loadingStatuses';
import { ALL } from '~constants/boardType';
import {
  SET_SEARCH_QUERY,
  START_LOADING_SEARCH_RESULTS,
  LOADING_SEARCH_RESULTS_FAILED,
  SEARCH_RESULTS_LOADED,
  BOOK_LIST_LOADED,
  START_LOADING_BOOK_LIST,
  LOADING_BOOK_LIST_FAILED,
  REMOVE_BOOK,
  ADD_FILTER_VALUE,
  REMOVE_FILTER_VALUE,
  SET_SORT_TYPE,
  SET_SORT_DIRECTION,
  UPDATE_BOOK,
  ADD_BOOK,
  START_UPDATING_USERS_BOOK,
  UPDATE_BOOK_IN_SEARCH_RESULTS,
  CLEAR_SEARCH_RESULTS,
  INCREMENT_PAGE_INDEX,
  INCREMENT_SEARCH_RESULT_PAGE_INDEX,
  TRIGGER_RELOAD_BOOK_LIST,
  TRIGGER_RELOAD_SEARCH_RESULTS,
  CLEAR_BOOKS_DATA,
  START_LOADING_CATEGORIES,
  LOADING_CATEGORIES_FAILED,
  CATEGORIES_LOADED,
  TOGGLE_EXPANDED_CATEGORY,
  ADD_TO_INDETERMINATED_CATEGORIES,
  CLEAR_INDETERMINATED_CATEGORIES,
  CLEAR_FILTERS,
  POPULATE_FILTERS,
  SET_BOARD_TYPE,
  CLEAR_BOARD_TYPE,
  SELECT_BOOK,
  SHOW_MODAL,
  HIDE_MODAL,
  RESET_CATEGORIES,
  SEARCH_CATEGORY,
  CLEAR_SEARCH_QUERY_FOR_CATEGORY,
  SET_BOOK_VOTES,
  START_UPDATING_BOOK_VOTES,
  UPDATING_BOOK_VOTES_FAILED,
  UPDATED_BOOK_VOTES,
  UPDATE_BOOK_VOTES,
  UPDATE_BOOK_VOTES_IN_SEARCH,
  START_LOADING_BOOK_DETAILS,
  LOADING_BOOK_DETAILS_FAILED,
  BOOK_DETAILS_LOADED,
  UPDATE_BOOK_VOTES_IN_BOOK_DETAILS,
  UPDATE_BOOK_DETAILS,
  CLEAR_BOOK_DETAILS,
  TRIGGER_RELOAD_CATEGORIES,
  TRIGGER_SHOULD_NOT_CLEAR_SEARCH_QUERY,
  CLEAR_DATA_FOR_CHANGE_LANGUAGE,
  SET_BOOK_TO_UPDATE,
  SET_BOOK_VALUES_TO_UPDATE,
  START_UPDATING_BOOK_ADDED_DATE,
  UPDATING_BOOK_ADDED_DATE_FAILED,
  BOOK_ADDED_DATE_UPDATED,
  SET_BOOK_COUNT_BY_YEAR,
} from '~redux/actions/booksActions';

const getDefaultCategoriesState = () => ({
  data: [],
  shouldReloadData: false,
  loadingDataStatus: IDLE,
});

const getDefaultPaginationState = () => ({
  pageIndex: -1,
  totalItems: 0,
  hasNextPage: false,
});

const getDefaultSearchState = () => ({
  data: [],
  query: '',
  loadingDataStatus: IDLE,
  shouldClearSearchQuery: false,
  shouldReloadData: false,
  shouldReloadWithPullRefresh: false,
  pagination: getDefaultPaginationState(),
  sortParams: {
    type: 'votesCount',
    direction: -1,
  },
});

const getDefaultFilterParamsState = () => ({
  categorySearchQuery: '',
  categoryPaths: [],
  expanded: [],
  indeterminated: [],
});

const getDefaultBookDetailsState = () => ({
  data: {},
  loadingDataStatus: IDLE,
});

const getDefaultBoardState = ({ sortType = '', sortDirection = null }) => ({
  data: [],
  booksCountByYear: [],
  loadingDataStatus: IDLE,
  shouldReloadData: false,
  shouldReloadWithPullRefresh: false,
  editableFilterParams: getDefaultFilterParamsState(),
  filterParams: getDefaultFilterParamsState(),
  sortParams: {
    type: sortType,
    direction: sortDirection,
  },
  pagination: getDefaultPaginationState(),
});

const initialState = {
  updatingBookStatus: IDLE,
  boardType: ALL,
  selectedBook: null,
  activeModal: null,
  activeAlert: null,
  updatedBookValues: {
    bookToUpdate: {
      bookId: '',
      bookStatus: '',
    },
    valuesToUpdate: {
      added: null,
    },
    loadingDataStatus: IDLE,
  },
  bookVotes: [],
  updatingVotesForBooks: [],
  bookDetails: getDefaultBookDetailsState(),
  board: {
    all: getDefaultBoardState({ sortType: 'votesCount', sortDirection: -1 }),
    planned: getDefaultBoardState({ sortType: 'added', sortDirection: -1 }),
    inProgress: getDefaultBoardState({ sortType: 'added', sortDirection: -1 }),
    completed: getDefaultBoardState({ sortType: 'added', sortDirection: -1 }),
  },
  categories: getDefaultCategoriesState(),
  search: getDefaultSearchState(),
};

export default createReducer(initialState, (state, action) => ({
  [SET_BOARD_TYPE]: () => ({
    ...state,
    boardType: action.boardType,
  }),

  [CLEAR_BOARD_TYPE]: () => ({
    ...state,
    boardType: null,
  }),

  [SELECT_BOOK]: () => ({
    ...state,
    selectedBook: action.book,
  }),

  [SHOW_MODAL]: () => ({
    ...state,
    activeModal: action.modal,
  }),

  [HIDE_MODAL]: () => ({
    ...state,
    activeModal: null,
  }),

  [UPDATE_BOOK]: () => ({
    ...state,
    updatingBookStatus: SUCCEEDED,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        data: updateIn(state.board[action.boardType].data, (book) => book.bookId === action.bookId, {
          bookStatus: action.bookStatus,
          added: action.added,
        }),
      },
    },
  }),

  [UPDATE_BOOK_DETAILS]: () => ({
    ...state,
    bookDetails: {
      ...state.bookDetails,
      data: {
        ...state.bookDetails.data,
        bookStatus: action.bookStatus,
        added: action.added,
      },
    },
  }),

  [SET_BOOK_TO_UPDATE]: () => ({
    ...state,
    updatedBookValues: {
      ...state.updatedBookValues,
      bookToUpdate: {
        bookId: action.bookId,
        bookStatus: action.bookStatus,
      },
    },
  }),

  [SET_BOOK_VALUES_TO_UPDATE]: () => ({
    ...state,
    updatedBookValues: {
      ...state.updatedBookValues,
      valuesToUpdate: {
        added: action.added,
      },
    },
  }),

  [START_UPDATING_BOOK_ADDED_DATE]: () => ({
    ...state,
    updatedBookValues: {
      ...state.updatedBookValues,
      loadingDataStatus: PENDING,
    },
  }),

  [UPDATING_BOOK_ADDED_DATE_FAILED]: () => ({
    ...state,
    updatedBookValues: {
      ...state.updatedBookValues,
      loadingDataStatus: FAILED,
    },
  }),

  [BOOK_ADDED_DATE_UPDATED]: () => ({
    ...state,
    updatedBookValues: {
      ...state.updatedBookValues,
      loadingDataStatus: SUCCEEDED,
    },
  }),

  [CLEAR_BOOK_DETAILS]: () => ({
    ...state,
    bookDetails: getDefaultBookDetailsState(),
  }),

  [UPDATE_BOOK_IN_SEARCH_RESULTS]: () => ({
    ...state,
    updatingBookStatus: SUCCEEDED,
    search: {
      ...state.search,
      data: updateIn(state.search.data, (book) => book.bookId === action.bookId, {
        bookStatus: action.bookStatus,
        added: action.added,
      }),
    },
  }),

  [SET_BOOK_VOTES]: () => ({
    ...state,
    bookVotes: action.data,
  }),

  [START_UPDATING_BOOK_VOTES]: () => ({
    ...state,
    updatingVotesForBooks: [...state.updatingVotesForBooks, action.bookId],
  }),

  [UPDATING_BOOK_VOTES_FAILED]: () => ({
    ...state,
    updatingVotesForBooks: state.updatingVotesForBooks.filter((item) => item !== action.bookId),
  }),

  [UPDATED_BOOK_VOTES]: () => ({
    ...state,
    updatingVotesForBooks: state.updatingVotesForBooks.filter((item) => item !== action.bookId),
    bookVotes: action.userVotes,
  }),

  [UPDATE_BOOK_VOTES]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.bookStatus]: {
        ...state.board[action.bookStatus],
        data: updateIn(state.board[action.bookStatus].data, (book) => book.bookId === action.bookId, {
          votesCount: action.votesCount,
        }),
      },
    },
  }),

  [UPDATE_BOOK_VOTES_IN_SEARCH]: () => ({
    ...state,
    search: {
      ...state.search,
      data: updateIn(state.search.data, (book) => book.bookId === action.bookId, {
        votesCount: action.votesCount,
      }),
    },
  }),

  [UPDATE_BOOK_VOTES_IN_BOOK_DETAILS]: () => ({
    ...state,
    bookDetails: {
      ...state.bookDetails,
      data: { ...state.bookDetails.data, votesCount: action.votesCount },
    },
  }),

  [CLEAR_SEARCH_RESULTS]: () => ({
    ...state,
    search: { ...getDefaultSearchState(), shouldClearSearchQuery: true },
  }),

  [ADD_BOOK]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        data: [...state.board[action.boardType].data, action.book],
      },
    },
  }),

  [INCREMENT_PAGE_INDEX]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        pagination: {
          ...state.board[action.boardType].pagination,
          pageIndex: state.board[action.boardType].pagination.pageIndex + 1,
        },
      },
    },
  }),

  [START_UPDATING_USERS_BOOK]: () => ({
    ...state,
    updatingBookStatus: PENDING,
  }),

  [START_LOADING_BOOK_LIST]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        loadingDataStatus: PENDING,
      },
    },
  }),

  [TRIGGER_RELOAD_BOOK_LIST]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        shouldReloadData: true,
        shouldReloadWithPullRefresh: action.isPullRefresh,
        loadingDataStatus: action.isPullRefresh ? REFRESHING : state.board[action.boardType].loadingDataStatus,
      },
    },
  }),

  [BOOK_LIST_LOADED]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        data: action.shouldLoadMoreResults ? [...state.board[action.boardType].data, ...action.data] : action.data,
        loadingDataStatus: SUCCEEDED,
        shouldReloadData: false,
        shouldReloadWithPullRefresh: false,
        pagination: {
          pageIndex: action.shouldLoadMoreResults ? state.board[action.boardType].pagination.pageIndex : -1,
          totalItems: action.totalItems,
          hasNextPage: action.hasNextPage,
        },
      },
    },
  }),

  [SET_BOOK_COUNT_BY_YEAR]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        booksCountByYear: action.data,
      },
    },
  }),

  [LOADING_BOOK_LIST_FAILED]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        loadingDataStatus: FAILED,
        shouldReloadData: false,
        shouldReloadWithPullRefresh: false,
      },
    },
  }),

  [START_LOADING_CATEGORIES]: () => ({
    ...state,
    categories: {
      ...state.categories,
      loadingDataStatus: PENDING,
    },
  }),

  [CATEGORIES_LOADED]: () => ({
    ...state,
    categories: {
      ...state.categories,
      data: action.data,
      shouldReloadData: false,
      loadingDataStatus: SUCCEEDED,
    },
  }),

  [LOADING_CATEGORIES_FAILED]: () => ({
    ...state,
    categories: {
      ...state.categories,
      shouldReloadData: false,
      loadingDataStatus: FAILED,
    },
  }),

  [TRIGGER_RELOAD_CATEGORIES]: () => ({
    ...state,
    categories: {
      ...state.categories,
      shouldReloadData: true,
    },
  }),

  [START_LOADING_BOOK_DETAILS]: () => ({
    ...state,
    bookDetails: {
      ...state.bookDetails,
      loadingDataStatus: PENDING,
    },
  }),

  [BOOK_DETAILS_LOADED]: () => ({
    ...state,
    bookDetails: {
      ...state.bookDetails,
      data: action.data,
      loadingDataStatus: SUCCEEDED,
    },
  }),

  [LOADING_BOOK_DETAILS_FAILED]: () => ({
    ...state,
    bookDetails: {
      ...state.bookDetails,
      loadingDataStatus: FAILED,
    },
  }),

  [RESET_CATEGORIES]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        editableFilterParams: {
          ...state.board[action.boardType].filterParams,
          categorySearchQuery: '',
        },
      },
    },
  }),

  [SEARCH_CATEGORY]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        editableFilterParams: {
          ...state.board[action.boardType].editableFilterParams,
          categorySearchQuery: action.query,
        },
      },
    },
  }),

  [CLEAR_SEARCH_QUERY_FOR_CATEGORY]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        editableFilterParams: {
          ...state.board[action.boardType].editableFilterParams,
          categorySearchQuery: '',
        },
      },
    },
  }),

  [TOGGLE_EXPANDED_CATEGORY]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        editableFilterParams: {
          ...state.board[action.boardType].editableFilterParams,
          expanded: state.board[action.boardType].editableFilterParams.expanded.includes(action.path)
            ? state.board[action.boardType].editableFilterParams.expanded.filter((item) => item !== action.path)
            : [...state.board[action.boardType].editableFilterParams.expanded, action.path],
        },
      },
    },
  }),

  [ADD_TO_INDETERMINATED_CATEGORIES]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        editableFilterParams: {
          ...state.board[action.boardType].editableFilterParams,
          indeterminated: Array.isArray(action.value)
            ? [...state.board[action.boardType].editableFilterParams.indeterminated, ...action.value]
            : [...state.board[action.boardType].editableFilterParams.indeterminated, action.value],
        },
      },
    },
  }),

  [CLEAR_INDETERMINATED_CATEGORIES]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        editableFilterParams: {
          ...state.board[action.boardType].editableFilterParams,
          indeterminated: state.board[action.boardType].editableFilterParams.indeterminated.filter((item) => {
            const splittedPath = action.path.split('.');
            if (splittedPath.length === 1) {
              return null;
            }
            const firstLevel = `${splittedPath[0]}`;
            const secondLevel = `${splittedPath[0]}.${splittedPath[1]}`;
            return item !== firstLevel && item !== secondLevel;
          }),
        },
      },
    },
  }),

  [CLEAR_FILTERS]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        editableFilterParams: {
          ...state.board[action.boardType].editableFilterParams,
          categoryPaths: [],
          indeterminated: [],
        },
      },
    },
  }),

  [POPULATE_FILTERS]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        filterParams: state.board[action.boardType].editableFilterParams,
      },
    },
  }),

  [ADD_FILTER_VALUE]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        editableFilterParams: {
          ...state.board[action.boardType].editableFilterParams,
          [action.filterParam]: Array.isArray(action.value)
            ? union([...state.board[action.boardType].editableFilterParams[action.filterParam], ...action.value])
            : [...state.board[action.boardType].editableFilterParams[action.filterParam], action.value],
        },
      },
    },
  }),

  [REMOVE_FILTER_VALUE]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        editableFilterParams: {
          ...state.board[action.boardType].editableFilterParams,
          [action.filterParam]: Array.isArray(action.value)
            ? state.board[action.boardType].editableFilterParams[action.filterParam].filter((value) => !action.value.includes(value))
            : state.board[action.boardType].editableFilterParams[action.filterParam].filter((value) => value !== action.value),
        },
      },
    },
  }),

  [SET_SORT_TYPE]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        sortParams: {
          ...state.board[action.boardType].sortParams,
          type: action.sortType,
        },
      },
    },
  }),

  [SET_SORT_DIRECTION]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        sortParams: {
          ...state.board[action.boardType].sortParams,
          direction: action.sortDirection,
        },
      },
    },
  }),

  [REMOVE_BOOK]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        data: state.board[action.boardType].data.filter((book) => book.bookId !== action.id),
        pagination: {
          ...state.board[action.boardType].pagination,
          totalItems: state.board[action.boardType].pagination.totalItems > 0 ? state.board[action.boardType].pagination.totalItems - 1 : 0,
        },
      },
    },
  }),

  [SEARCH_RESULTS_LOADED]: () => ({
    ...state,
    search: {
      ...state.search,
      data: action.shouldLoadMoreResults ? [...state.search.data, ...action.data] : action.data,
      loadingDataStatus: SUCCEEDED,
      shouldReloadData: false,
      pagination: {
        ...state.search.pagination,
        totalItems: action.totalItems,
        hasNextPage: action.hasNextPage,
      },
    },
  }),

  [START_LOADING_SEARCH_RESULTS]: () => ({
    ...state,
    search: {
      ...state.search,
      loadingDataStatus: PENDING,
    },
  }),

  [TRIGGER_RELOAD_SEARCH_RESULTS]: () => ({
    ...state,
    search: {
      ...state.search,
      shouldReloadData: true,
    },
  }),

  [LOADING_SEARCH_RESULTS_FAILED]: () => ({
    ...state,
    search: {
      ...state.search,
      loadingDataStatus: FAILED,
      shouldReloadData: false,
      shouldReloadWithPullRefresh: false,
    },
  }),

  [INCREMENT_SEARCH_RESULT_PAGE_INDEX]: () => ({
    ...state,
    search: {
      ...state.search,
      pagination: {
        ...state.search.pagination,
        pageIndex: state.search.pagination.pageIndex + 1,
      },
    },
  }),

  [TRIGGER_SHOULD_NOT_CLEAR_SEARCH_QUERY]: () => ({
    ...state,
    search: {
      ...state.search,
      shouldClearSearchQuery: false,
    },
  }),

  [SET_SEARCH_QUERY]: () => ({
    ...state,
    search: {
      ...state.search,
      shouldClearSearchQuery: false,
      query: action.query,
    },
  }),

  [CLEAR_DATA_FOR_CHANGE_LANGUAGE]: () => ({
    ...initialState,
    bookVotes: state.bookVotes,
    activeModal: state.activeModal,
  }),

  [CLEAR_BOOKS_DATA]: () => initialState,
}));
