import http from '../http';
import config from '../../config/api';

const AuthService = () => ({
  signIn: (params) => http.post(`${config.API_URL}/signIn`, params),
  signUp: (params) => http.post(`${config.API_URL}/signUp`, params),
  checkAuth: (token) => http.get(`${config.API_URL}/checkAuth?token=${token}`),
});

export default AuthService;
