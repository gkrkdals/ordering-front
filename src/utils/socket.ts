import {connect} from "socket.io-client";

export function getSocket() {
  // return connect('http://34.47.98.56:8080');
  return connect('http://localhost:8080');
}

export function getUser() {
  return window.location.href.split('/').at(-1)?.trim();
}