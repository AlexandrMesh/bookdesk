import http from '../http';
import { getApiUrl } from '../../config/api';

const AppService = () => ({
  getAppInfo: async (params) => http.get(`${await getApiUrl()}/appInfo`, params),
});

export default AppService;
