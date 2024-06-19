import { SET_STAT, TRIGGER_RELOAD_STAT } from '~redux/actions/statisticActions';
import createReducer from '~utils/createReducer';

const initialState = {
  stat: [],
  shouldReloadStat: false,
};

export default createReducer(initialState, (state, action) => ({
  [SET_STAT]: () => ({
    ...state,
    stat: action.data,
    shouldReloadStat: false,
  }),
  [TRIGGER_RELOAD_STAT]: () => ({
    ...state,
    shouldReloadStat: true,
  }),
}));
