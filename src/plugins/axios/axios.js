import axios from 'axios';

const axioAuth = axios.create({
  baseURL: 'http://localhost:3000',
});

axioAuth.interceptors.request.use((config) => {
  const conf = config;
  const token = sessionStorage.getItem('token');
  if (token) {
    conf.headers.Authorization = `Bearer ${token}`;
  }
  return conf;
}, err => Promise.reject(err));

axioAuth.interceptors.response.use(response => response, (error) => {
  if (error.response.data.errors[0].message === 'Acesso negado.') {
    window.location = '/login';
  }
  return Promise.reject(error);
});

export default axioAuth;
