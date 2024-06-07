import { IDLE, PENDING, FAILED, SUCCEEDED } from '~constants/loadingStatuses';
import { START_LOADING_APP_INFO, APP_INFO_LOADED, LOADING_APP_INFO_FAILED, CLEAR_APP_INFO } from '~redux/actions/appActions';
import createReducer from '~utils/createReducer';

const initialState = {
  data: {
    name: '',
    version: '',
    description: '',
    email: '',
  },
  loadingDataStatus: IDLE,
};

export default createReducer(initialState, (state, action) => ({
  [START_LOADING_APP_INFO]: () => ({
    ...state,
    loadingDataStatus: PENDING,
  }),
  [APP_INFO_LOADED]: () => ({
    ...state,
    data: {
      name: action.name,
      version: action.version,
      description: action.description,
      email: action.email,
    },
    loadingDataStatus: SUCCEEDED,
  }),
  [LOADING_APP_INFO_FAILED]: () => ({
    ...state,
    loadingDataStatus: FAILED,
  }),
  [CLEAR_APP_INFO]: () => initialState,
}));
