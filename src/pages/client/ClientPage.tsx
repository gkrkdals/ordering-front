import UpperBar from "@src/pages/client/components/organisms/UpperBar.tsx";
import MenuTable from "@src/pages/client/components/organisms/FoodTable.tsx";
import MenuProvider from "@src/contexts/client/MenuContext.tsx";
import Background from "@src/pages/client/components/atoms/Background.tsx";
import Container from "@src/components/Container.tsx";
import {useLayoutEffect, useState} from "react";
import Menu, {defaultMenu} from "@src/models/common/Menu.ts";
import SelectedMenus from "@src/pages/client/components/organisms/SelectedMenus.tsx";
import OrderButton from "@src/pages/client/components/atoms/OrderButton.tsx";
import CurrentOrderStatus from "@src/pages/client/components/organisms/CurrentOrderStatus.tsx";
import OrderCategoryProvider from "@src/contexts/common/OrderCategoryContext.tsx";
import SelectedMenu from "@src/models/client/SelectedMenu.ts";
import { useSearchParams } from "react-router-dom";
import client from "@src/utils/client";
import { useRecoilState } from "recoil";
import userState from "@src/recoil/atoms/UserState";
import OrderSummaryProvider from "@src/contexts/client/OrderSummary.tsx";
import CustomMenu from "@src/pages/client/components/molecules/CustomMenu.tsx";

export default function ClientPage() {

  const [searchParams] = useSearchParams();
  const [selectedMenus, setSelectedMenus] = useState<SelectedMenu[]>([]);
  const [, setUserState] = useRecoilState(userState);

  const [customMenu, setCustomMenu] = useState('');

  const handleMenuClick = (menu: Menu) => setSelectedMenus((prev) => prev.concat({ menu, request: '' }));

  function handleClickOnCustom() {
    const p = defaultMenu;
    p.name = customMenu;
    p.category = 4;
    setSelectedMenus((prev) => prev.concat({ menu: p, request: '' }))
  }

  useLayoutEffect(() => {
    const id = searchParams.get('id');
    if(id) {
      client.post(`/api/auth/signin`, { id })
        .then((res) => setUserState(res.data));
    }
  }, []);

  return (
    <MenuProvider>
      <Background>
        <UpperBar/>
        <Container>
          <MenuTable onMenuClick={handleMenuClick}/>
          <CustomMenu onClick={handleClickOnCustom} customMenuName={customMenu} setCustomMenuName={setCustomMenu} />
          <SelectedMenus selectedmenus={selectedMenus} setselectedmenus={setSelectedMenus} />
          <OrderCategoryProvider>
            <OrderSummaryProvider>
              <OrderButton selectedmenus={selectedMenus} setselectedmenus={setSelectedMenus} />
              <CurrentOrderStatus />
            </OrderSummaryProvider>
          </OrderCategoryProvider>
        </Container>
      </Background>
    </MenuProvider>
  );
}