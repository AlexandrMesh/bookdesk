const getAppInfo = (state) => state.app;
const getAppInfoData = (state) => getAppInfo(state).data;

export const getLoadingDataStatus = (state) => getAppInfo(state).loadingDataStatus;
export const getAppName = (state) => getAppInfoData(state).name;
export const getAppDescription = (state) => getAppInfoData(state).description;
export const getAppEmail = (state) => getAppInfoData(state).email;
export const getUnderConstruction = (state) => getAppInfo(state).underConstruction;
export const getLoadingUnderConstructionStatus = (state) => getAppInfo(state).loadingUnderConstructionStatus;
