import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import SelectedMenu from "@src/models/client/SelectedMenu.ts";

interface OrderCompletedDialogProps extends BasicModalProps {
  selectedMenus: SelectedMenu[];
  setSelectedMenus: (selectedMenus: SelectedMenu[]) => void;
}

export default function OrderCompletedDialog(props: OrderCompletedDialogProps) {

  function handleClose() {
    setTimeout(() => {
      props.setSelectedMenus([]);
    }, 300);
    props.setOpen(false);
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>
        주문 완료
      </DialogTitle>
      <DialogContent>
        <div className='my-2' />
        {props.selectedMenus.map((selectedMenu, i) => (
          <div key={i} className="mb-1">
            {i + 1}.&nbsp;{selectedMenu.menu.name}
          </div>
        ))}
        <div className='my-2' />
        <div className='mb-1'>총 <strong>{props.selectedMenus.length}</strong>개의 메뉴가 주문되었습니다.</div>
        <div>주문하기 버튼 아래에서 진행상태를 확인하세요.</div>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={handleClose}>
          닫기
        </SecondaryButton>
      </DialogActions>
    </Dialog>
  );
}