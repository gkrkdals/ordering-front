import {Dialog, DialogActions, DialogContent} from "@mui/material";
import React, {useEffect, useState} from "react";
import BasicDialogProps from "@src/interfaces/BasicModalProps.ts";
import {Disposal} from "@src/models/client/Disposal.ts";

interface DisposalDialogProps extends BasicDialogProps {
  disposals: Disposal[];
  setdishdisposals: React.Dispatch<React.SetStateAction<Disposal[]>>;
  index: number;
}

export default function DisposalDialog({ open, setopen, disposals, setdishdisposals, index }: DisposalDialogProps) {

  const [location, setLocation] = useState<string>('');

  function handleClose() {
    setdishdisposals((prev) => {
      prev[index].location = location;
      prev[index].disposalRequested = true;
      return prev;
    });
    setopen(false);
  }

  useEffect(() => {
    if(disposals.length > 0) {
      setLocation(disposals[index].location);
    }
  }, [index, disposals]);

  return (
    <Dialog open={open} onClose={() => setopen(false)}>
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
        <button className='btn btn-sm btn-secondary' onClick={() => setopen(false)}>취소</button>
        <button
          className='btn btn-sm btn-primary'
          onClick={handleClose}
        >
          수거요청
        </button>
      </DialogActions>
    </Dialog>
  )
}