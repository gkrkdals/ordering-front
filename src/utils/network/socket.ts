import {io, Socket} from "socket.io-client"

const url = import.meta.env.VITE_SOCKET_URL;

export const customerSocket = io(url, {
  autoConnect: false,
  query: {
    role: "customer"
  }
})

export const managerSocket = io(url, {
  autoConnect: false,
  query: {
    role: "manager"
  }
});

export const printerSocket = io(url, {
  autoConnect: false,
  query: {
    role: "printer",
  }
});

type UserType = 'manager' | 'rider' | 'cook';

export function getUser(): UserType {
  return window.location.href.split('/').at(-1)?.trim() as UserType;
}

export const onDisconnected = (socket: Socket) => {
  const maxReconnectAttempts = 5; // 최대 재연결 시도 횟수
  let attempts = 0;

  const tryReconnect = () => {
    if (attempts < maxReconnectAttempts) {
      attempts++;
      console.log(`Reconnection attempt ${attempts}`);

      // 다시 소켓 연결 시도
      socket.connect();

      // 연결 성공 시
      socket.on('connect', () => {
        console.log('Socket reconnected');
        attempts = 0; // 성공하면 시도 횟수 초기화
      });
    } else {
      console.log('Maximum reconnection attempts reached. Failed to reconnect.');
    }
  };

  // 주기적으로 재연결 시도 (여기서는 3초 간격으로 시도)
  const reconnectInterval = setInterval(() => {
    if (socket.connected) {
      clearInterval(reconnectInterval); // 연결 성공하면 재연결 중단
    } else {
      tryReconnect(); // 연결 실패 시 재시도
    }
  }, 3000); // 3초마다 재연결 시도
};