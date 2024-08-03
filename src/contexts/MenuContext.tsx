import React, {createContext, useEffect, useState} from "react";
import Menu from "@src/models/common/Menu.ts";
import client from "@src/utils/client.ts";

type MenuContextProps = [Menu[], React.Dispatch<React.SetStateAction<Menu[]>>];

export const MenuContext = createContext<MenuContextProps | null>(null);

const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    client.get('/api/menu')
      .then((res) => setMenus(res.data))
  }, [])

  return (
    <MenuContext.Provider value={[menus, setMenus]}>
      {children}
    </MenuContext.Provider>
  )
}

export default MenuProvider;