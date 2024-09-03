import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {useEffect, useState} from "react";
import BasicDialogProps from "@src/interfaces/BasicModalProps.ts";
import {Disposal} from "@src/models/client/Disposal.ts";
import client from "@src/utils/client.ts";
import {useRecoilValue} from "recoil";
import customerState from "@src/recoil/atoms/CustomerState.ts";

interface DisposalDialogProps extends BasicDialogProps {
  currentDisposal: Disposal | null;
  reload: () => void;
}

export default function DisposalDialog({ open, setOpen, currentDisposal, reload }: DisposalDialogProps) {
  const user = useRecoilValue(customerState);
  const [location, setLocation] = useState<string>(user?.memo ?? '');
  const [modifyingDisposal, setModifyingDisposal] = useState<Disposal | null>(null);

  function initialize() {
    setLocation(user?.memo ?? '');
    setModifyingDisposal(null);
  }

  function handleClose() {
    setOpen(false);
    initialize();
  }

  async function handleDisposal() {
    await client.post('/api/order/dish', {
      disposal: modifyingDisposal,
      location,
    });
    setOpen(false);
    reload();
  }

  useEffect(() => {
    setModifyingDisposal(currentDisposal);
  }, [currentDisposal]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogContent>
        <h6>그릇 위치 입력</h6>
        <input
          type="text"
          className='form-control'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="그릇 위치 입력"
        />
      </DialogContent>
      <DialogActions>
        <button className='btn btn-sm btn-secondary' onClick={handleClose}>취소</button>
        <button
          className='btn btn-sm btn-primary'
          onClick={handleDisposal}
        >
          수거요청
        </button>
      </DialogActions>
    </Dialog>
  )
}