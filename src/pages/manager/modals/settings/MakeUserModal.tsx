import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import FormControl from "@src/components/atoms/FormControl.tsx";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {useEffect, useState} from "react";
import client from "@src/utils/client.ts";
import Select from "@src/components/atoms/Select.tsx";
import {PermissionEnum} from "@src/models/manager/PermissionEnum.ts";

interface MakeUserModalProps extends BasicModalProps {}

export function MakeUserModal(props: MakeUserModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [permission, setPermission] = useState(1);

  const [warning, setWarning] = useState(false);

  function initialize() {
    setUsername('');
    setPassword('');
    setNickname('');
    setPermission(1);
    setWarning(false);
  }

  async function handleCreateAccount() {
    if (username === '' || password === '' || nickname === '') {
      setWarning(true);
    } else {
      await client.post('/api/auth/account', { username, password, nickname, permission });
      props.setOpen(false);
    }
  }

  useEffect(() => {
    if (props.open) {
      initialize();
    }
  }, [props.open]);

  return (
    <Dialog open={props.open}>
      <DialogTitle>계정 생성</DialogTitle>
      <DialogContent>
        <div className='mb-2'>ID</div>
        <FormControl
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="off"
          placeholder='새 ID 입력'
        />
        <div className='my-3'/>
        <div className='mb-2'>비밀번호</div>
        <FormControl
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="off"
          placeholder='새 비밀번호 입력'
        />
        <div className='my-3'/>
        <div className='mb-2'>별명</div>
        <FormControl
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          placeholder='별명 입력'
        />
        <div className='my-3'/>
        <div className='mb-2'>계정구분</div>
        <Select value={permission} onChange={e => setPermission(parseInt(e.target.value))}>
          <option value={PermissionEnum.Manager}>최고관리자</option>
          <option value={PermissionEnum.Rider}>배달자</option>
          <option value={PermissionEnum.Cook}>조리원</option>
        </Select>
        {warning && (
          <div className='my-3'>
            <p className='m-0 text-danger'>
              모든 항목을 입력하시기 바랍니다.
            </p>
          </div>
        )}
      </DialogContent>
      <DialogActions>
      <SecondaryButton onClick={() => props.setOpen(false)}>
          닫기
        </SecondaryButton>
        <PrimaryButton onClick={handleCreateAccount}>
          저장
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  )
}