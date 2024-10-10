import OrderTable from "@src/pages/manager/components/molecules/OrderTable.tsx";
import {OrderStatusRaw} from "@src/models/manager/OrderStatusRaw.ts";
import MakeOrderModal from "@src/pages/manager/modals/order/MakeOrderModal.tsx";
import React, {useEffect, useRef, useState} from "react";
import {socket} from "@src/utils/socket.ts";
import useTable from "@src/hooks/UseTable.tsx";
import {playAudio} from "@src/utils/music.ts";
import BottomBar from "@src/pages/manager/components/molecules/BottomBar.tsx";
import client from "@src/utils/client.ts";
import {MuteButton} from "@src/pages/client/components/atoms/MuteButton.tsx";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import UserState from "@src/recoil/atoms/UserState.ts";
import {PermissionEnum} from "@src/models/manager/PermissionEnum.ts";
import {Column} from "@src/models/manager/Column.ts";
import {useTableSort} from "@src/hooks/UseTableSort.tsx";

let intervalId: undefined | ReturnType<typeof setTimeout>;

const columns: Column[] = [
  {key: '', name: '순번'},
  {key: 'customer_name', name: '고객명'},
  {key: 'menu_name', name: '메뉴'},
  {key: 'request', name: '요청사항'},
  {key: 'status', name: '상태'},
  {key: 'credit', name: '잔금'}
];

export default function OrderDisplay() {
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const navigate = useNavigate();
  const user = useRecoilValue(UserState);

  // 소리 재생을 위한 오디오 레퍼런스
  const newOrderSoundRef = useRef(new Audio('/alarms/new_order.mp3'));
  const cookingExceededRef = useRef(new Audio('/alarms/cooking_exceeded.mp3'));
  const newDeliveryRef = useRef(new Audio('/alarms/new_delivery.mp3'));
  const deliverDelayedRef = useRef(new Audio('/alarms/deliver_delayed.mp3'));
  const newDishDisposal = useRef(new Audio('/alarms/new_dish_disposal.mp3'));

  // 데이터 정렬
  const [sort, setSort, params] = useTableSort(columns);

  // 그릇수거 확인
  const [isRemaining, setIsRemaining] = useState(false);

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
    url,
    setUrl,
    debouncedSearchText
  } = useTable<OrderStatusRaw>('/api/manager/order', params);

  // reload 뮤터블
  const reloadRef = useRef(reload);

  async function handleLogout() {
    await client.get('/api/auth/manager/logout');
    navigate('/login');
  }

  function clearAlarm() { clearInterval(intervalId) }
  function startAlarm(audioRef: React.MutableRefObject<HTMLAudioElement>) {
    console.log(`playing: ${audioRef.current.src}`)
    clearAlarm();
    intervalId = setInterval(() => playAudio(audioRef), 3000);
  }
  function cleanup() {
    clearAlarm();
    socket.removeAllListeners();
    socket.disconnect();
  }

  useEffect(() => {
    socket.connect();

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    socket.on('refresh', reloadRef.current);

    if (user?.permission === PermissionEnum.Cook) {
      socket.on('new_order_alarm', () => startAlarm(newOrderSoundRef));
      socket.on('cook_exceeded', () => playAudio(cookingExceededRef));
      socket.on('clear_cook_alarm', clearAlarm);
    } else if (user?.permission === PermissionEnum.Rider) {
      socket.on('new_order_alarm', () => startAlarm(newOrderSoundRef));
      socket.on('new_delivery_alarm', () => playAudio(newDeliveryRef));
      socket.on('deliver_delayed', () => playAudio(deliverDelayedRef));
      socket.on('new_dish_disposal', () => playAudio(newDishDisposal));
      socket.on('clear_rider_alarm', clearAlarm)
    }

    window.addEventListener('beforeunload', cleanup);

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    }
  }, [user]);

  useEffect(() => {
    client
      .get('/api/manager/order/pending')
      .then((res) => {
        const { pendingReceipt, waitingForDelivery, inPickingUp } = res.data;

        if (pendingReceipt && user?.permission !== PermissionEnum.Manager) {
          startAlarm(newOrderSoundRef);
        }

        if (user?.permission === PermissionEnum.Rider) {
          if (waitingForDelivery) {
            playAudio(newDeliveryRef);
          }

          if (inPickingUp) {
            playAudio(newDishDisposal);
          }
        }
      });
  }, [user]);

  useEffect(() => {
    newOrderSoundRef.current.muted = muted;
    cookingExceededRef.current.muted = muted;
    newDeliveryRef.current.muted = muted;
    deliverDelayedRef.current.muted = muted;
    newDishDisposal.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    if (isRemaining) {
      setUrl('/api/manager/order/remaining')
    } else {
      setUrl('/api/manager/order')
    }
  }, [isRemaining]);

  // url, 페이지, params 변경 후 socket에 저장되어 있던 refresh 리스너를 새로 장착
  useEffect(() => {
    socket.removeListener('refresh');
    socket.on('refresh', reload);
  }, [url, currentPage, params, debouncedSearchText])

  return (
    <>
      <div className='d-flex justify-content-between'>
        <MuteButton muted={muted} setMuted={setMuted}/>
        {user?.permission !== 1 && <button className='btn btn-danger mb-2' onClick={handleLogout}>로그아웃</button>}
      </div>
      <OrderTable
        columns={columns}
        count={count}
        orderstatus={data}
        page={currentPage}
        reload={reload}
        sort={sort}
        setSort={setSort}
        isRemaining={isRemaining}
        setIsRemaining={setIsRemaining}
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
      />
    </>
  );
}
