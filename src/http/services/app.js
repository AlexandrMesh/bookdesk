import http from '../http';
import { getApiUrl } from '../../config/api';

const AppService = async () => ({
  getAppInfo: async (params) => http.get(`${await getApiUrl()}/appInfo`, params),
  getUnderConstruction: async (params) => http.get(`${await getApiUrl()()}/underConstruction`, params),
});

export default AppService;
