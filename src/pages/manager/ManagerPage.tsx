import Container from "@src/components/Container.tsx";
import {useEffect, useLayoutEffect, useState} from "react";
import Tab from "@src/pages/manager/components/atoms/Tab.tsx";
import MenuCategoryProvider from "@src/contexts/manager/MenuCategoryContext.tsx";
import OrderDisplay from "@src/pages/manager/components/organisms/OrderDisplay.tsx";
import MenuDisplay from "@src/pages/manager/components/organisms/MenuDisplay.tsx";
import CustomerDisplay from "@src/pages/manager/components/organisms/CustomerDisplay.tsx";
import OrderCategoryProvider from "@src/contexts/common/OrderCategoryContext.tsx";
import CustomerCategoryProvider from "@src/contexts/manager/CustomerCategoryContext.tsx";
import client, {printerClient} from "@src/utils/network/client.ts";
import {useRecoilState} from "recoil";
import userState from "@src/recoil/atoms/UserState.ts";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";
import {getUser, onDisconnected, printerSocket} from "@src/utils/network/socket.ts";
import MenuProvider from "@src/contexts/manager/MenuContext.tsx";
import CustomerProvider from "@src/contexts/manager/CustomerContext.tsx";
import {DangerButton} from "@src/components/atoms/Buttons.tsx";
import {App} from "@capacitor/app";
import {PluginListenerHandle} from "@capacitor/core";
import {isNative, startForegroundService, stopForegroundService} from "@src/utils/native/native.ts";
import {deleteObject} from "@src/utils/native/preferences.ts";
import {channels} from "@src/utils/native/notifications.ts";
import {PushNotifications} from "@capacitor/push-notifications";
import {FirebaseMessaging} from "@capacitor-firebase/messaging";

export default function ManagerPage() {
  const [whichMenu, setWhichMenu] = useState<string>('order');
  const [, setUser] = useRecoilState(userState);
  const navigate = useNavigate();

  async function handleLogout() {
    await client.get('/api/auth/manager/logout', { params: { isNative: isNative() } });
    if (isNative()) {
      await deleteObject("jwt");
    }
    navigate('/login');
  }

  function renderSwitch(whichMenu: string) {
    switch(whichMenu) {
      case "order":
        return <OrderDisplay />;

      case "menu":
        return <MenuDisplay />;

      case "customer":
        return <CustomerDisplay />;
    }
  }

  async function createNotificationChannels() {
    if (isNative()) {
      try {
        for (const channel of channels) {
          await PushNotifications.createChannel(channel);
        }
      } catch (e) {
        console.log("error creating notification channels: ", e);
      }
    }
  }

  // foregroundService 시작
  useLayoutEffect(() => {
    if (isNative()) {
      startForegroundService()
        .then(() => {
          return createNotificationChannels();
        })
        .then(() => FirebaseMessaging.addListener("tokenReceived", async (tokenReceivedEvent) => {
            await client.post("/api/auth/manager/fcm", {
              token: tokenReceivedEvent.token
            })
          })
        )
        .catch(() => {
          console.log("Failed to start foreground service");
        })
    }

    return () => {
      if (isNative()) {
        stopForegroundService()
          .then(() => FirebaseMessaging.removeAllListeners())
          .catch(() => {
            console.log("Failed to stop foreground service")
          })
      }
    }
  }, []);

  // jwt가 없으면 메인메뉴 이동
  useEffect(() => {
    client
      .get('/api/auth/manager/profile', { params: { permission: getUser() } })
      .then((res) => setUser(res.data))
      .catch((e: AxiosError) => {
        if (e.response && e.response.status === 401) {
          navigate('/login');
        }
      });
  }, []);

  useEffect(() => {
    let backButtonListener: PluginListenerHandle;

    if (isNative()) {
      App
        .addListener('backButton', () => {})
        .then(listener => backButtonListener = listener);
    }

    return () => {
      if (isNative()) {
        backButtonListener
          .remove()
          .then();
      }
    }
  }, []);

  useEffect(() => {
    const cleanup = () => {
      printerSocket.removeAllListeners();
      printerSocket.disconnect();
    };

    if (!isNative() && getUser() === 'manager') {
      printerSocket.connect();
      printerSocket.on('connect', () => console.log("printer socket is connected"));
      printerSocket.on('ping', () => printerSocket.emit('pong'));
      printerSocket.on('disconnect', () => onDisconnected(printerSocket));
      printerSocket.on('print_receipt', async (menu) => {
        try {
          await printerClient.post('/print', menu);
          console.log("receipt successfully printed");
        } catch (e) {
          console.error("failed to print receipt: ", e);
        }
      });
    }

    window.addEventListener('beforeunload', cleanup);

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    }
  }, []);

  return (
    <MenuCategoryProvider>
      <MenuProvider>
        <OrderCategoryProvider>
          <CustomerCategoryProvider>
            <CustomerProvider>
              <Container>
                <div className="mt-2" />
                <Tab setMenu={setWhichMenu} menu={whichMenu}/>
                <div className="mt-2"/>
                {/*<p className='text-secondary' style={{fontSize: '10pt'}}>각 항목을 클릭하여 항목을 수정할 수 있습니다.</p>*/}
                {renderSwitch(whichMenu)}
                <div className='mb-4' />
                <DangerButton onClick={handleLogout}>로그아웃</DangerButton>
                <div className='mb-4'/>
              </Container>
            </CustomerProvider>
          </CustomerCategoryProvider>
        </OrderCategoryProvider>
      </MenuProvider>
    </MenuCategoryProvider>
  );
}