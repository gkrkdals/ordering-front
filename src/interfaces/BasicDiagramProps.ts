import {ModalProps} from "@mui/material/Modal";

export default interface BasicDiagramProps {
  open: boolean;
  setOpen?: (open: boolean) => void;
  onClose?: ModalProps['onClose'];
}