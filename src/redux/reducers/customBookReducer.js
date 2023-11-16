import updateIn from '~utils/updateIn';
import { IDLE, PENDING, FAILED, SUCCEEDED } from '~constants/loadingStatuses';
import {
  SET_NEW_CUSTOM_BOOK_NAME,
  START_LOADING_SUGGESTED_BOOKS,
  LOADING_SUGGESTED_BOOKS_FAILED,
  SUGGESTED_BOOKS_LOADED,
  SET_BOOK_EXISTS,
  CLEAR_SUGGESTED_BOOKS,
  COMPLETE_STEP,
  REMOVE_COMPLETED_STEP,
  UPDATE_SUGGESTED_BOOK,
  UPDATE_BOOK_VOTES_IN_SUGGESTED_BOOK,
} from '~redux/actions/customBookActions';
import createReducer from '~utils/createReducer';

const getDefaultPaginationState = () => ({
  pageIndex: 0,
  totalItems: 0,
  hasNextPage: false,
});

const getDefaultSuggestedBooksState = () => ({
  data: [],
  pagination: getDefaultPaginationState(),
  sortParams: {
    type: 'votesCount',
    direction: -1,
  },
  loadingDataStatus: IDLE,
});

const initialState = {
  add: {
    completedSteps: [],
    updatingBookStatus: IDLE,
    name: '',
    bookExists: false,
    suggestedBooks: getDefaultSuggestedBooksState(),
  },
};

export default createReducer(initialState, (state, action) => ({
  [SET_NEW_CUSTOM_BOOK_NAME]: () => ({
    ...state,
    add: {
      ...state.add,
      name: action.name,
    },
  }),
  [COMPLETE_STEP]: () => ({
    ...state,
    add: {
      ...state.add,
      completedSteps: !state.add.completedSteps.includes(action.step) ? [...state.add.completedSteps, action.step] : state.add.completedSteps,
    },
  }),
  [UPDATE_SUGGESTED_BOOK]: () => ({
    ...state,
    add: {
      ...state.add,
      updatingBookStatus: SUCCEEDED,
      suggestedBooks: {
        ...state.add.suggestedBooks,
        data: updateIn(state.add.suggestedBooks.data, (book) => book.bookId === action.bookId, {
          bookStatus: action.bookStatus,
          added: action.added,
        }),
      },
    },
  }),
  [UPDATE_BOOK_VOTES_IN_SUGGESTED_BOOK]: () => ({
    ...state,
    add: {
      ...state.add,
      suggestedBooks: {
        ...state.add.suggestedBooks,
        data: updateIn(state.add.suggestedBooks.data, (book) => book.bookId === action.bookId, {
          votesCount: action.votesCount,
        }),
      },
    },
  }),
  [REMOVE_COMPLETED_STEP]: () => ({
    ...state,
    add: {
      ...state.add,
      completedSteps: state.add.completedSteps.filter((step) => step !== action.step),
    },
  }),
  [START_LOADING_SUGGESTED_BOOKS]: () => ({
    ...state,
    add: {
      ...state.add,
      suggestedBooks: {
        ...state.add.suggestedBooks,
        loadingDataStatus: PENDING,
      },
    },
  }),
  [CLEAR_SUGGESTED_BOOKS]: () => ({
    ...state,
    add: {
      ...state.add,
      suggestedBooks: getDefaultSuggestedBooksState(),
    },
  }),
  [LOADING_SUGGESTED_BOOKS_FAILED]: () => ({
    ...state,
    add: {
      ...state.add,
      suggestedBooks: {
        ...state.add.suggestedBooks,
        loadingDataStatus: FAILED,
      },
    },
  }),
  [SET_BOOK_EXISTS]: () => ({
    ...state,
    add: {
      ...state.add,
      bookExists: action.bookExists,
    },
  }),
  [SUGGESTED_BOOKS_LOADED]: () => ({
    ...state,
    add: {
      ...state.add,
      suggestedBooks: {
        ...state.add.suggestedBooks,
        loadingDataStatus: SUCCEEDED,
        data: action.data,
        pagination: {
          ...state.add.suggestedBooks.pagination,
          totalItems: action.totalItems,
          hasNextPage: action.hasNextPage,
        },
      },
    },
  }),
}));
