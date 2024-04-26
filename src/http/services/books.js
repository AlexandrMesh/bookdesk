import http from '../http';
import config from '../../config/api';

const DataService = () => ({
  getBookList: (params) => http.get(`${config.API_URL}/books`, { params }),
  getBookComment: (params) => http.get(`${config.API_URL}/userBookComment`, { params }),
  getUserBookRating: (params) => http.get(`${config.API_URL}/userBookRating`, { params }),
  updateUserBook: (params) => http.post(`${config.API_URL}/updateUserBook`, params),
  updateUserComment: (params) => http.post(`${config.API_URL}/updateUserComment`, params),
  updateUserBookRating: (params) => http.post(`${config.API_URL}/updateUserBookRating`, params),
  updateBookVotes: (params) => http.post(`${config.API_URL}/updateBookVotes`, params),
  getCategories: (params) => http.get(`${config.API_URL}/categories`, { params }),
  getBookDetails: (params) => http.get(`${config.API_URL}/book`, { params }),
  getBooksCountByYear: (params) => http.get(`${config.API_URL}/booksCountByYearV2`, { params }),
  updateUserBookAddedValue: (params) => http.post(`${config.API_URL}/updateUserBookAddedValue`, params),
  deleteUserBookRating: (params) => http.post(`${config.API_URL}/deleteUserBookRating`, params),
  deleteUserComment: (params) => http.post(`${config.API_URL}/deleteUserComment`, params),
});

export default DataService;
