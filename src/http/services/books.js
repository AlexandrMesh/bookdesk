import http from '../http';
import config from '../../config/api';

const DataService = () => ({
  getBookList: (params) => http.get(`${config.API_URL}/books`, { params }),
  getUserBooks: (params) => http.get(`${config.API_URL}/getUserBooks`, { params }),
  updateUserBook: (params) => http.post(`${config.API_URL}/updateUserBook`, params),
  updateBookVotes: (params) => http.post(`${config.API_URL}/updateBookVotes`, params),
  getCategories: (params) => http.get(`${config.API_URL}/categories`, { params }),
  getBookDetails: (params) => http.get(`${config.API_URL}/book`, { params }),
  updateUserBookAddedValue: (params) => http.post(`${config.API_URL}/updateUserBookAddedValue`, params),
});

export default DataService;
