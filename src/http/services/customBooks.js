import http from '../http';
import config from '../../config/api';

const CustomBooksService = () => ({
  getSuggestCoversList: (params) => http.get(`${config.API_URL}/coversList`, { params }),
});

export default CustomBooksService;
