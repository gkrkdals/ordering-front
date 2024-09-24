import OrderTable from "@src/pages/manager/components/molecules/OrderTable.tsx";
import {OrderStatusRaw} from "@src/models/manager/OrderStatusRaw.ts";
import MakeOrderModal from "@src/pages/manager/modals/order/MakeOrderModal.tsx";
import {useEffect, useRef, useState} from "react";
import {getUser, socket} from "@src/utils/socket.ts";
import useTable from "@src/hooks/UseTable.tsx";
import {playAudio} from "@src/utils/music.ts";
import BottomBar from "@src/pages/manager/components/molecules/BottomBar.tsx";
import client from "@src/utils/client.ts";
import {MuteButton} from "@src/pages/client/components/atoms/MuteButton.tsx";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import UserState from "@src/recoil/atoms/UserState.ts";

let intervalId = 0;

export default function OrderDisplay() {
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const audioRef = useRef(new Audio(getUser() === 'cook' ? '/beep.mp3' : '/alarm.mp3'));
  const navigate = useNavigate();
  const user = useRecoilValue(UserState);

  const {
    data,
    currentPage,
    totalPage,
    count,
    prev,
    next,
    reload,
    searchData,
    setSearchData,
  } = useTable<OrderStatusRaw>('/api/manager/order', { user: getUser() });

  async function handleLogout() {
    await client.get('/api/auth/manager/logout');
    navigate('/login');
  }

  function clearRinging() { clearInterval(intervalId) }
  function startRinging() {
    clearRinging();
    intervalId = setInterval(() => playAudio(audioRef), 3000);
  }
  function cleanup() {
    clearRinging();
    socket.removeAllListeners();
    socket.disconnect();
  }

  useEffect(() => {
    socket.connect();

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    socket.on('refresh', reload);
    socket.on(`new_event_${getUser()}`, startRinging);
    socket.on(`remove_event_${getUser()}`, clearRinging);

    window.addEventListener('beforeunload', cleanup);

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    }
  }, []);

  useEffect(() => {
    client
      .get('/api/manager/order/pending', { params: { user: getUser() } })
      .then((res) => res.data && startRinging());
  }, []);

  useEffect(() => {
    audioRef.current.muted = muted
  }, [muted]);

  return (
    <>
      <div className='d-flex justify-content-between'>
        <MuteButton muted={muted} setMuted={setMuted}/>
        {user?.permission !== 1 && <button className='btn btn-danger mb-2' onClick={handleLogout}>로그아웃</button>}
      </div>
      <OrderTable
        count={count}
        orderstatus={data}
        page={currentPage}
        reload={reload}
      />
      <BottomBar
        mode={'order'}
        setOpen={setOpen}
        searchData={searchData}
        setSearchData={setSearchData}
        current={currentPage}
        total={totalPage}
        prev={prev}
        next={next}
      />

      <MakeOrderModal
        open={open}
        onClose={() => setOpen(false)}
        setOpen={setOpen}
        reload={reload}
      />
    </>
  );
}
