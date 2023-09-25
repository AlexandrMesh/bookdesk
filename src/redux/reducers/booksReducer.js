import union from 'lodash/union';
import createReducer from '~utils/createReducer';
import updateIn from '~utils/updateIn';
import { IDLE, PENDING, SUCCEEDED, FAILED } from '~constants/loadingStatuses';
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
  TOGGLE_COLLAPSED_CATEGORY,
  ADD_TO_INDETERMINATED_CATEGORIES,
  CLEAR_INDETERMINATED_CATEGORIES,
  CLEAR_FILTERS,
  POPULATE_FILTERS,
  RESET_FILTER_PARAMS,
} from '~redux/actions/booksActions';

const getDefaultCategoriesState = () => ({
  data: [],
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
  shouldReloadData: false,
  pagination: getDefaultPaginationState(),
});

const getDefaultBoardState = ({ sortType = '', sortDirection = null }) => ({
  data: [],
  loadingDataStatus: IDLE,
  shouldReloadData: false,
  editableFilterParams: {
    categoryPaths: [],
    collapsed: [],
    indeterminated: [],
  },
  filterParams: {
    categoryPaths: [],
    collapsed: [],
    indeterminated: [],
  },
  sortParams: {
    type: sortType,
    direction: sortDirection,
  },
  pagination: getDefaultPaginationState(),
});

const initialState = {
  updatingBookStatus: IDLE,
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

  [CLEAR_SEARCH_RESULTS]: () => ({
    ...state,
    search: getDefaultSearchState(),
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
        pagination: {
          pageIndex: action.shouldLoadMoreResults ? state.board[action.boardType].pagination.pageIndex : -1,
          totalItems: action.totalItems,
          hasNextPage: action.hasNextPage,
        },
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
      loadingDataStatus: SUCCEEDED,
    },
  }),

  [LOADING_CATEGORIES_FAILED]: () => ({
    ...state,
    categories: {
      ...state.categories,
      loadingDataStatus: FAILED,
    },
  }),

  [TOGGLE_COLLAPSED_CATEGORY]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        editableFilterParams: {
          ...state.board[action.boardType].editableFilterParams,
          collapsed: state.board[action.boardType].editableFilterParams.collapsed.includes(action.path)
            ? state.board[action.boardType].editableFilterParams.collapsed.filter((item) => item !== action.path)
            : [...state.board[action.boardType].editableFilterParams.collapsed, action.path],
        },
      },
    },
  }),

  [RESET_FILTER_PARAMS]: () => ({
    ...state,
    board: {
      ...state.board,
      [action.boardType]: {
        ...state.board[action.boardType],
        editableFilterParams: state.board[action.boardType].filterParams,
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
          indeterminated: [],
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
          categoryPaths: [],
          indeterminated: [],
          collapsed: [],
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

  [SET_SEARCH_QUERY]: () => ({
    ...state,
    search: {
      ...state.search,
      query: action.query,
    },
  }),

  [CLEAR_BOOKS_DATA]: () => initialState,
}));
