import CenterContainer from "@src/components/CenterContainer.tsx";
import FormControl from "@src/components/atoms/FormControl.tsx";
import {PrimaryButton} from "@src/components/atoms/Buttons.tsx";
import {useEffect, useState} from "react";
import client from "@src/utils/client.ts";
import {AxiosError} from "axios";
import {useRecoilState} from "recoil";
import userState from "@src/recoil/atoms/UserState.ts";
import User from "@src/models/manager/User.ts";
import {useNavigate} from "react-router-dom";
import {getUrl} from "@src/utils/data.ts";
import {Capacitor, PluginListenerHandle} from "@capacitor/core";
import {ForegroundService} from "@capawesome-team/capacitor-android-foreground-service";
import {PermissionEnum} from "@src/models/manager/PermissionEnum.ts";
import {isNative} from "@src/utils/native.ts";
import {App} from "@capacitor/app";
import {FirebaseMessaging} from "@capacitor-firebase/messaging";

let lastBackPress = 0; // 마지막 클릭 시간을 저장
const doublePressDelay = 1000; // 두 번 클릭 사이의 시간 간격 (2000ms = 2초)

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [failed, setFailed] = useState(false);
  const navigate = useNavigate();

  const [, setUser] = useRecoilState(userState);

  async function getProfile() {
    const res = await client.post("/api/auth/manager/profile");
    setUser(res.data);
    return res.data as User;
  }

  async function handleLogin() {
    try {
      let token: string | undefined;
      if (isNative()) {
        const result = await FirebaseMessaging.getToken();
        token = result.token;
      }

      const res = await client.post("/api/auth/manager/signin", { username, password, token });
      const userData: User = res.data;
      setUser(userData);
      navigate(`/${getUrl(userData)}`);
    } catch (e) {
      if (e instanceof AxiosError && e.response && e.response.status === 400) {
        setFailed(true);
      } else {
        console.log(e);
      }
    }
  }

  async function getPermissions() {
    if (isNative()) {
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

      const firebasePermissionRes = await FirebaseMessaging.checkPermissions();
      if (firebasePermissionRes.receive !== "granted") {
        await FirebaseMessaging.requestPermissions();
      }
    }
  }

  useEffect(() => {
    getPermissions().then();
  }, []);

  useEffect(() => {
    getProfile()
      .then((user) => {
        let suffix: string;
        if (user.permission === PermissionEnum.Manager) {
          suffix = 'manager';
        } else if (user.permission === PermissionEnum.Rider) {
          suffix = 'rider';
        } else {
          suffix = 'cook';
        }

        navigate(`/${suffix}`);
      })
  }, []);

  useEffect(() => {
    let backButtonListener: PluginListenerHandle;

    if (isNative()) {
      App
        .addListener('backButton', async () => {
          const currentTime = new Date().getTime(); // 현재 시간
          if (currentTime - lastBackPress < doublePressDelay) {
            // 두 번 클릭 시 앱 종료
            await App.exitApp();
          } else {
            // 첫 번째 클릭 시 현재 시간을 저장
            lastBackPress = currentTime;
            console.log('Press back again to exit the app.');
          }
        })
        .then(listener => backButtonListener = listener);
    }

    return () => {
      if (isNative()) {
        backButtonListener.remove().then();
      }
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
        >
          로그인
        </PrimaryButton>
        {failed && <p className='text-danger'>ID 또는 비밀번호가 잘못되었습니다.</p>}
      </div>
    </CenterContainer>
  );
}