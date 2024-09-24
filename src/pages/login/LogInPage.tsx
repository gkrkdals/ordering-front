import CenterContainer from "@src/components/CenterContainer.tsx";
import FormControl from "@src/components/atoms/FormControl.tsx";
import {PrimaryButton} from "@src/components/atoms/Buttons.tsx";
import {useState} from "react";
import client from "@src/utils/client.ts";
import {AxiosError} from "axios";
import {useRecoilState} from "recoil";
import userState from "@src/recoil/atoms/UserState.ts";
import User from "@src/models/manager/User.ts";
import {useNavigate} from "react-router-dom";
import {getUrl} from "@src/utils/data.ts";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [failed, setFailed] = useState(false);
  const navigate = useNavigate();

  const [, setUser] = useRecoilState(userState);

  async function handleLogin() {
    try {
      const res = await client.post("/api/auth/manager/signin", { username, password });
      const userData: User = res.data;
      setUser(userData);
      navigate(`/${getUrl(userData)}`);
    } catch (e) {
      if (e instanceof AxiosError && e.response && e.response.status === 400) {
        setFailed(true);
      }
    }
  }

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