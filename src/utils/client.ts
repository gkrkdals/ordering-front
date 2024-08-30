import axios from "axios";

// const baseUrl = 'http://34.47.98.56';
const baseUrl = 'http://localhost:3000';

const client = axios.create({
  baseURL: baseUrl,
  responseType: 'json',
  withCredentials: true,
})

export default client;
