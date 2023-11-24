import http from '../http';
import config from '../../config/api';

const CustomBooksService = () => ({
  getSuggestCoversList: (params) => http.get(`${config.API_URL}/coversList`, { params }),
  addCustomBook: (params) => http.post(`${config.API_URL}/addCustomBook`, params),
});

export default CustomBooksService;
