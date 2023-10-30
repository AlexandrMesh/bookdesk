import AppService from '~http/services/app';

const PREFIX = 'APP';

export const START_LOADING_APP_INFO = `${PREFIX}/START_LOADING_APP_INFO`;
export const APP_INFO_LOADED = `${PREFIX}/APP_INFO_LOADED`;
export const LOADING_APP_INFO_FAILED = `${PREFIX}/LOADING_APP_INFO_FAILED`;
export const CLEAR_APP_INFO = `${PREFIX}/CLEAR_APP_INFO`;

export const START_LOADING_UNDER_CONSTRUCTION = `${PREFIX}/START_LOADING_UNDER_CONSTRUCTION`;
export const LOADING_UNDER_CONSTRUCTION_FAILED = `${PREFIX}/LOADING_UNDER_CONSTRUCTION_FAILED`;
export const UNDER_CONSTRUCTION_LOADED = `${PREFIX}/UNDER_CONSTRUCTION_LOADED`;

export const startLoadingAppInfo = {
  type: START_LOADING_APP_INFO,
};

export const loadingAppInfoFailed = {
  type: LOADING_APP_INFO_FAILED,
};

export const appInfoLoaded = (data) => ({
  type: APP_INFO_LOADED,
  data,
});

export const startLoadingUnderConstruction = {
  type: START_LOADING_UNDER_CONSTRUCTION,
};

export const loadingUnderConstructionFailed = {
  type: LOADING_UNDER_CONSTRUCTION_FAILED,
};

export const underConstructionLoaded = (data) => ({
  type: UNDER_CONSTRUCTION_LOADED,
  data,
});

export const clearAppInfo = {
  type: CLEAR_APP_INFO,
};

export const checkUnderConstruction = () => async (dispatch) => {
  dispatch(startLoadingUnderConstruction);
  try {
    const { data } = await AppService().getUnderConstruction();
    dispatch(underConstructionLoaded(data.underConstruction));
    return data.underConstruction;
  } catch (error) {
    dispatch(loadingUnderConstructionFailed);
  }
  return false;
};

export const loadAppInfo = () => async (dispatch) => {
  try {
    dispatch(startLoadingAppInfo);
    const { data } = (await AppService().getAppInfo()) || {};
    dispatch(appInfoLoaded(data));
  } catch (e) {
    dispatch(loadingAppInfoFailed);
  }
};
