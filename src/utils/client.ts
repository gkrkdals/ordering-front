import axios from "axios";
import React from "react";

// const baseUrl = 'http://34.47.98.56';
const baseUrl = 'http://localhost:3000';

const client = axios.create({
  baseURL: baseUrl,
  responseType: 'json',
  withCredentials: true,
})

export async function getCallback<T>(
  url: string,
  set: React.Dispatch<React.SetStateAction<T>>,
  callback?: (data: any, set: React.Dispatch<React.SetStateAction<T>>) => void
): Promise<void> {
  const res = await client.get(url);
  if(callback) {
    callback(res.data, set);
  } else {
    set(res.data);
  }
}

export default client;
