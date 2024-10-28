import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import Select from "@src/components/atoms/Select.tsx";
import {useContext, useEffect, useState} from "react";
import client from "@src/utils/network/client.ts";
import SelectMenu from "@src/components/molecules/SelectMenu.tsx";
import {MenuContext} from "@src/contexts/manager/MenuContext.tsx";
import {CustomerContext} from "@src/contexts/manager/CustomerContext.tsx";
import SelectCustomer from "@src/components/molecules/SelectCustomer.tsx";
import FormControl from "@src/components/atoms/FormControl.tsx";
import {dateToString} from "@src/utils/date.ts";

interface IMenu {
  name: string;
  value: number;
}

const menuSummary: IMenu[] = [
  { name: '전체', value: 1 },
  { name: '메뉴별', value: 2 },
  { name: '거래처별', value: 3 },
];

interface MakeCalculationModalProps extends BasicModalProps {}

export function MakeCalculationModal(props: MakeCalculationModalProps) {

  const [menus, ] = useContext(MenuContext)!;
  const [customers, ] = useContext(CustomerContext)!;

  const [selectedMenu, setSelectedMenu] = useState(-1);
  const [selectedCustomer, setSelectedCustomer] = useState(-1);

  const [type, setType] = useState(1);

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  async function handleClickOnCalculation() {
    if (start !== '' && end !== '') {
      let name: string;
      if (type === 1) {
        name = '정산_전체';
      } else if (type === 2) {
        name = `메뉴별_정산_${menus.find(menu => menu.id === selectedMenu)?.name}`;
      } else {
        name = `고객별_정산_${customers.find(customer => customer.id === selectedCustomer)?.name}`;
      }
      name = name.concat(`_${start}_${end}.xlsx`)

      const response = await client.get(`/api/manager/settings/calculation`, {
        params: {
          type,
          start, end,
          menu: selectedMenu,
          customer: selectedCustomer,
        },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name);
      link.style.cssText = "display:none";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }

  useEffect(() => {
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    setStart(dateToString(yesterday).split(' ').at(0)!);
    setEnd(dateToString(now).split(' ').at(0)!);
  }, []);

  return (
    <Dialog open={props.open}>
      <DialogTitle>
        정산하기
      </DialogTitle>
      <DialogContent>
        <p>정산할 항목을 선택하세요.</p>
        <Select
          value={type}
          onChange={e => setType(parseInt(e.currentTarget.value))}
        >
          {menuSummary.map((category, i) => (
            <option key={i} value={category.value}>{category.name}</option>
          ))}
        </Select>

        <div className='mt-2'>
          <p className='m-0'>시작일</p>
          <FormControl
            type='date'
            value={start}
            onChange={e => setStart(e.target.value)}
          />
        </div>
        <div className='mt-2'>
          <p className='m-0'>종료일</p>
          <FormControl
            type='date'
            value={end}
            onChange={e => setEnd(e.target.value)}
          />
        </div>

        <div className='my-4'/>
        {
          type === 2 && (
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
          type === 3 && (
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