import { ADD_GOAL_ITEM, GOAL_ADDED } from '~redux/actions/goalsActions';
import createReducer from '~utils/createReducer';

const initialState = {
  goal: {
    numberOfPages: 100,
    data: [
      {
        id: 0.1083718596008456,
        pages: '31',
        added_at: 1710244044000,
      },
      {
        id: 0.7023727596908356,
        pages: '55',
        added_at: 1710676044000,
      },
      {
        id: 0.7083728596008456,
        pages: '23',
        added_at: 1713354444000,
      },
      {
        id: 0.7083727596908456,
        pages: '15',
        added_at: 1713314844000,
      },
      {
        id: 0.7083727596008456,
        pages: '21',
        added_at: 1713088044000,
      },
      {
        id: 0.3083727596008456,
        pages: '25',
        added_at: 1713088044000,
      },
      {
        id: 0.1083727596008456,
        pages: '133',
        added_at: 1713088044000,
      },
      {
        id: 0.7083727596008456,
        pages: '332',
        added_at: 1713173915388,
      },
      {
        id: 0.39799936618877396,
        pages: '33',
        added_at: 1713173909570,
      },
      {
        id: 0.7083727592008456,
        pages: '49',
        added_at: 1713260844000,
      },
      {
        id: 0.2183727592008456,
        pages: '51',
        added_at: 1713268044000,
      },
      {
        id: 0.2383727592008456,
        pages: '111',
        added_at: 1713228444000,
      },
    ],
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
  [GOAL_ADDED]: () => ({
    ...state,
    goal: {
      ...state.goal,
      numberOfPages: action.numberOfPages,
    },
  }),
}));
