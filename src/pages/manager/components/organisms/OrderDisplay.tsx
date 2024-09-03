import OrderTable from "@src/pages/manager/components/molecules/OrderTable.tsx";
import {OrderStatusRaw} from "@src/models/manager/OrderStatusRaw.ts";
import MakeOrderModal from "@src/pages/manager/modals/MakeOrderModal.tsx";
import {useEffect, useRef, useState} from "react";
import {getSocket, getUser} from "@src/utils/socket.ts";
import useTable from "@src/hooks/UseTable.tsx";
import {playAudio} from "@src/utils/music.ts";
import BottomBar from "@src/pages/manager/components/molecules/BottomBar.tsx";
import client from "@src/utils/client.ts";
import {MuteButton} from "@src/pages/client/components/atoms/MuteButton.tsx";

const socket = getSocket();
let intervalId = 0;

export default function OrderDisplay() {
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const audioRef = useRef(new Audio(getUser() === 'cook' ? '/beep.mp3' : '/alarm.mp3'));

  const [
    orderStatus,
    current,
    total,
    prev,
    next,
    reload,
    searchData,
    setSearchData,
  ] = useTable<OrderStatusRaw>('/api/manager/order', { user: getUser() });

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
    client
      .get('/api/manager/order/pending', { params: { user: getUser() } })
      .then((res) => res.data && startRinging());

    socket.on('refresh', reload);
    socket.on(`new_event_${getUser()}`, () => startRinging());
    socket.on(`remove_event_${getUser()}`, () => clearRinging());

    window.addEventListener('beforeunload', cleanup);

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    }
  }, []);

  useEffect(() => {
    audioRef.current.muted = muted
  }, [muted]);

  return (
    <>
      <MuteButton muted={muted} setMuted={setMuted} />
      <OrderTable
        orderstatus={orderStatus}
        page={current}
        reload={reload}
      />
      <BottomBar
        mode={'order'}
        setOpen={setOpen}
        searchData={searchData}
        setSearchData={setSearchData}
        current={current}
        total={total}
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
