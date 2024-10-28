import OrderTable from "@src/pages/manager/components/molecules/OrderTable.tsx";
import {OrderStatusRaw} from "@src/models/manager/OrderStatusRaw.ts";
import MakeOrderModal from "@src/pages/manager/modals/order/MakeOrderModal.tsx";
import {useEffect, useRef, useState} from "react";
import {getUser, onDisconnected, socket} from "@src/utils/network/socket.ts";
import useTable from "@src/hooks/UseTable.tsx";
import {AudioRefObject, getAudio, playAudio} from "@src/utils/music.ts";
import TopBar from "@src/pages/manager/components/molecules/TopBar.tsx";
import client from "@src/utils/network/client.ts";
import {useRecoilValue} from "recoil";
import UserState from "@src/recoil/atoms/UserState.ts";
import {PermissionEnum} from "@src/models/manager/PermissionEnum.ts";
import {Column} from "@src/models/manager/Column.ts";
import {useTableSort} from "@src/hooks/UseTableSort.tsx";
import {PluginListenerHandle} from "@capacitor/core";
// import Pagination from "@src/pages/manager/components/atoms/Pagination.tsx";
import {isNative} from "@src/utils/native/native.ts";
import {App, AppState} from "@capacitor/app";

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
  const newOrderRef = useRef<HTMLAudioElement | null>(null);
  const cookingStartedRef = useRef<HTMLAudioElement | null>(null);
  const cookingExceededRef = useRef<HTMLAudioElement | null>(null);
  const newDeliveryRef = useRef<HTMLAudioElement | null>(null);
  const deliverDelayedRef = useRef<HTMLAudioElement | null>(null);
  const newDishDisposalRef = useRef<HTMLAudioElement | null>(null);

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
    let appStateChangeListener: PluginListenerHandle;

    const attachWebSounds = async () => {
      socket.on('new_order', () => startAlarm(newOrderRef));
      socket.on('cooking_started', () => playAudio(cookingStartedRef));
      socket.on('clear_alarm', clearAlarm);
      if (getUser() === 'cook') {
        socket.on('cooking_exceeded', () => playAudio(cookingExceededRef));
      } else {
        socket.on('new_delivery', () => playAudio(newDeliveryRef));
        socket.on('deliver_delayed', () => playAudio(deliverDelayedRef));
        socket.on('new_dish_disposal', () => playAudio(newDishDisposalRef));
      }
    };

    const attachAppSounds = () => {
      socket.on('new_order', () => startAlarm('new_order.mp3'));
      socket.on('cooking_started', () => playAudio('cooking_started.mp3'));
      socket.on('clear_alarm', clearAlarm)
      if (getUser() === 'cook') {
        socket.on('cooking_exceeded', () => playAudio('cooking_exceeded.mp3'));
      } else {
        socket.on('new_delivery', () => playAudio('new_delivery.mp3'));
        socket.on('deliver_delayed', () => playAudio('deliver_delayed.mp3'));
        socket.on('new_dish_disposal', () => playAudio('new_dish_disposal.mp3'));
      }
      console.log("sound service attached");
    }

    const detachAppSounds = () => {
      socket.removeListener('new_order');
      socket.removeListener('cooking_started');
      socket.removeListener('clear_alarm');
      socket.removeListener('cooking_exceeded');
      socket.removeListener('new_delivery');
      socket.removeListener('deliver_delayed');
      socket.removeListener('new_dish_disposal');
      console.log("sound service detached");
    }

    const handleAppStateChange = async (state: AppState) => {
      if (state.isActive) {
        console.log("app is in foreground mode");
        attachAppSounds();
        await reload();
      } else {
        console.log("app is in background mode");
        detachAppSounds();
      }
    };

    const setupSocket = () => {
      socket.connect();
      socket.on('connect', () => console.log("socket is connected"));
      socket.on('ping', () => {
        console.log("received keep-alive");
        socket.emit('pong');
      });
      socket.on('disconnect', () => onDisconnected(socket));
      socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
      socket.on('refresh', reload);
    };

    const mobileServiceSetup = async () => {
      setupSocket();
      attachAppSounds();
      appStateChangeListener = await App.addListener('appStateChange', handleAppStateChange);
    };

    if (isNative()) {
      console.log('running on a native platform.');
      document.addEventListener('deviceready', mobileServiceSetup);
    } else {
      newOrderRef.current = getAudio('/alarms/new_order.mp3');
      cookingStartedRef.current = getAudio('/alarms/cooking_started.mp3');
      cookingExceededRef.current = getAudio('/alarms/cooking_exceeded.mp3');
      newDeliveryRef.current = getAudio('/alarms/new_delivery.mp3');
      deliverDelayedRef.current = getAudio('/alarms/deliver_delayed.mp3');
      newDishDisposalRef.current = getAudio('/alarms/new_dish_disposal.mp3');

      setupSocket();

      console.log('running on a web platform.');
      window.addEventListener('beforeunload', cleanup);
      attachWebSounds().then();
    }

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
      if (isNative() && appStateChangeListener) {
        appStateChangeListener.remove().then();
      }
    }

  }, []);

  // 알림 변경
  useEffect(() => {
    client
      .get('/api/manager/order/pending')
      .then((res) => {
        const { pendingReceipt, waitingForDelivery, inPickingUp } = res.data;

        if (pendingReceipt && user?.permission !== PermissionEnum.Manager) {
          startAlarm(isNative() ? 'new_order.mp3' : newOrderRef);
        }

        if (user?.permission === PermissionEnum.Rider) {
          if (waitingForDelivery) {
            playAudio(isNative() ? 'new_delivery.mp3' : newDeliveryRef);
          }

          if (inPickingUp) {
            playAudio(isNative() ? 'new_dish_disposal.mp3' : newDishDisposalRef);
          }
        }
      });
  }, [user]);

  // mute 변경
  useEffect(() => {
    newOrderRef.current && (newOrderRef.current.muted = muted);
    cookingStartedRef.current && (cookingStartedRef.current.muted = muted);
    cookingExceededRef.current && (cookingExceededRef.current.muted = muted);
    newDeliveryRef.current && (newDeliveryRef.current.muted = muted);
    deliverDelayedRef.current && (deliverDelayedRef.current.muted = muted);
    newDishDisposalRef.current && (newDishDisposalRef.current.muted = muted);
  }, [muted]);

  // 그릇수거 체크
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
      <TopBar
        mode={'order'}
        setOpen={setOpen}
        searchData={searchData}
        setSearchData={setSearchData}
        current={currentPage}
        total={totalPage}
        prev={prev}
        next={next}
        muted={muted}
        setMuted={setMuted}
        isRemaining={isRemaining}
        setIsRemaining={setIsRemaining}
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

      <MakeOrderModal
        open={open}
        onClose={() => setOpen(false)}
        setOpen={setOpen}
      />

    </>
  );
}
