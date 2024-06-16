import { SET_STAT } from '~redux/actions/statisticActions';
import createReducer from '~utils/createReducer';

const initialState = {
  stat: [],
};

export default createReducer(initialState, (state, action) => ({
  [SET_STAT]: () => ({
    ...state,
    stat: action.data,
  }),
}));
