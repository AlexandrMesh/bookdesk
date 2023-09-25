const getAppInfo = (state) => state.app;
const getAppInfoData = (state) => getAppInfo(state).data;

export const getLoadingDataStatus = (state) => getAppInfo(state).loadingDataStatus;
export const getAppName = (state) => getAppInfoData(state).name;
export const getAppVersion = (state) => getAppInfoData(state).version;
export const getAppDescription = (state) => getAppInfoData(state).description;
export const getAppEmail = (state) => getAppInfoData(state).email;
