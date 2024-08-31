import {connect} from "socket.io-client";

export function getSocket() {
  return connect('http://localhost:8080');
}