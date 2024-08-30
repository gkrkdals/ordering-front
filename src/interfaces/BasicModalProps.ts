import {ModalProps} from "@mui/material/Modal";

export default interface BasicModalProps {
  open: boolean;
  setopen: (open: boolean) => void;
  onclose?: ModalProps['onClose'];
}