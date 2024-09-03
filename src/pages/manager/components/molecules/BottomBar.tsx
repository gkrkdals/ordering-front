import AddOrder from "@src/pages/manager/components/atoms/AddOrder.tsx";
import SearchData from "@src/pages/manager/components/atoms/SearchData.tsx";
import Pagination from "@src/pages/manager/components/atoms/Pagination.tsx";
import AddMenu from "@src/pages/manager/components/atoms/AddMenu.tsx";
import AddCustomer from "@src/pages/manager/components/atoms/AddCustomer.tsx";

interface BottomBarProps {
  mode: 'order' | 'menu' | 'customer';
  setOpen?: (open: boolean) => void;
  searchData: string;
  setSearchData: (searchData: string) => void;
  current: number;
  total: number;
  prev: () => void;
  next: () => void;
}

export default function BottomBar(props: BottomBarProps) {

  const open = () => props.setOpen!(true);

  return (
    <div className='d-block d-sm-flex justify-content-between mt-2'>
      <div className='d-flex justify-content-between justify-content-sm-start'>
        {(props.mode === 'order' && props.setOpen) && <AddOrder onClick={open} />}
        {props.mode === 'menu' && <AddMenu onClick={open} />}
        {props.mode === 'customer' && <AddCustomer onClick={open} />}
        <SearchData value={props.searchData} onChange={e => props.setSearchData(e.target.value)}/>
      </div>
      <div className='d-flex d-sm-block justify-content-end justify-content-sm-start'>
        <Pagination
          currentpage={props.current}
          totalpage={props.total}
          onclickleft={props.prev}
          onclickright={props.next}
        />
      </div>
    </div>
  );
}