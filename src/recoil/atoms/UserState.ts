import {atom} from "recoil";
import User from "@src/models/manager/User.ts";

const userState = atom<User | null>({
  key: 'userState',
  default: null
});

export default userState;