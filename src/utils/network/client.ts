import axios from "axios";

export const baseUrl = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: baseUrl,
  responseType: 'json',
  withCredentials: true,
});

export const printerClient = axios.create({
  baseURL: import.meta.env.VITE_PRINTER_URL,
  responseType: 'json',
  withCredentials: true,
})

export default client;
