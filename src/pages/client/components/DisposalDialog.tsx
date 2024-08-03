import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {Disposal} from "@src/pages/client/components/molecules/DishCollection.tsx";
import React, {useEffect, useState} from "react";
import BasicDialogProps from "@src/interfaces/BasicDiagramProps.ts";

interface DisposalDialogProps extends BasicDialogProps {
  disp: Disposal[];
  setDisp: React.Dispatch<React.SetStateAction<Disposal[]>>;
  index: number;
}

export default function DisposalDialog({ open, setOpen, disp, setDisp, index }: DisposalDialogProps) {

  const [location, setLocation] = useState<string>('');

  function handleClose() {
    setDisp((prev) => {
      prev[index].location = location;
      prev[index].disposalRequested = true;
      return prev;
    });
    setOpen(false);
  }

  useEffect(() => {
    setLocation(disp[index].location);
  }, [index]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogContent>
        <h6>그릇 위치 입력</h6>
        <input
          type="text"
          className='form-control'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <button className='btn btn-sm btn-secondary' onClick={() => setOpen(false)}>취소</button>
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