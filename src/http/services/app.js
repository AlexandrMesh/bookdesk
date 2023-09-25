import http from '../http';
import config from '../../config/api';

const AppService = () => ({
  getAppInfo: (params) => http.get(`${config.API_URL}/appInfo`, params),
});

export default AppService;
