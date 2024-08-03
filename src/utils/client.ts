import axios from "axios";

const baseUrl = 'http://localhost:3000';

const client = axios.create({
  baseURL: baseUrl,
  responseType: 'json'
})

export default client;