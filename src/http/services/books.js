import http from '../http';
import { getApiUrl } from '../../config/api';

const DataService = () => ({
  getBookList: async (params) => http.get(`${await getApiUrl()}/books`, { params }),
  getBookComment: async (params) => http.get(`${await getApiUrl()}/userBookComment`, { params }),
  getUserBookRating: async (params) => http.get(`${await getApiUrl()}/userBookRating`, { params }),
  updateUserBook: async (params) => http.post(`${await getApiUrl()}/updateUserBook`, params),
  updateUserComment: async (params) => http.post(`${await getApiUrl()}/updateUserComment`, params),
  updateUserBookRating: async (params) => http.post(`${await getApiUrl()}/updateUserBookRating`, params),
  updateBookVotes: async (params) => http.post(`${await getApiUrl()}/updateBookVotes`, params),
  getCategories: async (params) => http.get(`${await getApiUrl()}/categories`, { params }),
  getBookDetails: async (params) => http.get(`${await getApiUrl()}/book`, { params }),
  getBooksCountByYear: async (params) => http.get(`${await getApiUrl()}/booksCountByYearV2`, { params }),
  updateUserBookAddedValue: async (params) => http.post(`${await getApiUrl()}/updateUserBookAddedValue`, params),
  deleteUserBookRating: async (params) => http.post(`${await getApiUrl()}/deleteUserBookRating`, params),
  deleteUserComment: async (params) => http.post(`${await getApiUrl()}/deleteUserComment`, params),
});

export default DataService;
