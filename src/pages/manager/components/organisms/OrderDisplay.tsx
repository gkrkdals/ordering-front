import OrderTable from "@src/pages/manager/components/molecules/OrderTable.tsx";
import Pagination from "@src/pages/manager/components/atoms/Pagination.tsx";
import SearchData from "@src/pages/manager/components/atoms/SearchData.tsx";
import {PrimaryButton} from "@src/components/atoms/Buttons.tsx";
import {OrderStatusRaw} from "@src/models/manager/OrderStatusRaw.ts";
import MakeOrderBySelfModal from "@src/pages/manager/modals/MakeOrderBySelfModal.tsx";
import {useState} from "react";
import Customer from "@src/models/common/Customer.ts";
import Menu from "@src/models/common/Menu.ts";

interface OrderDisplayProps {
  customer: Customer[];
  menus: Menu[];
  orderstatus: OrderStatusRaw[];
  orderstatuscur: number;
  orderstatustotal: number;
  onclickleft: () => void;
  onclickright: () => void;
  reload: () => void;
  searchdata: string;
  setsearchdata: (searchdata: string) => void;
}

export default function OrderDisplay(props: OrderDisplayProps) {

  const [open, setOpen] = useState(false);

  return (
    <>
      <OrderTable
        orderstatus={props.orderstatus}
        page={props.orderstatuscur}
        reload={props.reload}
      />
      <div className='d-flex justify-content-between mt-2'>
        <div className='d-flex'>
          <PrimaryButton onClick={() => setOpen(true)}>
            직접주문
          </PrimaryButton>
          <div className='me-3'/>
          <SearchData value={props.searchdata} onChange={e => props.setsearchdata(e.target.value)}/>
        </div>
        <Pagination
          currentpage={props.orderstatuscur}
          totalpage={props.orderstatustotal}
          onclickleft={props.onclickleft}
          onclickright={props.onclickright}
        />
      </div>

      <MakeOrderBySelfModal
        open={open}
        onclose={() => setOpen(false)}
        customers={props.customer}
        menus={props.menus}
        setopen={setOpen}
        reload={props.reload}
      />
    </>
  );
}
