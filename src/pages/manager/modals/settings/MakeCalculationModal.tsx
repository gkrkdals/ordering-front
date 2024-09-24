import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import Select from "@src/components/atoms/Select.tsx";
import {useContext, useState} from "react";
import client from "@src/utils/client.ts";
import SelectMenu from "@src/components/molecules/SelectMenu.tsx";
import {MenuContext} from "@src/contexts/manager/MenuContext.tsx";
import {CustomerContext} from "@src/contexts/manager/CustomerContext.tsx";
import SelectCustomer from "@src/components/molecules/SelectCustomer.tsx";

interface IMenu {
  name: string;
  value: number;
}

const menuSummary: IMenu[] = [
  { name: '전체', value: 1 },
  { name: '메뉴별', value: 2 },
  { name: '거래처별', value: 3 },
];

const menuDetail: IMenu[] = [
  { name: '일일 매출', value: 1 },
  { name: '주 매출', value: 2 },
  { name: '월 매출', value: 3 },
];

interface MakeCalculationModalProps extends BasicModalProps {}

export function MakeCalculationModal(props: MakeCalculationModalProps) {

  const [menus, ] = useContext(MenuContext)!;
  const [customers, ] = useContext(CustomerContext)!;

  const [selectedMenu, setSelectedMenu] = useState(-1);
  const [selectedCustomer, setSelectedCustomer] = useState(-1);

  const [big, setBig] = useState(1);
  const [sml, setSml] = useState(1);

  async function handleClickOnCalculation() {
    const response = await client.get(`/api/manager/settings/calculation`, {
      params: {
        big,
        sml,
        menu: selectedMenu,
        customer: selectedCustomer,
      },
      responseType: "blob",
    });
    const name = 'calculation.xlsx';
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name);
    link.style.cssText = "display:none";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>
        정산하기
      </DialogTitle>
      <DialogContent>
        <p>정산할 항목을 선택하세요.</p>
        <Select
          value={big}
          onChange={e => setBig(parseInt(e.currentTarget.value))}
        >
          {menuSummary.map((category, i) => (
            <option key={i} value={category.value}>{category.name}</option>
          ))}
        </Select>
        <div className='my-2'/>
        <Select
          value={sml}
          onChange={e => setSml(parseInt(e.currentTarget.value))}
        >
          {menuDetail.map((category, i) => (
            <option key={i} value={category.value}>{category.name}</option>
          ))}
        </Select>
        <div className='my-4'/>
        {
          big === 2 && (
            <>
              <p className='mb-1'>메뉴 선택</p>
              <SelectMenu
                uniqueId={'calculationmenu'}
                menus={menus}
                setSelectedMenu={setSelectedMenu}
                setPrice={(_) => {
                }}
              />
              <p>선택된 메뉴: {menus.find(menu => menu.id === selectedMenu)?.name}</p>
            </>
          )
        }
        {
          big === 3 && (
            <>
              <SelectCustomer
                uniqueId={'calculationcustomer'}
                customers={customers}
                setSelectedCustomer={setSelectedCustomer}
              />
              <p>선택된 고객: {customers.find(customer => customer.id === selectedCustomer)?.name}</p>
            </>
          )
        }
      </DialogContent>
      <DialogActions>
      <SecondaryButton onClick={() => props.setOpen(false)}>
          닫기
        </SecondaryButton>
        <PrimaryButton onClick={handleClickOnCalculation}>
          정산
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  )
}