import http from '../http';
import config from '../../config/api';

const GoalsService = () => ({
  getGoalItems: (params) => http.get(`${config.API_URL}/userGoalItems`, { params }),
  addGoalItem: (params) => http.post(`${config.API_URL}/addUserGoalItem`, params),
  addGoal: (params) => http.post(`${config.API_URL}/addUserGoal`, params),
  updateGoal: (params) => http.post(`${config.API_URL}/updateUserGoal`, params),
  deleteUserGoalItem: (params) => http.post(`${config.API_URL}/deleteUserGoalItem`, params),
});

export default GoalsService;
