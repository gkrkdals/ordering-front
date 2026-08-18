import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@src/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/icons/gear.svg';
import "bootstrap-icons/font/bootstrap-icons.css"

console.log(
  `[env] mode=${import.meta.env.VITE_MODE} apiUrl=${import.meta.env.VITE_API_URL} socketUrl=${import.meta.env.VITE_SOCKET_URL}`
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />,
);
