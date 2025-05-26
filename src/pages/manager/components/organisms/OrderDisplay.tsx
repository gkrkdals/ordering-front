import OrderTable from "@src/pages/manager/components/molecules/OrderTable.tsx";
import {OrderStatusRaw} from "@src/models/manager/OrderStatusRaw.ts";
import MakeOrderModal from "@src/pages/manager/modals/order/MakeOrderModal.tsx";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {getUser, onDisconnected, managerSocket} from "@src/utils/network/socket.ts";
import useTable from "@src/hooks/UseTable.tsx";
import {AudioRefObject, getAudio, playAudio} from "@src/utils/music.ts";
import TopBar from "@src/pages/manager/components/molecules/TopBar.tsx";
import client, {printerClient} from "@src/utils/network/client.ts";
import {useRecoilValue} from "recoil";
import UserState from "@src/recoil/atoms/UserState.ts";
import {PermissionEnum} from "@src/models/manager/PermissionEnum.ts";
import {Column} from "@src/models/manager/Column.ts";
import {useTableSort} from "@src/hooks/UseTableSort.tsx";
import {PluginListenerHandle} from "@capacitor/core";
import {isNative} from "@src/utils/native/native.ts";
import {App, AppState} from "@capacitor/app";
import {formatCurrency} from "@src/utils/data.ts";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import type {Value} from "react-calendar/dist/cjs/shared/types.js";
import {dateToString} from "@src/utils/date.ts";
import ShowPreviousSalesModal from "@src/pages/manager/modals/order/ShowPreviousSalesModal.tsx";

const columns: Column[] = [
  {key: '', name: '순번'},
  {key: 'customer_name', name: '고객명'},
  {key: 'menu_name', name: '메뉴'},
  {key: 'request', name: '요청사항'},
  {key: 'status', name: '상태'},
  {key: 'credit', name: '잔금'}
];

type ReloadFunction = () => Promise<void>;

