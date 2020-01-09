import axios from 'axios';

const instanceLogin = axios.create({
  baseURL: 'http://localhost:3000',
});

export default instanceLogin;