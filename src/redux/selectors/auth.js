import { createSelector } from 'reselect';
import DeviceInfo from 'react-native-device-info';

const getAuth = (state) => state.auth;
const getSignIn = (state) => getAuth(state).signIn;
const getSignUp = (state) => getAuth(state).signUp;
const getProfile = (state) => getAuth(state).profile;
const getUpdateAppInfo = (state) => getAuth(state).updateAppInfo;

export const getUserId = (state) => getProfile(state)._id;
export const getUserEmail = (state) => getProfile(state).email;
export const getRegistered = (state) => getProfile(state).registered;
export const getSupportAppViewedAt = (state) => getProfile(state).supportApp?.viewedAt;
export const getSignInEmail = (state) => getSignIn(state).email?.value;
export const getSignInPassword = (state) => getSignIn(state).password?.value;
export const getSignInLoadingDataStatus = (state) => getSignIn(state).loadingDataStatus;

export const getIsSignedIn = (state) => getSignIn(state).isSignedIn;
export const getSignInErrors = (state) => getSignIn(state).errors;

export const getIsSignedUp = (state) => getSignUp(state).isSignedUp;
export const getSignUpLoadingDataStatus = (state) => getSignUp(state).loadingDataStatus;
export const getSignUpEmail = (state) => getSignUp(state).email.value;
export const getSignUpPassword = (state) => getSignUp(state).password.value;
export const getSignUpErrors = (state) => getSignUp(state).errors;

export const getCheckingStatus = (state) => getAuth(state).checkingStatus;

export const getAppVersion = (state) => getUpdateAppInfo(state).version;
export const getGooglePlayUrl = (state) => getUpdateAppInfo(state).googlePlayUrl;

export const deriveIsTheLatestAppVersion = createSelector([getAppVersion], (appVersion) => appVersion === DeviceInfo.getVersion());
