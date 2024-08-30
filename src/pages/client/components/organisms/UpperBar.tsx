import userState from "@src/recoil/atoms/UserState"
import { useRecoilValue } from "recoil"

export default function UpperBar() {
  const user = useRecoilValue(userState);

  return (
    <div
      className="bg-primary d-flex justify-content-center align-items-center"
      style={{
        position: 'sticky',
        top: 0,
        height: "45px",
      }}
    >
      <h5 className="m-0 text-light">{user ? user.name : ''}</h5>
      <i
        className="bi bi-gear text-light position-absolute"
        style={{
          left: "90vw",
          fontSize: "19pt"
        }}
      />
    </div>
  )
}