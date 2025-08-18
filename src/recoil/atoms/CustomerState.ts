import Customer from "@src/models/common/Customer";
import { atom } from "recoil";

const customerState = atom<Customer | null>({
  key: 'customerState',
  default: null
});

export default customerState;
