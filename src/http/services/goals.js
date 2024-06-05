import http from '../http';
import { getApiUrl } from '../../config/api';

const GoalsService = () => ({
  getGoalItems: async (params) => http.get(`${await getApiUrl()}/userGoalItems`, { params }),
  addGoalItem: async (params) => http.post(`${await getApiUrl()}/addUserGoalItem`, params),
  addGoal: async (params) => http.post(`${await getApiUrl()}/addUserGoal`, params),
  updateGoal: async (params) => http.post(`${await getApiUrl()}/updateUserGoal`, params),
  deleteUserGoalItem: async (params) => http.post(`${await getApiUrl()}/deleteUserGoalItem`, params),
});

export default GoalsService;
