import axios from "axios";

// const baseUrl = 'http://yeonsu.kr';
const baseUrl = 'http://localhost:3000';

const client = axios.create({
  baseURL: baseUrl,
  responseType: 'json',
  withCredentials: true,
})

export default client;
