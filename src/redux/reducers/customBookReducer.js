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
  SET_SHOULD_ADD_COVER,
  START_LOADING_SUGGESTED_COVERS,
  LOADING_SUGGESTED_COVERS_FAILED,
  SUGGESTED_COVERS_LOADED,
  SELECT_COVER,
  TOGGLE_EXPANDED_CATEGORY,
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

const getDefaultSuggestedCoversState = () => ({
  data: [],
  loadingDataStatus: IDLE,
});

const initialState = {
  add: {
    completedSteps: [],
    steps: {
      1: {
        updatingBookStatus: IDLE,
        name: '',
        bookExists: false,
        suggestedBooks: getDefaultSuggestedBooksState(),
      },
      2: {
        shouldAddCover: undefined,
        suggestedCovers: getDefaultSuggestedCoversState(),
        selectedCover: '',
      },
      3: {
        category: {
          searchQuery: '',
          expanded: [],
          selectedCategory: '',
        },
      },
    },
  },
};

export default createReducer(initialState, (state, action) => ({
  [SET_NEW_CUSTOM_BOOK_NAME]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        1: {
          ...state.add.steps[1],
          name: action.name,
        },
      },
    },
  }),
  [TOGGLE_EXPANDED_CATEGORY]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        3: {
          ...state.add.steps[3],
          category: {
            ...state.add.steps[3].category,
            expanded: state.add.steps[3].category.expanded.includes(action.path)
              ? state.add.steps[3].category.expanded.filter((item) => item !== action.path)
              : [...state.add.steps[3].category.expanded, action.path],
          },
        },
      },
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
      steps: {
        ...state.add.steps,
        1: {
          ...state.add.steps[1],
          updatingBookStatus: SUCCEEDED,
          suggestedBooks: {
            ...state.add.steps[1].suggestedBooks,
            data: updateIn(...state.add.steps[1].suggestedBooks.data, (book) => book.bookId === action.bookId, {
              bookStatus: action.bookStatus,
              added: action.added,
            }),
          },
        },
      },
    },
  }),
  [UPDATE_BOOK_VOTES_IN_SUGGESTED_BOOK]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        1: {
          ...state.add.steps[1],
          suggestedBooks: {
            ...state.add.steps[1].suggestedBooks,
            data: updateIn(...state.add.steps[1].suggestedBooks.data, (book) => book.bookId === action.bookId, {
              votesCount: action.votesCount,
            }),
          },
        },
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
      steps: {
        ...state.add.steps,
        1: {
          ...state.add.steps[1],
          suggestedBooks: {
            ...state.add.steps[1].suggestedBooks,
            loadingDataStatus: PENDING,
          },
        },
      },
    },
  }),
  [CLEAR_SUGGESTED_BOOKS]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        1: {
          ...state.add.steps[1],
          suggestedBooks: getDefaultSuggestedBooksState(),
        },
      },
    },
  }),
  [LOADING_SUGGESTED_BOOKS_FAILED]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        1: {
          ...state.add.steps[1],
          suggestedBooks: {
            ...state.add.steps[1].suggestedBooks,
            loadingDataStatus: FAILED,
          },
        },
      },
    },
  }),
  [SET_BOOK_EXISTS]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        1: {
          ...state.add.steps[1],
          bookExists: action.bookExists,
        },
      },
    },
  }),
  [SUGGESTED_BOOKS_LOADED]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        1: {
          ...state.add.steps[1],
          suggestedBooks: {
            ...state.add.steps[1].suggestedBooks,
            loadingDataStatus: SUCCEEDED,
            data: action.data,
            pagination: {
              ...state.add.steps[1].suggestedBooks.pagination,
              totalItems: action.totalItems,
              hasNextPage: action.hasNextPage,
            },
          },
        },
      },
    },
  }),
  [SET_SHOULD_ADD_COVER]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        2: {
          ...state.add.steps[2],
          shouldAddCover: action.add,
        },
      },
    },
  }),
  [START_LOADING_SUGGESTED_COVERS]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        2: {
          ...state.add.steps[2],
          suggestedCovers: {
            ...state.add.steps[2].suggestedCovers,
            loadingDataStatus: PENDING,
          },
        },
      },
    },
  }),
  [LOADING_SUGGESTED_COVERS_FAILED]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        2: {
          ...state.add.steps[2],
          suggestedCovers: {
            ...state.add.steps[2].suggestedCovers,
            loadingDataStatus: FAILED,
          },
        },
      },
    },
  }),
  [SUGGESTED_COVERS_LOADED]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        2: {
          ...state.add.steps[2],
          suggestedCovers: {
            ...state.add.steps[2].suggestedCovers,
            data: action.data,
            loadingDataStatus: SUCCEEDED,
          },
        },
      },
    },
  }),
  [SELECT_COVER]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        2: {
          ...state.add.steps[2],
          selectedCover: action.cover,
        },
      },
    },
  }),
}));
