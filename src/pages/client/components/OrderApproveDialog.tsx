import BasicDialogProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent} from "@mui/material";

interface OrderApproveDialogProps extends BasicDialogProps {
  onClickCancel: () => void;
  onClickProceed: () => void;
}

export default function OrderApproveDialog({ open, onclose, onClickProceed, onClickCancel }: OrderApproveDialogProps) {
  return (
    <Dialog open={open} onClose={onclose}>
      <DialogContent>
        <h6>주문하시겠습니까?</h6>
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