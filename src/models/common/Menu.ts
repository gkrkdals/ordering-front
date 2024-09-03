import MenuCategory from "@src/models/common/MenuCategory.ts";

export default interface Menu {
  id: number;
  name: string;
  category: number;
  soldOut: number;
  menuCategory?: MenuCategory;
}

export const defaultMenu: Menu = {
  id: 0,
  name: '',
  category: 1,
  soldOut: 0,
}
