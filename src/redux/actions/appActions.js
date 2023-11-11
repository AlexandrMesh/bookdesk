import AppService from '~http/services/app';
import i18n from '~translations/i18n';
import { RU } from '~constants/languages';

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

export const appInfoLoaded = ({ name, version, description, email }) => ({
  type: APP_INFO_LOADED,
  name,
  version,
  description,
  email,
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
    const underConstruction = i18n.language === RU ? data.underConstruction : data.underConstructionEn;
    if (underConstruction) {
      dispatch(underConstructionLoaded(underConstruction));
      return data.underConstruction;
    }
    dispatch(loadingUnderConstructionFailed);
    return false;
  } catch (error) {
    dispatch(loadingUnderConstructionFailed);
  }
  return false;
};

export const loadAppInfo = () => async (dispatch) => {
  try {
    dispatch(startLoadingAppInfo);
    const { data } = (await AppService().getAppInfo()) || {};
    dispatch(
      appInfoLoaded({
        name: data.name,
        version: data.version,
        description: i18n.language === RU ? data.description : data.descriptionEn,
        email: data.email,
      }),
    );
  } catch (e) {
    dispatch(loadingAppInfoFailed);
  }
};
