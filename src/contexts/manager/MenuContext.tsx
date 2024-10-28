import Menu from "@src/models/common/Menu.ts";
import React, {createContext, ReactNode, useEffect, useState} from "react";
import client from "@src/utils/network/client.ts";

export type MenuContextProps = [Menu[], React.Dispatch<React.SetStateAction<Menu[]>>];

export const MenuContext = createContext<MenuContextProps | null>(null);

const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    client
      .get('/api/manager/menu/all')
      .then((res) => setMenus(res.data));
  }, []);

  return (
    <MenuContext.Provider value={[menus, setMenus]}>
      {children}
    </MenuContext.Provider>
  )
};

export default MenuProvider;