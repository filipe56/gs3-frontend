import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080'
});

api.interceptors.request.use(async config => {
  const authorization = window.localStorage.getItem('@gs3:token');
  if (authorization) {
    config.headers.Authorization = `${authorization}`;

  } 
  return config;
});

export default api;