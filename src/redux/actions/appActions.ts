import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import i18n from '~translations/i18n';
import AppService from '~http/services/app';
import { IData, ISupportApp } from '~types/app';
import { RU } from '~constants/languages';
import { AppThunkAPI } from '~redux/store/configureStore';

const PREFIX = 'APP';

export const startLoadingAppInfo = createAction(`${PREFIX}/startLoadingAppInfo`);
export const loadingAppInfoFailed = createAction(`${PREFIX}/loadingAppInfoFailed`);
export const appInfoLoaded = createAction<IData>(`${PREFIX}/appInfoLoaded`);
export const appSupported = createAction<ISupportApp>(`${PREFIX}/appSupported`);
export const clearAppInfo = createAction(`${PREFIX}/clearAppInfo`);

export const loadAppInfo = createAsyncThunk(`${PREFIX}/loadAppInfo`, async (_, { dispatch }: AppThunkAPI) => {
  try {
    dispatch(startLoadingAppInfo());
    const { data } = (await AppService().getAppInfo()) || {};
    dispatch(
      appInfoLoaded({
        name: data.name,
        version: data.version,
        description: i18n.language === RU ? data.description : data.descriptionEn,
        email: data.email,
      }),
    );
  } catch (error) {
    console.log(error);
    dispatch(loadingAppInfoFailed());
  }
});

export const supportApp = createAsyncThunk(`${PREFIX}/supportApp`, async (confirmed: boolean, { dispatch }: AppThunkAPI) => {
  try {
    const { data } = (await AppService().supportApp({ confirmed })) || {};
    dispatch(
      appSupported({
        confirmed,
        viewedAt: data.viewedAt,
      }),
    );
  } catch (e) {
    console.error(e);
  }
});
