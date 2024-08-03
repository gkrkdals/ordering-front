import FoodCategory from "@src/models/common/FoodCategory.ts";

export default class Menu {
  id: string;
  name: string;
  foodCategory: FoodCategory;
}