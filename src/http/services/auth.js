import http from '../http';
import { getApiUrl } from '../../config/api';

const AuthService = () => ({
  signIn: async (params) => http.post(`${await getApiUrl()}/signIn`, params),
  signUp: async (params) => http.post(`${await getApiUrl()}/signUp`, params),
  checkAuth: async (token) => http.get(`${await getApiUrl()}/checkAuth?token=${token}`),
});

export default AuthService;
