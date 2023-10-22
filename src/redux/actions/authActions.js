import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearBooksData, setBookVotes } from '~redux/actions/booksActions';
import AuthService from '~http/services/auth';

const PREFIX = 'AUTH';

export const START_SIGN_IN = `${PREFIX}/START_SIGN_IN`;
export const SIGN_IN_FAILED = `${PREFIX}/SIGN_IN_FAILED`;
export const SIGNED_IN = `${PREFIX}/SIGNED_IN`;

export const SET_IS_GOOGLE_ACCOUNT = `${PREFIX}/SET_IS_GOOGLE_ACCOUNT`;
export const SET_PROFILE = `${PREFIX}/SET_PROFILE`;
export const SET_IS_CHECKED = `${PREFIX}/SET_IS_CHECKED`;
export const SET_SIGN_IN_ERROR = `${PREFIX}/SET_SIGN_IN_ERROR`;
export const START_AUTH_CHECKING = `${PREFIX}/START_AUTH_CHECKING`;
export const CHECKING_AUTH_FAILED = `${PREFIX}/CHECKING_AUTH_FAILED`;
export const AUTH_CHECKED = `${PREFIX}/AUTH_CHECKED`;

export const START_SIGN_UP = `${PREFIX}/START_SIGN_UP`;
export const SIGN_UP_FAILED = `${PREFIX}/SIGN_UP_FAILED`;
export const SIGNED_UP = `${PREFIX}/SIGNED_UP`;
export const SET_SIGN_UP_ERROR = `${PREFIX}/SET_SIGN_UP_ERROR`;
export const CLEAR_PROFILE = `${PREFIX}/CLEAR_PROFILE`;
export const CLEAR_SIGN_IN_ERRORS = `${PREFIX}/CLEAR_SIGN_IN_ERRORS`;
export const CLEAR_SIGN_UP_ERRORS = `${PREFIX}/CLEAR_SIGN_UP_ERRORS`;

export const clearProfile = {
  type: CLEAR_PROFILE,
};

export const clearSignInErrors = {
  type: CLEAR_SIGN_IN_ERRORS,
};

export const clearSignUpErrors = {
  type: CLEAR_SIGN_UP_ERRORS,
};

export const startAuthChecking = {
  type: START_AUTH_CHECKING,
};

export const authCheckingFailed = {
  type: CHECKING_AUTH_FAILED,
};

export const authChecked = {
  type: AUTH_CHECKED,
};

export const startSignIn = {
  type: START_SIGN_IN,
};

export const singInFailed = {
  type: SIGN_IN_FAILED,
};

export const signedIn = {
  type: SIGNED_IN,
};

export const startSignUp = {
  type: START_SIGN_UP,
};

export const signUpFailed = {
  type: SIGN_UP_FAILED,
};

export const signedUp = {
  type: SIGNED_UP,
};

export const setSignInError = (fieldName, error) => ({
  type: SET_SIGN_IN_ERROR,
  fieldName,
  error,
});

export const setSignUpError = (fieldName, error) => ({
  type: SET_SIGN_UP_ERROR,
  fieldName,
  error,
});

export const setIsGoogleAccount = (isGoogleAccount) => ({
  type: SET_IS_GOOGLE_ACCOUNT,
  isGoogleAccount,
});

export const setProfile = (profile) => ({
  type: SET_PROFILE,
  profile,
});

export const checkAuth = (token) => async (dispatch) => {
  if (!token) {
    dispatch(authCheckingFailed);
  } else {
    dispatch(startAuthChecking);
    try {
      const isGoogleSignedIn = await GoogleSignin.isSignedIn();
      const { data } = await AuthService().checkAuth(token);
      if (data.profile) {
        const { _id, email, registered, updated } = data.profile;
        dispatch(setProfile({ _id, email, registered, updated }));
        dispatch(setBookVotes(data.userVotes));
        dispatch(signedIn);
        dispatch(authChecked);
        return isGoogleSignedIn && dispatch(setIsGoogleAccount(true));
      }
    } catch (error) {
      dispatch(authCheckingFailed);
    }
  }
  return true;
};

const signInFailed = (error) => async (dispatch) => {
  dispatch(singInFailed);
  const responseData = error?.response?.data;
  if (responseData) {
    const { fieldName, key } = responseData;
    dispatch(setSignInError(fieldName, key));
  } else {
    dispatch(setSignInError('password', 'serverNotAvailable'));
  }
};

export const signIn =
  ({ email, password, isGoogleAccount }) =>
  async (dispatch) => {
    dispatch(startSignIn);
    if (isGoogleAccount) {
      try {
        await GoogleSignin.hasPlayServices();
        const {
          idToken,
          user: { email: googleEmail },
        } = await GoogleSignin.signIn();
        const { data } = await AuthService().signIn({ email: googleEmail, googleToken: idToken });
        if (data) {
          dispatch(signedIn);
          dispatch(setProfile(data.profile));
          dispatch(setBookVotes(data.userVotes));
          dispatch(setIsGoogleAccount(true));
          try {
            await AsyncStorage.setItem('token', data.token);
          } catch (error) {
            console.error(error);
          }
        }
      } catch (error) {
        dispatch(signInFailed(error));
      }
    } else {
      try {
        const { data } = await AuthService().signIn({ email, password });
        if (data) {
          dispatch(signedIn);
          dispatch(setProfile(data.profile));
          dispatch(setBookVotes(data.userVotes));
          try {
            await AsyncStorage.setItem('token', data.token);
          } catch (error) {
            console.error(error);
          }
        }
      } catch (error) {
        dispatch(signInFailed(error));
      }
    }
    return true;
  };

export const signUp =
  ({ email, password }) =>
  async (dispatch) => {
    dispatch(startSignUp);
    try {
      const { data } = await AuthService().signUp({ email, password });
      if (data) {
        dispatch(signedUp);
        dispatch(signedIn);
        dispatch(setProfile(data.profile));
        try {
          await AsyncStorage.setItem('token', data.token);
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      dispatch(signUpFailed);
      const responseData = error?.response?.data;
      if (responseData) {
        const { fieldName, key } = responseData;
        dispatch(setSignUpError(fieldName, key));
      } else {
        dispatch(setSignUpError('password', 'serverNotAvailable'));
      }
    }
    return true;
  };

export const signOut = async (dispatch) => {
  try {
    await AsyncStorage.removeItem('token');
    dispatch(clearProfile);
    dispatch(clearBooksData);
  } catch (error) {
    console.error(error);
  } finally {
    try {
      const isGoogleSignedIn = await GoogleSignin.isSignedIn();
      if (isGoogleSignedIn) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        dispatch(setIsGoogleAccount(false));
      }
    } catch (error) {
      console.error(error);
    } finally {
      // dispatch(setSignInLoading(false));
    }
  }
  return true;
};
