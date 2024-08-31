import MenuCategory from "@src/models/common/MenuCategory.ts";
import React, {createContext, useEffect, useState} from "react";
import client from "@src/utils/client.ts";

export type MenuCategoryContextProps = [MenuCategory[], React.Dispatch<React.SetStateAction<MenuCategory[]>>];

export const MenuCategoryContext = createContext<MenuCategoryContextProps | null>(null);

const MenuCategoryProvider = ({ children }: { children?: React.ReactNode }) => {
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);

  useEffect(() => {
    client
      .get('/api/manager/menu/category')
      .then((res) => setMenuCategories(res.data));
  }, []);

  return (
    <MenuCategoryContext.Provider value={[menuCategories, setMenuCategories]}>
      {children}
    </MenuCategoryContext.Provider>
  );
}

export default MenuCategoryProvider;