export default function OrderDisplay() {
  const [openMakeOrderModal, setOpenMakeOrderModal] = useState(false);
  const [openShowPrevSalesModal, setOpenShowPrevSalesModal] = useState(false);
  const [muted, setMuted] = useState(true);
  const user = useRecoilValue(UserState);

  // 소리 재생을 위한 오디오 레퍼런스
  const newOrderRef = useRef<HTMLAudioElement | null>(null);

  const cookingStartedRef = useRef<HTMLAudioElement | null>(null);
  const checkRequestRef = useRef<HTMLAudioElement | null>(null);

  const cookingExceededRef = useRef<HTMLAudioElement | null>(null);

  const newDeliveryRef = useRef<HTMLAudioElement | null>(null);
  const isRequestDoneRef = useRef<HTMLAudioElement | null>(null);

  const duringDeliveryRef = useRef<HTMLAudioElement | null>(null);

  const deliverDelayedRef = useRef<HTMLAudioElement | null>(null);
  const newDishDisposalRef = useRef<HTMLAudioElement | null>(null);

  // 인터벌 ID 레퍼런스
  const intervalId = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // 데이터 정렬
  const [sort, setSort, params] = useTableSort(columns);

  // 그릇수거 확인
  const [isRemaining, setIsRemaining] = useState(false);

  const [sales, setSales] = useState(0);
  const [date, setDate] = useState(new Date());

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
  const reloadRef = useRef<ReloadFunction | null>(null);

  function clearAlarm() { clearInterval(intervalId.current) }
  function startAlarm(audioRef: AudioRefObject, data?: boolean) {
    if (getUser() === 'cook' && data) {
      return;
    }

    clearAlarm();
    playAudio(audioRef, data);
    intervalId.current = setInterval(() => playAudio(audioRef, data), 3000);
  }

  function cleanup() {
    clearAlarm();
    managerSocket.removeAllListeners();
    managerSocket.disconnect();
  }

  const reloadData = useCallback(async () => {
    await reload();
    const res = await client.get('/api/manager/order/sales');
    setSales(res.data);
  }, [reload]);

  useEffect(() => {
    client
      .get('/api/manager/order/sales')
      .then((res) => setSales(res.data));

    let appStateChangeListener: PluginListenerHandle;

    const attachWebSounds = async () => {
      managerSocket.on('new_order', (data) => startAlarm(newOrderRef, data));
      managerSocket.on('cooking_started', (data) => playAudio(cookingStartedRef, data));
      managerSocket.on('check_request', (data) => startAlarm(checkRequestRef, data));
      managerSocket.on('clear_alarm', clearAlarm);
      if (getUser() === 'cook') {
        managerSocket.on('cooking_exceeded', (data) => playAudio(cookingExceededRef, data));
      } else {
        managerSocket.on('new_delivery', () => playAudio(newDeliveryRef));
        managerSocket.on('is_request_done', () => playAudio(isRequestDoneRef));
        managerSocket.on('during_delivery', () => playAudio(duringDeliveryRef))
        managerSocket.on('deliver_delayed', () => playAudio(deliverDelayedRef));
        managerSocket.on('new_dish_disposal', () => playAudio(newDishDisposalRef));
      }
    };

    const attachAppSounds = () => {
      managerSocket.on('new_order', () => startAlarm('new_order.mp3'));
      managerSocket.on('cooking_started', () => playAudio('cooking_started.mp3'));
      managerSocket.on('check_request', () => startAlarm('check_request.mp3'));
      managerSocket.on('clear_alarm', clearAlarm)
      if (getUser() === 'cook') {
        managerSocket.on('cooking_exceeded', () => playAudio('cooking_exceeded.mp3'));
      } else {
        managerSocket.on('new_delivery', () => playAudio('new_delivery.mp3'));
        managerSocket.on('is_request_done', () => playAudio('is_request_done.mp3'));
        managerSocket.on('during_delivery', () => playAudio('during_delivery.mp3'));
        managerSocket.on('deliver_delayed', () => playAudio('deliver_delayed.mp3'));
        managerSocket.on('new_dish_disposal', () => playAudio('new_dish_disposal.mp3'));
      }
      console.log("sound service attached");
    }

    const detachAppSounds = () => {
      managerSocket.removeListener('new_order');
      managerSocket.removeListener('cooking_started');
      managerSocket.removeListener('check_request');
      managerSocket.removeListener('clear_alarm');
      managerSocket.removeListener('cooking_exceeded');
      managerSocket.removeListener('new_delivery');
      managerSocket.removeListener('is_request_done');
      managerSocket.removeListener('during_delivery');
      managerSocket.removeListener('deliver_delayed');
      managerSocket.removeListener('new_dish_disposal');
      clearAlarm();
      console.log("sound service detached");
    }

    const handleAppStateChange = async (state: AppState) => {
      if (state.isActive) {
        console.log("app is in foreground mode");
        attachAppSounds();
        await reloadRef.current?.();
        const res = await client.get('/api/manager/order/alarm');
        if (res.data) {
          clearAlarm();
        }

      } else {
        console.log("app is in background mode");
        detachAppSounds();
      }
    };

    const setupManagerSocket = () => {
      managerSocket.connect();
      managerSocket.on('connect', () => console.log("socket is connected"));
      managerSocket.on('ping', () => managerSocket.emit('pong'));
      managerSocket.on('disconnect', () => onDisconnected(managerSocket));
      managerSocket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
      managerSocket.on('refresh', reloadData);
      if (!isNative() && getUser() === 'manager') {
        managerSocket.on("print_receipt", (menu) => printerClient.post('/print', menu))
        console.log("printer service started");
      }
    };

    const mobileServiceSetup = async () => {
      setupManagerSocket();
      attachAppSounds();
      appStateChangeListener = await App.addListener('appStateChange', handleAppStateChange);
    };

    if (isNative()) {
      console.log('running on a native platform.');
      document.addEventListener('deviceready', mobileServiceSetup);
    } else {
      newOrderRef.current = getAudio('/alarms/new_order.mp3');
      cookingStartedRef.current = getAudio('/alarms/cooking_started.mp3');
      checkRequestRef.current = getAudio('/alarms/check_request.mp3');
      cookingExceededRef.current = getAudio('/alarms/cooking_exceeded.mp3');
      newDeliveryRef.current = getAudio('/alarms/new_delivery.mp3');
      isRequestDoneRef.current = getAudio('/alarms/is_request_done.mp3');
      duringDeliveryRef.current = getAudio('/alarms/during_delivery.mp3');
      deliverDelayedRef.current = getAudio('/alarms/deliver_delayed.mp3');
      newDishDisposalRef.current = getAudio('/alarms/new_dish_disposal.mp3');

      setupManagerSocket();

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

  function handleChangeDate(value: Value, _: React.MouseEvent<HTMLButtonElement>) {
    setDate(value as Date);

    const today = dateToString(new Date());
    const targetDay = dateToString(value as Date);
    const todayToNumber = parseInt(today.split(' ')[0].replaceAll('-', ''));
    const targetDayToNumber = parseInt(targetDay.split(' ')[0].replaceAll('-', ''));

    if (targetDayToNumber <= todayToNumber) {
      setOpenShowPrevSalesModal(true);
    }
  }

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
    managerSocket.removeListener('refresh');
    managerSocket.on('refresh', reloadData);

  }, [url, currentPage, params, debouncedSearchText])

  useEffect(() => {
    reloadRef.current = reloadData;
  }, [reloadData]);

  return (
    <>
      <TopBar
        mode={'order'}
        setOpen={setOpenMakeOrderModal}
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
        reload={reloadData}
      />
      <OrderTable
        columns={columns}
        count={count}
        orderstatus={data}
        page={currentPage}
        reload={reloadData}
        sort={sort}
        setSort={setSort}
        isRemaining={isRemaining}
      />
      금일 매출: {formatCurrency(sales)}
      <div className='d-flex justify-content-center justify-content-sm-start mt-3'>
        <Calendar
          locale={'ko-KR'}
          calendarType='gregory'
          value={date}
          onChange={handleChangeDate}
        />
      </div>
      <MakeOrderModal
        open={openMakeOrderModal}
        onClose={() => setOpenMakeOrderModal(false)}
        setOpen={setOpenMakeOrderModal}
      />
      <ShowPreviousSalesModal
        open={openShowPrevSalesModal}
        setOpen={setOpenShowPrevSalesModal}
        date={date}
      />

    </>
  );
}
