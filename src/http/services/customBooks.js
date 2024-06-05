import http from '../http';
import { getApiUrl } from '../../config/api';

const CustomBooksService = () => ({
  getSuggestCoversList: async (params) => http.get(`${await getApiUrl()}/coversList`, { params }),
  addCustomBook: async (params) => http.post(`${await getApiUrl()}/addCustomBook`, params),
});

export default CustomBooksService;
