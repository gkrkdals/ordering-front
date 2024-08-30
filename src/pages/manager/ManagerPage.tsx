import Container from "@src/components/Container.tsx";
import {useEffect, useState} from "react";
import Tab from "@src/pages/manager/components/atoms/Tab.tsx";
import useTable from "@src/hooks/UseTable.tsx";
import Menu from "@src/models/common/Menu.ts";
import Customer from "@src/models/common/Customer.ts";
import MenuCategoryProvider from "@src/contexts/manager/MenuCategoryContext.tsx";
import OrderDisplay from "@src/pages/manager/components/organisms/OrderDisplay.tsx";
import MenuDisplay from "@src/pages/manager/components/organisms/MenuDisplay.tsx";
import CustomerDisplay from "@src/pages/manager/components/organisms/CustomerDisplay.tsx";
import OrderCategoryProvider from "@src/contexts/common/OrderCategoryContext.tsx";
import {OrderStatusRaw} from "@src/models/common/OrderStatusRaw.ts";
import client from "@src/utils/client.ts";

export default function ManagerPage() {
  const [whichMenu, setWhichMenu] = useState<string>('order');

  const [wholeMenus, setWholeMenus] = useState<Menu[]>([]);
  const [wholeCustomers, setWholeCustomers] = useState<Customer[]>([]);

  const [
    orderStatus,
    orderStatusCur,
    orderStatusTotal,
    orderStatusPrev,
    orderStatusNext,
    setCurrentPageOrderStatus,
    reloadOrderStatus,
    searchDataOrder,
    setSearchDataOrder,
  ] = useTable<OrderStatusRaw>('/api/manager/order');

  const [
    menu,
    menuCur,
    menuTotal,
    menuPrev,
    menuNext,
    setCurrentPageMenus,
    reloadMenu,
    searchDataMenu,
    setSearchDataMenu,
  ] = useTable<Menu>('/api/manager/menu');

  const [
    customer,
    customerCur,
    customertotal,
    customerPrev,
    customerNext,
    _,
    reloadCustomer,
    searchDataCustomer,
    setSearchDataCustomer
  ] = useTable<Customer>('/api/manager/customer');

  function renderSwitch(whichMenu: string) {
    switch(whichMenu) {
      case "order":
        return <OrderDisplay
          customer={wholeCustomers}
          menus={wholeMenus}
          orderstatus={orderStatus}
          orderstatuscur={orderStatusCur}
          orderstatustotal={orderStatusTotal}
          onclickleft={orderStatusPrev}
          onclickright={orderStatusNext}
          reload={reloadOrderStatus}
          searchdata={searchDataOrder}
          setsearchdata={setSearchDataOrder}
        />;

      case "menu":
        return <MenuDisplay
          menus={menu}
          menucur={menuCur}
          menutotal={menuTotal}
          menuprev={menuPrev}
          menunext={menuNext}
          reload={reloadMenu}
          searchdata={searchDataMenu}
          setsearchdata={setSearchDataMenu}
        />;

      case "customer":
        return <CustomerDisplay
          customers={customer}
          customercur={customerCur}
          customertotal={customertotal}
          customerprev={customerPrev}
          customernext={customerNext}
          reload={reloadCustomer}
          searchdata={searchDataCustomer}
          setsearchdata={setSearchDataCustomer}
        />;
    }
  }

  useEffect(() => {
    client
      .get('/api/manager/customer/all')
      .then(res => setWholeCustomers(res.data));
    client
      .get('/api/manager/menu/all')
      .then(res => setWholeMenus(res.data));
  }, []);

  useEffect(() => {
    if(whichMenu === 'order') {
      setCurrentPageMenus(1);
    } else {
      setCurrentPageOrderStatus(1);
    }
  }, [whichMenu]);

  return (
    <MenuCategoryProvider>
      <OrderCategoryProvider>
        <Container>
          <div className="mt-2" />
          <Tab setmenu={setWhichMenu} menu={whichMenu} />
          <p className='text-secondary' style={{ fontSize: '10pt'}}>각 항목을 클릭하여 항목을 수정할 수 있습니다.</p>
          {renderSwitch(whichMenu)}
          <div className='mb-4' />
        </Container>
      </OrderCategoryProvider>
    </MenuCategoryProvider>
  );
}