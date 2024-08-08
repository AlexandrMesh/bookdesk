import { RootState } from '~redux/store/configureStore';

type StateWithApp = Pick<RootState, 'app'>;

const getAppInfo = (state: StateWithApp) => state.app;
const getAppInfoData = (state: StateWithApp) => getAppInfo(state).data;

export const getLoadingDataStatus = (state: StateWithApp) => getAppInfo(state).loadingDataStatus;
export const getAppName = (state: StateWithApp) => getAppInfoData(state).name;
export const getAppDescription = (state: StateWithApp) => getAppInfoData(state).description;
export const getAppEmail = (state: StateWithApp) => getAppInfoData(state).email;
