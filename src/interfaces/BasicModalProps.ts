import {ModalProps} from "@mui/material/Modal";

export default interface BasicModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose?: ModalProps['onClose'];
}