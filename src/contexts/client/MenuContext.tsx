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

  function reload() {
    client
      .get('/api/menu')
      .then((res) => setMenus(res.data));
  }

  useEffect(() => {
    if(customer) {
      reload();
    }
  }, [customer]);

  useEffect(() => {
    window.addEventListener("reload", reload);

    window.addEventListener("beforeunload", () => {
      window.removeEventListener("reload", reload);
    });

    return () => {
      window.removeEventListener("reload", reload);
    }
  }, []);

  return (
    <MenuContext.Provider value={[menus, setMenus]}>
      {children}
    </MenuContext.Provider>
  )
}

export default MenuProvider;