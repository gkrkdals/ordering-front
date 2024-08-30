import FoodCategory from "@src/models/common/FoodCategory.ts";

export default interface Menu {
  id: number;
  name: string;
  category: number;
  menuCategory?: FoodCategory;
}

export const defaultMenu: Menu = {
  id: 0,
  name: '',
  category: 1,
}
