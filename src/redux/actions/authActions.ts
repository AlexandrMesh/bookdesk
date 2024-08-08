import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { NativeModules } from 'react-native';
import axios from 'axios';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearBooksData, setBookVotes, userBookRatingsLoaded } from '~redux/actions/booksActions';
import { setGoal } from '~redux/actions/goalsActions';
import AuthService from '~http/services/auth';
import i18n, { getT } from '~translations/i18n';
import { RU } from '~constants/languages';
import { IProfile } from '~types/auth';

const PREFIX = 'AUTH';

export const clearProfile = createAction(`${PREFIX}/clearProfile`);
export const clearSignInErrors = createAction(`${PREFIX}/clearSignInErrors`);
export const clearSignUpErrors = createAction(`${PREFIX}/clearSignUpErrors`);
export const startAuthChecking = createAction(`${PREFIX}/startAuthChecking`);
export const authCheckingFailed = createAction(`${PREFIX}/authCheckingFailed`);
export const authChecked = createAction(`${PREFIX}/authChecked`);
export const startSignIn = createAction(`${PREFIX}/startSignIn`);
export const singInFailed = createAction(`${PREFIX}/singInFailed`);
export const signedIn = createAction(`${PREFIX}/signedIn`);
export const startSignUp = createAction(`${PREFIX}/startSignUp`);
export const signUpFailed = createAction(`${PREFIX}/signUpFailed`);
export const signedUp = createAction(`${PREFIX}/signedUp`);
export const setUpdateAppInfo = createAction<{ version: string; googlePlayUrl: string }>(`${PREFIX}/setUpdateAppInfo`);
export const setSignInError = createAction<{ fieldName: string; error: string | null }>(`${PREFIX}/setSignInError`);
export const setSignUpError = createAction<{ fieldName: string; error: string | null }>(`${PREFIX}/setSignUpError`);
export const setIsGoogleAccount = createAction<boolean>(`${PREFIX}/setIsGoogleAccount`);
export const setProfile = createAction<IProfile>(`${PREFIX}/setProfile`);

