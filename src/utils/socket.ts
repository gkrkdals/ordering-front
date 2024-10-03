import {io} from "socket.io-client"

const url = 'http://34.47.98.56:8080';
// const url = 'http://localhost:8080';

export const socket = io(url, {
  autoConnect: false,
});

export function getUser() {
  return window.location.href.split('/').at(-1)?.trim();
}