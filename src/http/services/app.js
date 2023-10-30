import http from '../http';
import config from '../../config/api';

const AppService = () => ({
  getAppInfo: (params) => http.get(`${config.API_URL}/appInfo`, params),
  getUnderConstruction: (params) => http.get(`${config.API_URL}/underConstruction`, params),
});

export default AppService;
