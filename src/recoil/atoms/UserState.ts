import Customer from "@src/models/common/Customer";
import { atom } from "recoil";

const userState = atom<Customer | null>({
  key: 'userState',
  default: null
});

export default userState;