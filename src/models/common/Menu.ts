import MenuCategory from "@src/models/common/MenuCategory.ts";

export default interface Menu {
  id: number;
  name: string;
  category: number;
  menuCategory?: MenuCategory;
}

export const defaultMenu: Menu = {
  id: 0,
  name: '',
  category: 1,
}
