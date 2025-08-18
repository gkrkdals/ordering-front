import BasicDialogProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import SelectedMenu from "@src/models/client/SelectedMenu.ts";

interface OrderApproveDialogProps extends BasicDialogProps {
  selectedMenus: SelectedMenu[];
  onClickCancel: () => void;
  onClickProceed: () => void;
}

export default function OrderApproveDialog({ open, onClose, onClickProceed, onClickCancel, selectedMenus }: OrderApproveDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <div className='my-2' />
        {selectedMenus.map((selectedMenu, i) => (
          <div key={i} className="mb-1">
            {i + 1}.&nbsp;{selectedMenu.menu.name}
          </div>
        ))}
        <div className='my-2' />
        <div className='mb-1'>총 <strong>{selectedMenus.length}</strong>개의 메뉴를 주문하시겠습니까?</div>
      </DialogContent>
      <DialogActions>
        <button onClick={onClickCancel} className='btn btn-sm btn-secondary'>
          취소
        </button>
        <button onClick={onClickProceed} className='btn btn-sm btn-primary'>
          진행
        </button>
      </DialogActions>
    </Dialog>
  )
}