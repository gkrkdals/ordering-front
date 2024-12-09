import CenterContainer from "@src/components/CenterContainer.tsx";
import FormControl from "@src/components/atoms/FormControl.tsx";
import {PrimaryButton} from "@src/components/atoms/Buttons.tsx";
import {useEffect, useState} from "react";
import client from "@src/utils/network/client.ts";
import {AxiosError} from "axios";
import {useRecoilState} from "recoil";
import userState from "@src/recoil/atoms/UserState.ts";
import User from "@src/models/manager/User.ts";
import {useNavigate} from "react-router-dom";
import {getUrl} from "@src/utils/data.ts";
import {Capacitor} from "@capacitor/core";
import {ForegroundService} from "@capawesome-team/capacitor-android-foreground-service";
import {isNative} from "@src/utils/native/native.ts";
import {App} from "@capacitor/app";
import {FirebaseMessaging} from "@capacitor-firebase/messaging";
import {PushNotifications} from "@capacitor/push-notifications";
import {getObject, setObject} from "@src/utils/native/preferences.ts";

let lastBackPress = 0; // 마지막 클릭 시간을 저장
const doublePressDelay = 1000; // 두 번 클릭 사이의 시간 간격 (2000ms = 2초)

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [failed, setFailed] = useState(false);
  const navigate = useNavigate();

  const [, setUser] = useRecoilState(userState);

  async function handleLogin() {
    try {
      let token: string | undefined;
      if (isNative()) {
        const result = await FirebaseMessaging.getToken();
        token = result.token;
      }

      setIsLoggingIn(true);
      const res = await client.post("/api/auth/manager/signin", { username, password, token });
      const userData: { jwt: string, payload: User } = res.data;
      setUser(userData.payload);
      if (isNative()) {
        await setObject("jwt", userData.jwt);
      }
      navigate(`/${getUrl(userData.payload)}`);
    } catch (e) {
      if (e instanceof AxiosError && e.response && e.response.status === 400) {
        setFailed(true);
      } else {
        console.log(e);
      }
    } finally {
      setIsLoggingIn(false);
    }
  }

  /**
   * jwt가 있으면 자동으로 로그인함
   */
  async function handleAppLogin() {
    try {
      setIsLoggingIn(true);
      const jwt = (await getObject("jwt")).value;
      const tokenResult = await FirebaseMessaging.getToken();
      if (jwt) {
        const res = await client.post("/api/auth/manager/app/signin", { jwt, token: tokenResult.token });
        const userData: User = res.data;
        setUser(userData);
        navigate(`/${getUrl(userData)}`)
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function getPermissions() {
    if (Capacitor.getPlatform() === 'android') {
      const permissionRes = await ForegroundService.checkPermissions();
      if (permissionRes.display !== "granted") {
        await ForegroundService.requestPermissions();
      }

      const overlayPermission = await ForegroundService.checkManageOverlayPermission();
      if (!overlayPermission.granted) {
        await ForegroundService.requestManageOverlayPermission();
      }
    }

    const pushNotificationsPermission = await PushNotifications.checkPermissions()
    if (pushNotificationsPermission.receive !== "granted") {
      await ForegroundService.requestPermissions();
    }
  }

  // 알림 허가를 받고 알림 등록 후 로그인
  useEffect(() => {
    if (isNative()) {
      getPermissions()
        .then(() => {
          return App.addListener('backButton', async () => {
            const currentTime = new Date().getTime(); // 현재 시간
            if (currentTime - lastBackPress < doublePressDelay) {
              // 토픽 unsubscribe는 앱 종료 네이티브 코드에서 발동
              await App.exitApp();
            } else {
              // 첫 번째 클릭 시 현재 시간을 저장
              lastBackPress = currentTime;
              console.log('Press back again to exit the app.');
            }
          })
        })
        .then(() => {
          return handleAppLogin();
        });
    }
  }, []);

  return (
    <CenterContainer>
      <div className='border border-gray-200 p-3 rounded' style={{ width: 300 }}>
        <div className='mb-2'>ID</div>
        <FormControl
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder='ID 입력'
        />
        <div className='my-3'/>
        <div className='mb-2'>비밀번호</div>
        <FormControl
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='비밀번호 입력'
        />
        <div className='my-3'/>
        <PrimaryButton
          style={{ width: '100%', marginBottom: failed ? '10px' : '' }}
          onClick={handleLogin}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? '로그인 중..' : '로그인'}
        </PrimaryButton>
        {failed && <p className='text-danger'>ID 또는 비밀번호가 잘못되었습니다.</p>}
      </div>
    </CenterContainer>
  );
}