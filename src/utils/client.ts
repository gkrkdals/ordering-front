import axios from "axios";

export const baseUrl = 'http://yeonsu.kr';
// export const baseUrl = 'http://localhost:3000';

const client = axios.create({
  baseURL: baseUrl,
  responseType: 'json',
  withCredentials: true,
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('hello there');
    if (error.response && error.response.status === 401) {
      console.log('oops');
    }
    return error;
  }
);

export default client;
