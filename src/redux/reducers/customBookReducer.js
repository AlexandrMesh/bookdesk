import updateIn from '~utils/updateIn';
import { IDLE, PENDING, FAILED, SUCCEEDED } from '~constants/loadingStatuses';
import { ALL } from '~constants/boardType';
import {
  SET_NEW_CUSTOM_BOOK_NAME,
  SET_NEW_CUSTOM_BOOK_NAME_ERROR,
  START_LOADING_SUGGESTED_BOOKS,
  LOADING_SUGGESTED_BOOKS_FAILED,
  SUGGESTED_BOOKS_LOADED,
  CLEAR_SUGGESTED_BOOKS,
  UPDATE_SUGGESTED_BOOK,
  UPDATE_BOOK_VOTES_IN_SUGGESTED_BOOK,
  SET_SHOULD_ADD_COVER,
  START_LOADING_SUGGESTED_COVERS,
  LOADING_SUGGESTED_COVERS_FAILED,
  SUGGESTED_COVERS_LOADED,
  SELECT_COVER,
  TOGGLE_EXPANDED_CATEGORY,
  SELECT_CATEGORY,
  SET_SEARCH_QUERY,
  CLEAR_CATEGORY,
  SUBMIT_CATEGORY,
  SET_STATUS,
  SET_PAGES,
  ADD_AUTHOR,
  REMOVE_AUTHOR,
  UPDATE_AUTHOR,
  SET_ANNOTATION,
  ALLOW_TO_ADD_BOOK,
  CLEAR_STEP_2,
  CLEAR_STEP_3,
  CLEAR_ADD_CUSTOM_BOOK_STATE,
  SET_CURRENT_STEP,
  SET_AVAILABLE_STEP,
  BOOK_ADDED,
  START_ADDING_BOOK,
  ADDING_BOOK_FAILED,
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

const getDefaultCategoryState = () => ({
  searchQuery: '',
  expanded: [],
  selectedCategory: {},
});

const getDefaultStep1State = () => ({
  updatingBookStatus: IDLE,
  name: {
    value: '',
    error: null,
  },
  allowToAddBook: false,
  suggestedBooks: getDefaultSuggestedBooksState(),
});

const getDefaultStep2State = () => ({
  shouldAddCover: undefined,
  suggestedCovers: getDefaultSuggestedCoversState(),
  selectedCover: '',
});

const getDefaultValueState = () => ({
  value: null,
  error: null,
});

const getDefaultBookState = () => ({
  added: false,
  loadingDataStatus: IDLE,
});

const getDefaultStep3State = () => ({
  category: getDefaultCategoryState(),
  editableCategory: getDefaultCategoryState(),
  status: ALL,
  pages: getDefaultValueState(),
  authorsList: [],
  annotation: getDefaultValueState(),
});

const getDefaultAddState = () => ({
  currentStep: 1,
  availableStep: 1,
  book: getDefaultBookState(),
  steps: {
    1: getDefaultStep1State(),
    2: getDefaultStep2State(),
    3: getDefaultStep3State(),
  },
});

const initialState = {
  add: getDefaultAddState(),
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
          name: {
            value: action.name,
            error: action.error,
          },
        },
      },
    },
  }),
  [START_ADDING_BOOK]: () => ({
    ...state,
    add: {
      ...state.add,
      book: {
        ...state.add.book,
        loadingDataStatus: PENDING,
      },
    },
  }),
  [ADDING_BOOK_FAILED]: () => ({
    ...state,
    add: {
      ...state.add,
      book: {
        ...state.add.book,
        added: false,
        loadingDataStatus: FAILED,
      },
    },
  }),
  [BOOK_ADDED]: () => ({
    ...state,
    add: {
      ...state.add,
      book: {
        ...state.add.book,
        added: true,
        loadingDataStatus: SUCCEEDED,
      },
    },
  }),
  [SET_CURRENT_STEP]: () => ({
    ...state,
    add: {
      ...state.add,
      currentStep: action.step,
    },
  }),
  [SET_AVAILABLE_STEP]: () => ({
    ...state,
    add: {
      ...state.add,
      availableStep: action.step,
    },
  }),
  [CLEAR_ADD_CUSTOM_BOOK_STATE]: () => ({
    ...state,
    add: getDefaultAddState(),
  }),
  [CLEAR_STEP_2]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        2: getDefaultStep2State(),
      },
    },
  }),
  [CLEAR_STEP_3]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        3: getDefaultStep3State(),
      },
    },
  }),
  [ALLOW_TO_ADD_BOOK]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        1: {
          ...state.add.steps[1],
          allowToAddBook: action.allow,
        },
      },
    },
  }),
  [SET_NEW_CUSTOM_BOOK_NAME_ERROR]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        1: {
          ...state.add.steps[1],
          name: {
            ...state.add.steps[1].name,
            error: action.error,
          },
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
          editableCategory: {
            ...state.add.steps[3].editableCategory,
            expanded: state.add.steps[3].editableCategory.expanded.includes(action.path)
              ? state.add.steps[3].editableCategory.expanded.filter((item) => item !== action.path)
              : [...state.add.steps[3].editableCategory.expanded, action.path],
          },
        },
      },
    },
  }),
  [SET_STATUS]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        3: {
          ...state.add.steps[3],
          status: action.status,
        },
      },
    },
  }),
  [SET_ANNOTATION]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        3: {
          ...state.add.steps[3],
          annotation: {
            value: action.annotation,
            error: action.error,
          },
        },
      },
    },
  }),
  [ADD_AUTHOR]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        3: {
          ...state.add.steps[3],
          authorsList: [...state.add.steps[3].authorsList, { id: action.id, name: null, error: null }],
        },
      },
    },
  }),
  [UPDATE_AUTHOR]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        3: {
          ...state.add.steps[3],
          authorsList: updateIn(state.add.steps[3].authorsList, (author) => author.id === action.id, {
            name: action.name,
            error: action.error,
          }),
        },
      },
    },
  }),
  [REMOVE_AUTHOR]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        3: {
          ...state.add.steps[3],
          authorsList: state.add.steps[3].authorsList.filter(({ id }) => id !== action.id),
        },
      },
    },
  }),
  [SET_PAGES]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        3: {
          ...state.add.steps[3],
          pages: {
            value: action.pages,
            error: action.error,
          },
        },
      },
    },
  }),
  [SELECT_CATEGORY]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        3: {
          ...state.add.steps[3],
          editableCategory: {
            ...state.add.steps[3].editableCategory,
            selectedCategory: action.category,
          },
        },
      },
    },
  }),
  [SUBMIT_CATEGORY]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        3: {
          ...state.add.steps[3],
          category: state.add.steps[3].editableCategory,
        },
      },
    },
  }),
  [SET_SEARCH_QUERY]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        3: {
          ...state.add.steps[3],
          editableCategory: {
            ...state.add.steps[3].editableCategory,
            searchQuery: action.query,
          },
        },
      },
    },
  }),
  [CLEAR_CATEGORY]: () => ({
    ...state,
    add: {
      ...state.add,
      steps: {
        ...state.add.steps,
        3: {
          ...state.add.steps[3],
          editableCategory: {
            ...state.add.steps[3].category,
            searchQuery: '',
          },
        },
      },
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
            data: updateIn(state.add.steps[1].suggestedBooks.data, (book) => book.bookId === action.bookId, {
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
            data: updateIn(state.add.steps[1].suggestedBooks.data, (book) => book.bookId === action.bookId, {
              votesCount: action.votesCount,
            }),
          },
        },
      },
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
