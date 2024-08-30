import MenuTable from "@src/pages/manager/components/molecules/MenuTable.tsx";
import Menu from "@src/models/common/Menu.ts";
import Pagination from "@src/pages/manager/components/atoms/Pagination.tsx";
import {useEffect, useState} from "react";
import MenuModal from "@src/pages/manager/modals/MenuModal.tsx";
import SearchData from "@src/pages/manager/components/atoms/SearchData.tsx";
import {PrimaryButton} from "@src/components/atoms/Buttons.tsx";

interface MenuDisplayProps {
  menus: Menu[];
  menucur: number;
  menutotal: number;
  menuprev: () => void;
  menunext: () => void;
  reload: () => void;
  searchdata: string;
  setsearchdata: (searchData: string) => void;
}

export default function MenuDisplay(props: MenuDisplayProps) {
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [open, setOpen] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);

  function handleOpenCreateModal() {
    setIsUpdating(false);
    setOpen(true);
  }

  useEffect(() => {
    if(!isUpdating) {
      setSelectedMenu(null);
    }
  }, [isUpdating]);

  return (
    <>
      <MenuTable
        menus={props.menus}
        page={props.menucur}
        setselectedmenu={setSelectedMenu}
        setisupdating={setIsUpdating}
        setmodalopen={setOpen}
      />
      <div className='d-flex justify-content-between mt-2'>
        <div className='d-flex'>
          <PrimaryButton onClick={handleOpenCreateModal}>메뉴 추가</PrimaryButton>
          <div className='me-3'/>
          <SearchData value={props.searchdata} onChange={e => props.setsearchdata(e.target.value)}/>
        </div>
        <Pagination
          currentpage={props.menucur}
          totalpage={props.menutotal}
          onclickleft={props.menuprev}
          onclickright={props.menunext}
        />
      </div>

      <MenuModal
        isupdating={isUpdating}
        open={open}
        setopen={setOpen}
        currentmenu={selectedMenu}
        reload={props.reload}
      />
    </>
  );
}