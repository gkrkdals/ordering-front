import React, {createContext, useEffect, useState} from "react";
import Menu from "@src/models/common/Menu.ts";
import client from "@src/utils/client.ts";
import { useRecoilValue } from "recoil";
import userState from "@src/recoil/atoms/UserState.ts";

export type MenuContextProps = [Menu[], React.Dispatch<React.SetStateAction<Menu[]>>];

export const MenuContext = createContext<MenuContextProps | null>(null);

const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const user = useRecoilValue(userState);

  useEffect(() => {
    if(user) {
      client.get('/api/menu')
        .then((res) => setMenus(res.data))
    }
  }, [user])

  return (
    <MenuContext.Provider value={[menus, setMenus]}>
      {children}
    </MenuContext.Provider>
  )
}

export default MenuProvider;