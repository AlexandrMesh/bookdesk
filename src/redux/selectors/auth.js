const getAuth = (state) => state.auth;
const getSignIn = (state) => getAuth(state).signIn;
const getSignUp = (state) => getAuth(state).signUp;
const getProfile = (state) => getAuth(state).profile;

export const getUserId = (state) => getProfile(state)._id;
export const getUserEmail = (state) => getProfile(state).email;
export const getRegistered = (state) => getProfile(state).registered;
export const getSignInEmail = (state) => getSignIn(state).email.value;
export const getSignInPassword = (state) => getSignIn(state).password.value;
export const getSignInLoadingDataStatus = (state) => getSignIn(state).loadingDataStatus;

export const getIsSignedIn = (state) => getSignIn(state).isSignedIn;
export const getSignInErrors = (state) => getSignIn(state).errors;

export const getIsSignedUp = (state) => getSignUp(state).isSignedUp;
export const getSignUpLoadingDataStatus = (state) => getSignUp(state).loadingDataStatus;
export const getSignUpEmail = (state) => getSignUp(state).email.value;
export const getSignUpPassword = (state) => getSignUp(state).password.value;
export const getSignUpErrors = (state) => getSignUp(state).errors;

export const getCheckingStatus = (state) => getAuth(state).checkingStatus;
