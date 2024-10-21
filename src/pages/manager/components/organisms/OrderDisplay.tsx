import OrderTable from "@src/pages/manager/components/molecules/OrderTable.tsx";
import {OrderStatusRaw} from "@src/models/manager/OrderStatusRaw.ts";
import MakeOrderModal from "@src/pages/manager/modals/order/MakeOrderModal.tsx";
import {useEffect, useRef, useState} from "react";
import {getUser, socket} from "@src/utils/socket.ts";
import useTable from "@src/hooks/UseTable.tsx";
import {AudioRefObject, getAudio, getMedia, playAudio} from "@src/utils/music.ts";
import BottomBar from "@src/pages/manager/components/molecules/BottomBar.tsx";
import client from "@src/utils/client.ts";
import {MuteButton} from "@src/pages/client/components/atoms/MuteButton.tsx";
import {useRecoilValue} from "recoil";
import UserState from "@src/recoil/atoms/UserState.ts";
import {PermissionEnum} from "@src/models/manager/PermissionEnum.ts";
import {Column} from "@src/models/manager/Column.ts";
import {useTableSort} from "@src/hooks/UseTableSort.tsx";
import {Capacitor} from "@capacitor/core";
import Pagination from "@src/pages/manager/components/atoms/Pagination.tsx";
import {startForegroundService, stopForegroundService} from "@src/utils/native.ts";

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
  const user = useRecoilValue(UserState);

  // 소리 재생을 위한 오디오 레퍼런스
  const newOrderSoundRef = useRef<HTMLAudioElement | null>(null);
  const cookingStartedRef = useRef<HTMLAudioElement | null>(null);
  const cookingExceededRef = useRef<HTMLAudioElement | null>(null);
  const newDeliveryRef = useRef<HTMLAudioElement | null>(null);
  const deliverDelayedRef = useRef<HTMLAudioElement | null>(null);
  const newDishDisposalRef = useRef<HTMLAudioElement | null>(null);

  // 앱 오디오 레퍼런스
  const newOrderSoundAppRef = useRef<Media | null>(null);
  const cookingStartedAppRef = useRef<Media | null>(null);
  const cookingExceededAppRef = useRef<Media | null>(null);
  const newDeliveryAppRef = useRef<Media | null>(null);
  const deliverDelayedAppRef = useRef<Media | null>(null);
  const newDishDisposalAppRef = useRef<Media | null>(null);

  // 인터벌 ID 레퍼런스
  const intervalId = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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

  function clearAlarm() { clearInterval(intervalId.current) }
  function startAlarm(audioRef: AudioRefObject) {
    clearAlarm();
    playAudio(audioRef);
    intervalId.current = setInterval(() => playAudio(audioRef), 3000);
  }

  function cleanup() {
    clearAlarm();
    socket.removeAllListeners();
    socket.disconnect();
  }

  useEffect(() => {
    const attachSoundEffects = async (mode: 'web' | 'app') => {
      if (mode === 'web') {
        socket.on('new_order_alarm', () => startAlarm(newOrderSoundRef));
        socket.on('cooking_started', () => playAudio(cookingStartedRef));
        if (getUser() === 'cook') {
          socket.on('cook_exceeded', () => playAudio(cookingExceededRef));
          socket.on('clear_cook_alarm', clearAlarm);
        } else {
          socket.on('new_delivery_alarm', () => playAudio(newDeliveryRef));
          socket.on('deliver_delayed', () => playAudio(deliverDelayedRef));
          socket.on('new_dish_disposal', () => playAudio(newDishDisposalRef));
          socket.on('clear_rider_alarm', clearAlarm)
        }
      } else {
        socket.on('new_order_alarm', () => startAlarm(newOrderSoundAppRef));
        socket.on('cooking_started', () => playAudio(cookingStartedAppRef));
        if (getUser() === 'cook') {
          socket.on('cook_exceeded', () => playAudio(cookingExceededAppRef));
          socket.on('clear_cook_alarm', clearAlarm);
        } else {
          socket.on('new_delivery_alarm', () => playAudio(newDeliveryAppRef));
          socket.on('deliver_delayed', () => playAudio(deliverDelayedAppRef));
          socket.on('new_dish_disposal', () => playAudio(newDishDisposalAppRef));
          socket.on('clear_rider_alarm', clearAlarm)
        }
      }
    };

    const foregroundServiceSetup = async () => {
      await startForegroundService();
      await attachSoundEffects("app");
    };

    socket.connect();

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    socket.on('refresh', reloadRef.current);

    if (Capacitor.isNativePlatform()) {
      newOrderSoundAppRef.current = getMedia('file:///android_asset/alarms/new_order.mp3');
      cookingStartedAppRef.current = getMedia('file:///android_asset/alarms/cooking_started.mp3');
      cookingExceededAppRef.current = getMedia('file:///android_asset/alarms/cooking_exceeded.mp3');
      newDeliveryAppRef.current = getMedia('file:///android_asset/alarms/new_delivery.mp3');
      deliverDelayedAppRef.current = getMedia('file:///android_asset/alarms/deliver_delayed.mp3');
      newDishDisposalAppRef.current = getMedia('file:///android_asset/alarms/new_dish_disposal.mp3')

      console.log('running on a native platform.');
      document.addEventListener('deviceready', foregroundServiceSetup);
    } else {
      newOrderSoundRef.current = getAudio('/alarms/new_order.mp3');
      cookingStartedRef.current = getAudio('/alarms/cooking_started.mp3');
      cookingExceededRef.current = getAudio('/alarms/cooking_exceeded.mp3');
      newDeliveryRef.current = getAudio('/alarms/new_delivery.mp3');
      deliverDelayedRef.current = getAudio('/alarms/deliver_delayed.mp3');
      newDishDisposalRef.current = getAudio('/alarms/new_dish_disposal.mp3');

      console.log('running on a web platform.');
      window.addEventListener('beforeunload', cleanup);
      attachSoundEffects('web').then();
    }

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
      stopForegroundService().then();
    }

  }, []);

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
            playAudio(newDishDisposalRef);
          }
        }
      });
  }, [user]);

  useEffect(() => {
    newOrderSoundRef.current && (newOrderSoundRef.current.muted = muted);
    cookingStartedRef.current && (cookingStartedRef.current.muted = muted);
    cookingExceededRef.current && (cookingExceededRef.current.muted = muted);
    newDeliveryRef.current && (newDeliveryRef.current.muted = muted);
    deliverDelayedRef.current && (deliverDelayedRef.current.muted = muted);
    newDishDisposalRef.current && (newDishDisposalRef.current.muted = muted);
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
      {!Capacitor.isNativePlatform() && (
        <div className='d-flex justify-content-between'>
          <MuteButton muted={muted} setMuted={setMuted}/>
        </div>
      )}
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
      <OrderTable
        columns={columns}
        count={count}
        orderstatus={data}
        page={currentPage}
        reload={reload}
        sort={sort}
        setSort={setSort}
        isRemaining={isRemaining}
      />
      <div className='d-flex justify-content-between'>
        {user?.permission !== PermissionEnum.Cook && (
          <div className='form-check mt-1'>
            <input
              id='remaining'
              type="checkbox"
              className='form-check-input'
              checked={isRemaining}
              onChange={() => setIsRemaining(!isRemaining)}
            />
            <label htmlFor="remaining" className='form-check-label'>그릇수거</label>
          </div>
        )}
        <Pagination
          currentpage={currentPage}
          totalpage={totalPage}
          onclickleft={prev}
          onclickright={next}
        />
      </div>

      <MakeOrderModal
        open={open}
        onClose={() => setOpen(false)}
        setOpen={setOpen}
      />
    </>
  );
}
