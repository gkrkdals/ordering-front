import Customer from "@src/models/common/Customer.ts";
import CustomerTable from "@src/pages/manager/components/molecules/CustomerTable.tsx";
import Pagination from "@src/pages/manager/components/atoms/Pagination.tsx";
import {PrimaryButton} from "@src/components/atoms/Buttons.tsx";
import {useState} from "react";
import MakeCustomerModal from "@src/pages/manager/modals/MakeCustomerModal.tsx";
import SearchData from "@src/pages/manager/components/atoms/SearchData.tsx";

interface CustomerDisplayProps {
  customers: Customer[];
  customercur: number;
  customertotal: number;
  customerprev: () => void;
  customernext: () => void;
  reload: () => void;
  searchdata: string;
  setsearchdata: (searchData: string) => void;
}

export default function CustomerDisplay(props: CustomerDisplayProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CustomerTable
        customers={props.customers}
        page={props.customercur}
        reload={props.reload}
      />
      <div className='d-flex justify-content-between mt-2'>
        <div className='d-flex'>
          <PrimaryButton onClick={() => setOpen(true)}>고객 생성</PrimaryButton>
          <div className='me-3' />
          <SearchData value={props.searchdata} onChange={e => props.setsearchdata(e.target.value)} />
        </div>
        <Pagination
          currentpage={props.customercur}
          totalpage={props.customertotal}
          onclickleft={props.customerprev}
          onclickright={props.customernext}
        />
      </div>

      <MakeCustomerModal reload={props.reload} open={open} setopen={setOpen} />
    </>
  );
}