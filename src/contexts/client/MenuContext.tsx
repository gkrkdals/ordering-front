import React, {createContext, useEffect, useState} from "react";
import Menu from "@src/models/common/Menu.ts";
import client from "@src/utils/client.ts";
import { useRecoilValue } from "recoil";
import customerState from "@src/recoil/atoms/CustomerState.ts";

export type MenuContextProps = [Menu[], React.Dispatch<React.SetStateAction<Menu[]>>];

export const MenuContext = createContext<MenuContextProps | null>(null);

const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const customer = useRecoilValue(customerState);

  useEffect(() => {
    if(customer) {
      client.get('/api/menu')
        .then((res) => setMenus(res.data))
    }
  }, [customer]);

  return (
    <MenuContext.Provider value={[menus, setMenus]}>
      {children}
    </MenuContext.Provider>
  )
}

export default MenuProvider;