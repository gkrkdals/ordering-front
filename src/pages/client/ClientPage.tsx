import UpperBar from "@src/pages/client/components/organisms/UpperBar.tsx";
import MenuTable from "@src/pages/client/components/organisms/FoodTable.tsx";
import MenuProvider from "@src/contexts/MenuContext.tsx";
import Background from "@src/pages/client/components/atoms/Background.tsx";
import Container from "@src/components/Container.tsx";
import {useState} from "react";
import Menu from "@src/models/common/Menu.ts";
import SelectedMenus from "@src/pages/client/components/organisms/SelectedMenus.tsx";
import OrderButton from "@src/pages/client/components/atoms/OrderButton.tsx";
import CurrentOrderStatus from "@src/pages/client/components/organisms/CurrentOrderStatus.tsx";
import OrderProvider from "@src/contexts/OrderContext.tsx";
import OrderCategoryProvider from "@src/contexts/OrderCategoryContext.tsx";
import SelectedMenu from "@src/models/client/SelectedMenu.ts";

export default function ClientPage() {

  const [selectedMenus, setSelectedMenus] = useState<SelectedMenu[]>([]);

  const handleMenuClick = (menu: Menu) => setSelectedMenus((prev) => prev.concat({ menu, request: '' }));

  return (
    <MenuProvider>
      <Background>
        <UpperBar/>
        <Container>
          <MenuTable onMenuClick={handleMenuClick}/>
          <SelectedMenus selectedmenus={selectedMenus} setselectedmenus={setSelectedMenus} />
          <OrderCategoryProvider>
            <OrderProvider>
              <OrderButton selectedmenus={selectedMenus} setselectedmenus={setSelectedMenus} />
              <CurrentOrderStatus />
            </OrderProvider>
          </OrderCategoryProvider>
        </Container>
      </Background>
    </MenuProvider>
  )
}