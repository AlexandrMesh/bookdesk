import { ADD_GOAL_ITEM, SET_GOAL, SET_GOAL_ITEMS } from '~redux/actions/goalsActions';
import createReducer from '~utils/createReducer';

const initialState = {
  goal: {
    numberOfPages: null,
    data: [],
  },
};

export default createReducer(initialState, (state, action) => ({
  [ADD_GOAL_ITEM]: () => ({
    ...state,
    goal: {
      ...state.goal,
      data: [...state.data, action.item],
    },
  }),
  [SET_GOAL_ITEMS]: () => ({
    ...state,
    goal: {
      ...state.goal,
      data: action.items,
    },
  }),
  [SET_GOAL]: () => ({
    ...state,
    goal: {
      ...state.goal,
      numberOfPages: action.numberOfPages,
    },
  }),
}));
