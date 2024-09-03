import Container from "@src/components/Container.tsx";
import {useState} from "react";
import Tab from "@src/pages/manager/components/atoms/Tab.tsx";
import MenuCategoryProvider from "@src/contexts/manager/MenuCategoryContext.tsx";
import OrderDisplay from "@src/pages/manager/components/organisms/OrderDisplay.tsx";
import MenuDisplay from "@src/pages/manager/components/organisms/MenuDisplay.tsx";
import CustomerDisplay from "@src/pages/manager/components/organisms/CustomerDisplay.tsx";
import OrderCategoryProvider from "@src/contexts/common/OrderCategoryContext.tsx";
import CustomerCategoryProvider from "@src/contexts/manager/CustomerCategoryContext.tsx";

export default function ManagerPage() {
  const [whichMenu, setWhichMenu] = useState<string>('order');

  function renderSwitch(whichMenu: string) {
    switch(whichMenu) {
      case "order":
        return <OrderDisplay />;

      case "menu":
        return <MenuDisplay />;

      case "customer":
        return <CustomerDisplay />;
    }
  }

  return (
    <MenuCategoryProvider>
      <OrderCategoryProvider>
        <CustomerCategoryProvider>
          <Container>
            <div className="mt-2" />
            <Tab setmenu={setWhichMenu} menu={whichMenu}/>
            <div className="mt-2"/>
            {/*<p className='text-secondary' style={{fontSize: '10pt'}}>각 항목을 클릭하여 항목을 수정할 수 있습니다.</p>*/}
            {renderSwitch(whichMenu)}
            <div className='mb-4'/>
          </Container>
        </CustomerCategoryProvider>
      </OrderCategoryProvider>
    </MenuCategoryProvider>
  );
}