import UpperBar from "@src/pages/client/components/organisms/UpperBar.tsx";
import MenuTable from "@src/pages/client/components/organisms/FoodTable.tsx";
import MenuProvider from "@src/contexts/client/MenuContext.tsx";
import Background from "@src/pages/client/components/atoms/Background.tsx";
import Container from "@src/components/Container.tsx";
import {useLayoutEffect, useState} from "react";
import Menu from "@src/models/common/Menu.ts";
import SelectedMenus from "@src/pages/client/components/organisms/SelectedMenus.tsx";
import OrderButton from "@src/pages/client/components/atoms/OrderButton.tsx";
import CurrentOrderStatus from "@src/pages/client/components/organisms/CurrentOrderStatus.tsx";
import OrderCategoryProvider from "@src/contexts/common/OrderCategoryContext.tsx";
import SelectedMenu from "@src/models/client/SelectedMenu.ts";
import { useSearchParams } from "react-router-dom";
import client from "@src/utils/client";
import { useRecoilState } from "recoil";
import customerState from "@src/recoil/atoms/CustomerState.ts";
import OrderSummaryProvider from "@src/contexts/client/OrderSummaryContext.tsx";

export default function ClientPage() {

  const [searchParams] = useSearchParams();
  const [selectedMenus, setSelectedMenus] = useState<SelectedMenu[]>([]);
  const [, setUserState] = useRecoilState(customerState);
  const handleMenuClick = (menu: Menu) => {
    if (menu.soldOut !== 1) {
      setSelectedMenus((prev) => prev.concat({ menu, request: '' }));
    }
  };

  useLayoutEffect(() => {
    const id = searchParams.get('id');
    if(id) {
      client
        .post(`/api/auth/signin`, { id })
        .then((res) => setUserState(res.data));
    }
  }, []);

  return (
    <MenuProvider>
      <Background>
        <UpperBar/>
        <Container>
          <MenuTable onMenuClick={handleMenuClick}/>
          <SelectedMenus selectedMenus={selectedMenus} setSelectedMenus={setSelectedMenus} />
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