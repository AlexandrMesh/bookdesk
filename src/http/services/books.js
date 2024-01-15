import http from '../http';
import config from '../../config/api';

const DataService = () => ({
  getBookList: (params) => http.get(`${config.API_URL}/books`, { params }),
  getBookComment: (params) => http.get(`${config.API_URL}/userBookComment`, { params }),
  updateUserBook: (params) => http.post(`${config.API_URL}/updateUserBook`, params),
  updateUserComment: (params) => http.post(`${config.API_URL}/updateUserComment`, params),
  updateBookVotes: (params) => http.post(`${config.API_URL}/updateBookVotes`, params),
  getCategories: (params) => http.get(`${config.API_URL}/categories`, { params }),
  getBookDetails: (params) => http.get(`${config.API_URL}/book`, { params }),
  getBooksCountByYear: (params) => http.get(`${config.API_URL}/booksCountByYear`, { params }),
  updateUserBookAddedValue: (params) => http.post(`${config.API_URL}/updateUserBookAddedValue`, params),
});

export default DataService;
