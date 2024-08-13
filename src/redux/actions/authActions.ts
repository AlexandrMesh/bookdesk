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

const PREFIX = 'AUTH';

export const authCheckingFailed = createAction(`${PREFIX}/authCheckingFailed`);
export const setSignInError = createAction<{ fieldName: string; error: string | null }>(`${PREFIX}/setSignInError`);
export const setSignUpError = createAction<{ fieldName: string; error: string | null }>(`${PREFIX}/setSignUpError`);

export const getConfig = createAsyncThunk(`${PREFIX}/getConfig`, async (url: string) => {
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
      appName,
      email,
      description,
      descriptionEn,
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
    await AsyncStorage.setItem('appName', appName);
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('description', i18n.language === RU ? description : descriptionEn);

    return {
      apiUrl: data?.apiUrl,
      imgUrl: data?.imgUrl,
      minimumSupportedAppVersion: data?.minimumSupportedAppVersion,
      googlePlayUrl: data?.googlePlayUrl,
      underConstruction: data?.underConstruction,
      appVersion: data?.appVersion,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const signInFailed = createAsyncThunk(`${PREFIX}/signInFailed`, async (error: { response: { data: { fieldName: string; key: string } } }) => {
  const responseData = error?.response?.data;
  if (responseData) {
    const { fieldName, key } = responseData;
    return {
      fieldName,
      error: getT('errors')(key),
    };
  }
  return {
    fieldName: 'password',
    error: getT('errors')('serverNotAvailable'),
  };
});

export const checkAuth = createAsyncThunk(`${PREFIX}/checkAuth`, async (token: string, { dispatch }) => {
  if (!token) {
    dispatch(authCheckingFailed());
    return {
      profile: {},
      isGoogleAccount: false,
      isSignedIn: false,
    };
  }
  try {
    const result = await Promise.all([GoogleSignin.isSignedIn(), AuthService().checkAuth(token)]);
    const isGoogleSignedIn = result[0];
    const { data } = result[1];
    if (data.profile) {
      const { numberOfPagesForGoal } = data;
      if (numberOfPagesForGoal) {
        dispatch(setGoal(numberOfPagesForGoal));
      }
      dispatch(setBookVotes(data.userVotes));
      dispatch(userBookRatingsLoaded(data.userBookRatings));
      return {
        profile: data.profile,
        isGoogleAccount: isGoogleSignedIn,
        isSignedIn: true,
      };
    }
    return {
      profile: {},
      isGoogleAccount: false,
      isSignedIn: false,
    };
  } catch (error) {
    dispatch(signInFailed(error as any));
    throw error;
  }
});

export const signIn = createAsyncThunk(
  `${PREFIX}/signIn`,
  async ({ email, password, isGoogleAccount }: { email: string; password: string; isGoogleAccount?: boolean }, { dispatch }) => {
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
          if (data.numberOfPagesForGoal) {
            dispatch(setGoal(data.numberOfPagesForGoal));
          }
          dispatch(setBookVotes(data.userVotes));
          dispatch(userBookRatingsLoaded(data.userBookRatings));
          try {
            await AsyncStorage.setItem('token', data.token);
          } catch (error) {
            console.error(error);
          }
          return {
            isSignedIn: true,
            profile: data.profile,
            isGoogleAccount: true,
          };
        }
        return {
          profile: {},
          isSignedIn: false,
          isGoogleAccount: true,
        };
      } catch (error) {
        dispatch(signInFailed(error as any));
        throw error;
      }
    } else {
      try {
        const { data } = await AuthService().signIn({ email, password });
        if (data) {
          if (data.numberOfPagesForGoal) {
            dispatch(setGoal(data.numberOfPagesForGoal));
          }
          dispatch(setBookVotes(data.userVotes));
          dispatch(userBookRatingsLoaded(data.userBookRatings));
          try {
            await AsyncStorage.setItem('token', data.token);
          } catch (error) {
            console.error(error);
          }
          return {
            isSignedIn: true,
            profile: data.profile,
            isGoogleAccount: false,
          };
        }
        return {
          profile: {},
          isSignedIn: false,
          isGoogleAccount: false,
        };
      } catch (error) {
        dispatch(signInFailed(error as any));
        throw error;
      }
    }
  },
);

export const signUp = createAsyncThunk(`${PREFIX}/signUp`, async ({ email, password }: { email: string; password: string }, { dispatch }) => {
  try {
    const { data } = await AuthService().signUp({ email, password, language: NativeModules?.I18nManager?.localeIdentifier });
    if (data) {
      try {
        await AsyncStorage.setItem('token', data.token);
      } catch (error) {
        console.error(error);
      }
      return {
        isSignedIn: true,
        profile: data.profile,
      };
    }
    return {
      isSignedIn: false,
      profile: {},
    };
  } catch (error) {
    const responseData = (error as any)?.response?.data;
    if (responseData) {
      const { fieldName, key } = responseData;
      dispatch(setSignUpError({ fieldName, error: getT('errors')(key) }));
    } else {
      dispatch(setSignUpError({ fieldName: 'password', error: getT('errors')('serverNotAvailable') }));
    }
    throw error;
  }
});

export const signOut = createAsyncThunk(`${PREFIX}/signOut`, async (_, { dispatch }) => {
  try {
    await AsyncStorage.removeItem('token');
    dispatch(clearBooksData());
    const isGoogleSignedIn = await GoogleSignin.isSignedIn();
    if (isGoogleSignedIn) {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
});
