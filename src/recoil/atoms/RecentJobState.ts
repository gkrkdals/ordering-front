import {atom} from "recoil";
import {StatusEnum} from "@src/models/common/StatusEnum.ts";

export interface RecentJobState {
  orderCode: number;
  oldStatus: StatusEnum;
  newStatus: StatusEnum;
}

const recentJobState = atom<RecentJobState[]>({
  key: 'recentJobState',
  default: []
});

export default recentJobState;