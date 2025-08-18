import customerState from "@src/recoil/atoms/CustomerState.ts"
import { useRecoilValue } from "recoil"
import {useState} from "react";
import SettingsModal from "@src/pages/client/modals/settings/SettingsModal.tsx";

export default function UpperBar() {
  const user = useRecoilValue(customerState);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);

  return (
    <>
      <div
        className="bg-primary d-flex justify-content-center align-items-center"
        style={{
          position: 'sticky',
          top: 0,
          height: "45px",
        }}
      >
        <img
          src="/logo.png"
          className='position-absolute'
          alt="넘버원푸드 로고"
          width={38}
          height={30}
          style={{
            left: "8vw"
          }}
        />
        <h5 className="m-0 text-light">{user ? user.name : ''}</h5>
        <i
          className="bi bi-gear text-light position-absolute"
          style={{
            left: "90vw",
            fontSize: "19pt",
            cursor: 'pointer'
          }}
          onClick={() => setOpenSettingsModal(true)}
        />
      </div>

      <SettingsModal
        open={openSettingsModal}
        setOpen={setOpenSettingsModal}
      />
    </>
  )
}