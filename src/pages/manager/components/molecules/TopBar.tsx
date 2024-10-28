import AddOrder from "@src/pages/manager/components/atoms/AddOrder.tsx";
import SearchData from "@src/pages/manager/components/atoms/SearchData.tsx";
import AddMenu from "@src/pages/manager/components/atoms/AddMenu.tsx";
import AddCustomer from "@src/pages/manager/components/atoms/AddCustomer.tsx";

interface TopBarProps {
  mode: 'order' | 'menu' | 'customer';
  setOpen?: (open: boolean) => void;
  searchData: string;
  setSearchData: (searchData: string) => void;
  current: number;
  total: number;
  prev: () => void;
  next: () => void;
  muted?: boolean;
  setMuted?: (muted: boolean) => void;
  isRemaining?: boolean;
  setIsRemaining?: (isRemaining: boolean) => void;
}

export default function TopBar(props: TopBarProps) {

  const open = () => props.setOpen!(true);

  return (
    <div className='d-block d-sm-flex justify-content-between mb-2'>
      <div className='d-flex justify-content-between justify-content-sm-start'>
        {(props.mode === 'order' && props.setOpen) && <AddOrder onClick={open} muted={props.muted} setMuted={props.setMuted} isRemaining={props.isRemaining} setIsRemaining={props.setIsRemaining} />}
        {props.mode === 'menu' && <AddMenu onClick={open} />}
        {props.mode === 'customer' && <AddCustomer onClick={open} />}
        <SearchData value={props.searchData} onChange={e => props.setSearchData(e.target.value)}/>
      </div>
    </div>
  );
}