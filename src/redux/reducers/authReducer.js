import { IDLE, PENDING, FAILED, SUCCEEDED } from '~constants/loadingStatuses';
import createReducer from '~utils/createReducer';
import {
  START_SIGN_IN,
  SIGN_IN_FAILED,
  SIGNED_IN,
  START_SIGN_UP,
  SIGN_UP_FAILED,
  SET_IS_GOOGLE_ACCOUNT,
  SET_PROFILE,
  START_AUTH_CHECKING,
  CHECKING_AUTH_FAILED,
  AUTH_CHECKED,
  SET_SIGN_IN_ERROR,
  SET_SIGN_UP_ERROR,
  CLEAR_PROFILE,
  CLEAR_SIGN_IN_ERRORS,
  CLEAR_SIGN_UP_ERRORS,
  SET_UPDATE_APP_INFO,
} from '~redux/actions/authActions';

const getDefaultErrorsState = () => ({
  email: '',
  password: '',
});

const getDefaultSignUpState = () => ({
  isSignedUp: false,
  loadingDataStatus: IDLE,
  errors: getDefaultErrorsState(),
});

const getDefaultSignInState = () => ({
  isSignedIn: false,
  isGoogleAccount: false,
  loadingDataStatus: IDLE,
  errors: getDefaultErrorsState(),
});

const getDefaultUpdateAppInfo = () => ({
  version: '',
  googlePlayUrl: '',
});

const initialState = {
  profile: {},
  updateAppInfo: getDefaultUpdateAppInfo(),
  signUp: getDefaultSignUpState(),
  signIn: getDefaultSignInState(),
  checkingStatus: IDLE,
};

export default createReducer(initialState, (state, action) => ({
  [START_SIGN_IN]: () => ({
    ...state,
    signIn: {
      ...state.signIn,
      loadingDataStatus: PENDING,
    },
  }),
  [SIGN_IN_FAILED]: () => ({
    ...state,
    signIn: {
      ...state.signIn,
      loadingDataStatus: FAILED,
    },
  }),
  [SIGNED_IN]: () => ({
    ...state,
    signIn: {
      ...state.signIn,
      isSignedIn: true,
      loadingDataStatus: SUCCEEDED,
    },
  }),
  [SET_SIGN_IN_ERROR]: () => ({
    ...state,
    signIn: {
      ...state.signIn,
      errors: {
        ...state.signIn.errors,
        [action.fieldName]: action.error,
      },
    },
  }),
  [SET_UPDATE_APP_INFO]: () => ({
    ...state,
    updateAppInfo: {
      version: action.version,
      googlePlayUrl: action.googlePlayUrl,
    },
  }),
  [CLEAR_SIGN_IN_ERRORS]: () => ({
    ...state,
    signIn: {
      ...state.signIn,
      errors: getDefaultErrorsState(),
    },
  }),
  [CLEAR_SIGN_UP_ERRORS]: () => ({
    ...state,
    signUp: {
      ...state.signUp,
      errors: getDefaultErrorsState(),
    },
  }),
  [START_SIGN_UP]: () => ({
    ...state,
    signUp: {
      ...state.signUp,
      loadingDataStatus: PENDING,
    },
  }),
  [SIGN_UP_FAILED]: () => ({
    ...state,
    signUp: {
      ...state.signUp,
      loadingDataStatus: FAILED,
    },
  }),
  [SET_SIGN_UP_ERROR]: () => ({
    ...state,
    signUp: {
      ...state.signUp,
      errors: {
        ...state.signUp.errors,
        [action.fieldName]: action.error,
      },
    },
  }),
  [SET_IS_GOOGLE_ACCOUNT]: () => ({
    ...state,
    signIn: {
      ...state.signIn,
      isGoogleAccount: action.isGoogleAccount,
    },
  }),
  [SET_PROFILE]: () => ({
    ...state,
    profile: action.profile,
  }),
  [START_AUTH_CHECKING]: () => ({
    ...state,
    checkingStatus: PENDING,
  }),
  [AUTH_CHECKED]: () => ({
    ...state,
    checkingStatus: SUCCEEDED,
  }),
  [CHECKING_AUTH_FAILED]: () => ({
    ...state,
    checkingStatus: FAILED,
  }),
  [CLEAR_PROFILE]: () => ({
    ...state,
    profile: {},
    signUp: getDefaultSignUpState(),
    signIn: getDefaultSignInState(),
    updateAppInfo: getDefaultUpdateAppInfo(),
  }),
}));
