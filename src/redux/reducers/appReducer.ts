import { createReducer } from '@reduxjs/toolkit';
import * as appActions from '~redux/actions/appActions';
import { IDLE, PENDING, FAILED, SUCCEEDED } from '~constants/loadingStatuses';
import { LoadingType } from '~types/loadingTypes';
import { IData, ISupportApp } from '~types/app';

const getDefaultDataState = (): IData => ({
  name: '',
  version: '',
  description: '',
  email: '',
});

const getDefaultSupportAppState = (): ISupportApp => ({
  confirmed: false,
  viewedAt: null,
});

export interface IAppState {
  data: IData;
  supportApp: ISupportApp;
  loadingDataStatus: LoadingType;
}

export const getDefaultState = (): IAppState => ({
  data: getDefaultDataState(),
  supportApp: getDefaultSupportAppState(),
  loadingDataStatus: IDLE,
});

const defaultState = getDefaultState();

export default createReducer(defaultState, (builder) => {
  builder
    .addCase(appActions.startLoadingAppInfo, (state) => {
      state.loadingDataStatus = PENDING;
    })
    .addCase(appActions.appInfoLoaded, (state, { payload: { name, version, description, email } }) => {
      state.data = {
        name,
        version,
        description,
        email,
      };
      state.loadingDataStatus = SUCCEEDED;
    })
    .addCase(appActions.loadingAppInfoFailed, (state) => {
      state.loadingDataStatus = FAILED;
    })
    .addCase(appActions.appSupported, (state, { payload: { confirmed, viewedAt } }) => {
      state.supportApp = { confirmed, viewedAt };
    })
    .addCase(appActions.clearAppInfo, () => defaultState);
});
