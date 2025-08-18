import MenuCategory from "@src/models/common/MenuCategory.ts";
import {LAST_SEQ} from "@src/utils/data.ts";

export default interface Menu {
  id: number;
  name: string;
  category: number;
  soldOut: number;
  menuCategory?: MenuCategory;
  seq: number;
}

export const defaultMenu: Menu = {
  id: 0,
  name: '',
  category: 1,
  soldOut: 0,
  seq: LAST_SEQ
}
