import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import client from "@src/utils/network/client.ts";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {MenuContext} from "@src/contexts/manager/MenuContext.tsx";
import SelectMenu from "@src/components/molecules/SelectMenu.tsx";

export default function NoAlarmsModal(props: BasicModalProps) {
  const [noAlarms, setNoAlarms] = useState<number[]>([]);
  const [menus, ] = useContext(MenuContext)!;

  const [addNoAlarm, setAddNoAlarm] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState(-1);

  async function getNoAlarms() {
    const res = await client.get('/api/manager/settings/no-alarm');
    setNoAlarms(res.data);
  }

  async function handleAddNoAlarm() {
    if (selectedMenu !== -1) {
      await client.put('/api/manager/settings/no-alarm', { menu: selectedMenu });
      setAddNoAlarm(false);
      setSelectedMenu(-1);
      await getNoAlarms();
    }
  }

  async function handleDeleteNoAlarm(menu: number) {
    await client.delete(`/api/manager/settings/no-alarm/${menu}`);
    await getNoAlarms();
  }

  useEffect(() => {
    if (props.open) {
      getNoAlarms().then();
    }
  }, [props.open]);

  return (
    <>
      <Dialog open={props.open}>
        <DialogContent>
          {noAlarms.map(noAlarmMenu => (
            <div className='d-flex justify-content-between w-100 border border-black'>
              <div className='mx-3 my-2'>{menus.find(menu => menu.id === noAlarmMenu)?.name}</div>
              <div className='my-auto mx-2' onClick={() => handleDeleteNoAlarm(noAlarmMenu)}>
                <i className="bi bi-x-lg"></i>
              </div>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <PrimaryButton onClick={() => setAddNoAlarm(true)}>
            추가
          </PrimaryButton>
          <SecondaryButton onClick={() => props.setOpen(false)}>
            닫기
          </SecondaryButton>
        </DialogActions>
      </Dialog>

      <Dialog open={addNoAlarm}>
        <DialogContent>
          <SelectMenu uniqueId={'1234'} menus={menus} setSelectedMenu={setSelectedMenu} />
          <p className='text-secondary'>선택된 메뉴: {menus.find(menu => menu.id === selectedMenu)?.name}</p>
        </DialogContent>
        <DialogActions>
          <PrimaryButton onClick={handleAddNoAlarm}>
            추가
          </PrimaryButton>
          <SecondaryButton onClick={() => setAddNoAlarm(false)}>
            닫기
          </SecondaryButton>
        </DialogActions>
      </Dialog>
    </>
  )
}