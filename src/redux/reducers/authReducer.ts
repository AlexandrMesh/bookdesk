import { createReducer } from '@reduxjs/toolkit';
import * as authActions from '~redux/actions/authActions';
import { IDLE, PENDING, FAILED, SUCCEEDED } from '~constants/loadingStatuses';
import { IError, IProfile, IUpdateAppInfo } from '~types/auth';
import { LoadingType } from '~types/loadingTypes';

export interface ISignUpState {
  isSignedUp: boolean;
  loadingDataStatus: LoadingType;
  errors: IError;
}

export interface ISignInState {
  isSignedIn: boolean;
  isGoogleAccount: boolean;
  loadingDataStatus: LoadingType;
  errors: IError;
}

const getDefaultErrorsState = (): IError => ({
  email: '',
  password: '',
});

const getDefaultSignUpState = (): ISignUpState => ({
  isSignedUp: false,
  loadingDataStatus: IDLE,
  errors: getDefaultErrorsState(),
});

const getDefaultSignInState = (): ISignInState => ({
  isSignedIn: false,
  isGoogleAccount: false,
  loadingDataStatus: IDLE,
  errors: getDefaultErrorsState(),
});

const getDefaultUpdateAppInfo = (): IUpdateAppInfo => ({
  version: '',
  googlePlayUrl: '',
});

const getDefaultProfileState = (): IProfile => ({
  _id: '',
  email: '',
  registered: null,
  updated: null,
  supportApp: {
    confirmed: false,
    viewedAt: null,
  },
});

export interface IAuthState {
  profile: IProfile;
  updateAppInfo: IUpdateAppInfo;
  signUp: ISignUpState;
  signIn: ISignInState;
  checkingStatus: LoadingType;
}

export const getDefaultState = (): IAuthState => ({
  profile: getDefaultProfileState(),
  updateAppInfo: getDefaultUpdateAppInfo(),
  signUp: getDefaultSignUpState(),
  signIn: getDefaultSignInState(),
  checkingStatus: IDLE,
});

const defaultState = getDefaultState();

export default createReducer(defaultState, (builder) => {
  builder
    .addCase(authActions.startSignIn, (state) => {
      state.signIn.loadingDataStatus = PENDING;
    })
    .addCase(authActions.singInFailed, (state) => {
      state.signIn.loadingDataStatus = FAILED;
    })
    .addCase(authActions.signedIn, (state) => {
      state.signIn.isSignedIn = true;
      state.signIn.loadingDataStatus = SUCCEEDED;
    })
    .addCase(authActions.setSignInError, (state, { payload: { fieldName, error } }) => {
      state.signIn.errors[fieldName] = error as string;
    })
    .addCase(authActions.setUpdateAppInfo, (state, { payload: { version, googlePlayUrl } }) => {
      state.updateAppInfo.version = version;
      state.updateAppInfo.googlePlayUrl = googlePlayUrl;
    })
    .addCase(authActions.clearSignInErrors, (state) => {
      state.signIn.errors = getDefaultErrorsState();
    })
    .addCase(authActions.startSignUp, (state) => {
      state.signUp.loadingDataStatus = PENDING;
    })
    .addCase(authActions.signUpFailed, (state) => {
      state.signUp.loadingDataStatus = FAILED;
    })
    .addCase(authActions.setSignUpError, (state, { payload: { fieldName, error } }) => {
      state.signUp.errors[fieldName] = error as string;
    })
    .addCase(authActions.setIsGoogleAccount, (state, action) => {
      state.signIn.isGoogleAccount = action.payload;
    })
    .addCase(authActions.setProfile, (state, action) => {
      state.profile = action.payload;
    })
    .addCase(authActions.startAuthChecking, (state) => {
      state.checkingStatus = PENDING;
    })
    .addCase(authActions.authChecked, (state) => {
      state.checkingStatus = SUCCEEDED;
    })
    .addCase(authActions.authCheckingFailed, (state) => {
      state.checkingStatus = FAILED;
    })
    .addCase(authActions.clearProfile, (state) => {
      state.profile = getDefaultProfileState();
      state.signUp = getDefaultSignUpState();
      state.signIn = getDefaultSignInState();
    });
});
