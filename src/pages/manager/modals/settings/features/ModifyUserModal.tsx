import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import React, {useEffect, useState} from "react";
import User from "@src/models/manager/User.ts";
import client from "@src/utils/network/client.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Select from "@src/components/atoms/Select.tsx";
import {DangerButton, PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import FormControl from "@src/components/atoms/FormControl.tsx";

const permissions = [
  { key: 1, value: "마스터" },
  { key: 2, value: "배달원" },
  { key: 3, value: "조리원" },
];

export default function ModifyUserModal({ open, setOpen }: BasicModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [openModified, setOpenModified] = useState(false);
  const [openCheckDelete, setOpenCheckDelete] = useState(false);
  const [openDeleted, setOpenDeleted] = useState(false);

  function initialize() {
    setSelectedUser(null);
    setOpen(false);
  }

  async function reload() {
    const res = await client.get('/api/auth/account');
    setUsers(res.data);
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = parseInt(e.target.value);
    const user = users.find((user) => user.id === id);
    if (user) {
      setSelectedUser(user);
    }
  }

  async function handleUpdate() {
    await client.put('/api/auth/account', { user: selectedUser });
    setOpenModified(true);
    await reload();
  }

  async function handleDelete() {
    await client.delete(`/api/auth/account/${selectedUser?.id}`);
    await reload();
    setSelectedUser(null);
    setOpenCheckDelete(false);
    setOpenDeleted(true);
  }

  useEffect(() => {
    if (open) {
      reload().then();
    }
  }, [open]);

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>계정 수정/삭제</DialogTitle>
        <DialogContent>
          <div className='mb-2'>계정 선택</div>
          <Select
            value={selectedUser ? selectedUser.id : 0}
            onChange={handleChange}
          >
            <option value={0} hidden>계정 선택</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.nickname}</option>
            ))}
          </Select>
          {selectedUser && (
            <>
              <div className="my-3"/>
              <div className='mb-2'>별명</div>
              <FormControl
                value={selectedUser.nickname}
                onChange={e => setSelectedUser({...selectedUser, nickname: e.target.value})}
              />
              <div className="my-3"/>
              <div className='mb-2'>권한</div>
              <Select
                value={selectedUser.permission}
                onChange={e => setSelectedUser({ ...selectedUser, permission: parseInt(e.target.value) })}
              >
                {permissions.map((permission) => (
                  <option key={permission.key} value={permission.key}>{permission.value}</option>
                ))}
              </Select>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {selectedUser && (
            <>
              <DangerButton onClick={() => setOpenCheckDelete(true)}>
                삭제
              </DangerButton>
              <PrimaryButton onClick={handleUpdate}>
                변경
              </PrimaryButton>
            </>
          )}
          <SecondaryButton onClick={initialize}>
            닫기
          </SecondaryButton>
        </DialogActions>
      </Dialog>

      <Dialog open={openModified}>
        <DialogContent>
          변경되었습니다.
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => {
            setOpenModified(false);
          }}>
            닫기
          </SecondaryButton>
        </DialogActions>
      </Dialog>

      <Dialog open={openCheckDelete}>
        <DialogContent>
          정말 삭제하시겠습니까?
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => setOpenCheckDelete(false)}>
            취소
          </SecondaryButton>
          <DangerButton onClick={handleDelete}>
            삭제
          </DangerButton>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleted}>
        <DialogContent>
          삭제되었습니다.
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => {
            setOpenDeleted(false);
          }}>
            닫기
          </SecondaryButton>
        </DialogActions>
      </Dialog>
    </>
  );
}