export const getConfig = createAsyncThunk(`${PREFIX}/getConfig`, async (url: string, { dispatch }) => {
  try {
    const { data } = await axios({
      method: 'get',
      url,
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
      timeout: 5000,
    });
    const {
      apiUrl,
      imgUrl,
      googlePlayUrl,
      appVersion,
      underConstruction,
      underConstructionMessage,
      underConstructionMessageEn,
      enabledSupportAppModal,
      daysRegisteredUserFromNowToDisplaySupportAppModal,
      daysViewedSupportModalFromNowToDisplaySupportAppModal,
    } = data || {};
    await AsyncStorage.setItem('apiUrl', apiUrl);
    await AsyncStorage.setItem('imgUrl', imgUrl);
    await AsyncStorage.setItem('googlePlayUrl', googlePlayUrl);
    await AsyncStorage.setItem('appVersion', appVersion);
    await AsyncStorage.setItem('enabledSupportAppModal', enabledSupportAppModal);
    await AsyncStorage.setItem('daysRegisteredUserFromNowToDisplaySupportAppModal', daysRegisteredUserFromNowToDisplaySupportAppModal);
    await AsyncStorage.setItem('daysViewedSupportModalFromNowToDisplaySupportAppModal', daysViewedSupportModalFromNowToDisplaySupportAppModal);
    await AsyncStorage.setItem('underConstruction', underConstruction);
    await AsyncStorage.setItem('underConstructionMessage', i18n.language === RU ? underConstructionMessage : underConstructionMessageEn);
    dispatch(setUpdateAppInfo({ version: data?.appVersion, googlePlayUrl: data?.googlePlayUrl }));

    return {
      apiUrl: data?.apiUrl,
      imgUrl: data?.imgUrl,
      minimumSupportedAppVersion: data?.minimumSupportedAppVersion,
      googlePlayUrl: data?.googlePlayUrl,
      underConstruction: data?.underConstruction,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const signInFailed = createAsyncThunk(
  `${PREFIX}/signInFailed`,
  async (error: { response: { data: { fieldName: string; key: string } } }, { dispatch }) => {
    dispatch(singInFailed());
    const responseData = error?.response?.data;
    if (responseData) {
      const { fieldName, key } = responseData;
      dispatch(setSignInError({ fieldName, error: getT('errors')(key) }));
    } else {
      dispatch(setSignInError({ fieldName: 'password', error: getT('errors')('serverNotAvailable') }));
    }
  },
);

export const checkAuth = createAsyncThunk(`${PREFIX}/checkAuth`, async (token: string, { dispatch }) => {
  dispatch(startAuthChecking());
  if (!token) {
    dispatch(authCheckingFailed());
  } else {
    try {
      const result = await Promise.all([GoogleSignin.isSignedIn(), AuthService().checkAuth(token)]);
      const isGoogleSignedIn = result[0];
      const { data } = result[1];
      if (data.profile) {
        const { _id, email, registered, updated, supportApp } = data.profile;
        const { numberOfPagesForGoal } = data;
        if (numberOfPagesForGoal) {
          dispatch(setGoal(numberOfPagesForGoal));
        }
        dispatch(setProfile({ _id, email, registered, updated, supportApp }));
        dispatch(setBookVotes(data.userVotes));
        dispatch(userBookRatingsLoaded(data.userBookRatings));
        dispatch(signedIn());
        dispatch(authChecked());
        return isGoogleSignedIn && dispatch(setIsGoogleAccount(true));
      }
    } catch (error) {
      dispatch(signInFailed(error as any));
      dispatch(authCheckingFailed());
    }
  }
});

export const signIn = createAsyncThunk(
  `${PREFIX}/signIn`,
  async ({ email, password, isGoogleAccount }: { email: string; password: string; isGoogleAccount?: boolean }, { dispatch }) => {
    dispatch(startSignIn());
    if (isGoogleAccount) {
      try {
        await GoogleSignin.hasPlayServices();
        const {
          idToken,
          user: { email: googleEmail },
        } = await GoogleSignin.signIn();
        const { data } = await AuthService().signIn({
          email: googleEmail,
          googleToken: idToken,
          language: NativeModules?.I18nManager?.localeIdentifier,
        });
        if (data) {
          dispatch(signedIn());
          if (data.numberOfPagesForGoal) {
            dispatch(setGoal(data.numberOfPagesForGoal));
          }
          dispatch(setProfile(data.profile));
          dispatch(setBookVotes(data.userVotes));
          dispatch(userBookRatingsLoaded(data.userBookRatings));
          dispatch(setIsGoogleAccount(true));
          try {
            await AsyncStorage.setItem('token', data.token);
          } catch (error) {
            console.error(error);
          }
        }
      } catch (error) {
        dispatch(signInFailed(error as any));
      }
    } else {
      try {
        const { data } = await AuthService().signIn({ email, password });
        if (data) {
          dispatch(signedIn());
          if (data.numberOfPagesForGoal) {
            dispatch(setGoal(data.numberOfPagesForGoal));
          }
          dispatch(setProfile(data.profile));
          dispatch(setBookVotes(data.userVotes));
          dispatch(userBookRatingsLoaded(data.userBookRatings));
          try {
            await AsyncStorage.setItem('token', data.token);
          } catch (error) {
            console.error(error);
          }
        }
      } catch (error) {
        dispatch(signInFailed(error as any));
      }
    }
  },
);

export const signUp = createAsyncThunk(`${PREFIX}/signUp`, async ({ email, password }: { email: string; password: string }, { dispatch }) => {
  dispatch(startSignUp());
  try {
    const { data } = await AuthService().signUp({ email, password, language: NativeModules?.I18nManager?.localeIdentifier });
    if (data) {
      dispatch(signedUp());
      dispatch(signedIn());
      dispatch(setProfile(data.profile));
      try {
        await AsyncStorage.setItem('token', data.token);
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    dispatch(signUpFailed());
    const responseData = (error as any)?.response?.data;
    if (responseData) {
      const { fieldName, key } = responseData;
      dispatch(setSignUpError({ fieldName, error: getT('errors')(key) }));
    } else {
      dispatch(setSignUpError({ fieldName: 'password', error: getT('errors')('serverNotAvailable') }));
    }
  }
});

export const signOut = createAsyncThunk(`${PREFIX}/signOut`, async (_, { dispatch }) => {
  try {
    await AsyncStorage.removeItem('token');
    dispatch(clearProfile());
    dispatch(clearBooksData());
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
});
