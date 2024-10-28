import axios from "axios";

export const baseUrl = 'https://yeonsu.kr';
// export const baseUrl = 'http://localhost:3000';

const client = axios.create({
  baseURL: baseUrl,
  responseType: 'json',
  withCredentials: true,
});

export default client;
