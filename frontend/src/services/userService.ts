import api from './api';


export const userService = {
  getUsers: () => api.get('/users'),
  createUser: () => api.post('/users'),
};