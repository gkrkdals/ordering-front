import {Dialog, DialogActions, DialogContent} from "@mui/material";
import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {useState} from "react";
import {MakeUserModal} from "@src/pages/manager/modals/settings/MakeUserModal.tsx";
import {MakeCalculationModal} from "@src/pages/manager/modals/settings/MakeCalculationModal.tsx";
import MakeQRModal from "@src/pages/manager/modals/settings/MakeQRModal.tsx";
import ModifyExceedTime from "@src/pages/manager/modals/settings/ModifyExceedTime.tsx";
import StandardInfoModal from "@src/pages/manager/modals/settings/StandardInfoModal.tsx";
import ModifyUserModal from "@src/pages/manager/modals/settings/ModifyUserModal.tsx";
import NoAlarmsModal from "@src/pages/manager/modals/settings/NoAlarmsModal.tsx";

interface SettingModalProps extends BasicModalProps {}

export default function SettingModal(props: SettingModalProps) {
  const [makeQR, setMakeQR] = useState(false);
  const [makeUser, setMakeUser] = useState(false);
  const [modifyUser, setModifyUser] = useState(false);
  const [openCalculation, setOpenCalculation] = useState(false);
  const [openModifyExceedTimes, setOpenModifyExceedTimes] = useState(false);
  const [openStandardInfo, setOpenStandardInfo] = useState(false);
  const [openNoAlarms, setOpenNoAlarms] = useState(false);

  function handleOpenMakeQR() {
    props.setOpen(false);
    setMakeQR(true);
  }

  function handleOpenMakeAccountModal() {
    props.setOpen(false);
    setMakeUser(true);
  }

  function handleOpenModifyAccountModal() {
    props.setOpen(false);
    setModifyUser(true);
  }

  function handleOpenCalculation() {
    props.setOpen(false);
    setOpenCalculation(true);
  }

  function handleOpenModifyExccedTimes() {
    props.setOpen(false);
    setOpenModifyExceedTimes(true);
  }

  function handleOpenStandardInfo() {
    props.setOpen(false);
    setOpenStandardInfo(true);
  }

  function handleOpenNoAlarms() {
    props.setOpen(false);
    setOpenNoAlarms(true);
  }

  return (
    <>
      <Dialog open={props.open}>
        <DialogContent>
          <div className='d-flex py-3 px-2' onClick={handleOpenMakeQR}>
            <i className="bi bi-qr-code me-2"></i>
            QR코드 생성
          </div>
          <div className='d-flex py-3 px-2' onClick={handleOpenMakeAccountModal}>
            <i className="bi bi-person-circle me-2"></i>
            관리계정 생성
          </div>
          <div className='d-flex py-3 px-2' onClick={handleOpenModifyAccountModal}>
            <i className="bi bi-person-circle me-2"></i>
            관리계정 수정
          </div>
          <div className='d-flex py-3 px-2' onClick={handleOpenCalculation}>
            <i className="bi bi-receipt-cutoff me-2"></i>
            정산
          </div>
          <div className='d-flex py-3 px-2' onClick={handleOpenModifyExccedTimes}>
            <i className="bi bi-clock me-2"></i>
            초과시간 설정
          </div>
          <div className='d-flex py-3 px-2' onClick={handleOpenStandardInfo}>
            <i className="bi bi-info-circle me-2"></i>
            기본정보 설정
          </div>
          <div className='d-flex py-3 px-2' onClick={handleOpenNoAlarms}>
            <i className="bi bi-volume-mute me-2"></i>
            조리원 알림 음소거 설정
          </div>

        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => props.setOpen(false)}>
            닫기
          </SecondaryButton>
        </DialogActions>
      </Dialog>

      <MakeQRModal open={makeQR} setOpen={setMakeQR}/>
      <MakeUserModal open={makeUser} setOpen={setMakeUser}/>
      <ModifyUserModal open={modifyUser} setOpen={setModifyUser} />
      <MakeCalculationModal open={openCalculation} setOpen={setOpenCalculation}/>
      <ModifyExceedTime open={openModifyExceedTimes} setOpen={setOpenModifyExceedTimes}/>
      <StandardInfoModal open={openStandardInfo} setOpen={setOpenStandardInfo} />
      <NoAlarmsModal open={openNoAlarms} setOpen={setOpenNoAlarms} />
    </>
  )
}