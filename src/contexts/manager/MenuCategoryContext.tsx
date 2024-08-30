import FoodCategory from "@src/models/common/FoodCategory.ts";
import React, {createContext, useEffect, useState} from "react";
import client from "@src/utils/client.ts";

export type MenuCategoryContextProps = [FoodCategory[], React.Dispatch<React.SetStateAction<FoodCategory[]>>];

export const MenuCategoryContext = createContext<MenuCategoryContextProps | null>(null);

const MenuCategoryProvider = ({ children }: { children?: React.ReactNode }) => {
  const [foodCategories, setFoodCategories] = useState<FoodCategory[]>([]);

  useEffect(() => {
    client
      .get('/api/manager/menu/category')
      .then((res) => setFoodCategories(res.data));
  }, []);

  return (
    <MenuCategoryContext.Provider value={[foodCategories, setFoodCategories]}>
      {children}
    </MenuCategoryContext.Provider>
  );
}

export default MenuCategoryProvider;