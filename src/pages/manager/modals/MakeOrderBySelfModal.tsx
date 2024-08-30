import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {useEffect, useState} from "react";
import Menu, {defaultMenu} from "@src/models/common/Menu.ts";
import Customer from "@src/models/common/Customer.ts";
import client from "@src/utils/client.ts";
import InputWithSuggestions from "@src/components/atoms/InputWithSuggestions.tsx";
import {MenuCategoryEnum} from "@src/models/common/MenuCategoryEnum.ts";

interface MakeOrderBySelfModalProps extends BasicModalProps {
  customers: Customer[];
  menus: Menu[];
  setopen: (open: boolean) => void;
  reload: () => void;
}

export default function MakeOrderBySelfModal({open, reload, setopen, customers, menus}: MakeOrderBySelfModalProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const [searchCustomer, setSearchCustomer] = useState<string>('');
  const [searchMenu, setSearchMenu] = useState<string>('');

  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [showMenuSuggestions, setShowMenuSuggestions] = useState(false);

  const [customMenuName, setCustomMenuName] = useState('');
  const [radioChoice, setRadioChoice] = useState(1);

  const [confirm, setConfirm] = useState<boolean>(false);

  function initialize() {
    setSelectedCustomer(null);
    setSelectedMenu(null);
    setSearchCustomer('');
    setSearchMenu('');
  }

  function handleCancel() {
    setopen(false);
    initialize();
  }

  async function handleOrderNew() {
    await client.post('/api/manager/order', {
      menu: selectedMenu,
      customer: selectedCustomer,
    });
    setopen(false);
    setConfirm(false);
    initialize();
    reload();
  }

  function handleClickCustomerSuggestions(option: Customer) {
    setSelectedCustomer(option);
    setSearchCustomer(option.name);
  }

  function handleClickMenuSuggestions(option: Menu) {
    setSelectedMenu(option);
    setSearchMenu(option.name);
  }

  useEffect(() => {
    setShowCustomerSuggestions(searchCustomer.length !== 0 && searchCustomer !== selectedCustomer?.name)
  }, [searchCustomer, selectedCustomer]);

  useEffect(() => {
    setShowMenuSuggestions(searchMenu.length !== 0 && searchMenu !== selectedMenu?.name)
  }, [searchMenu, selectedMenu]);

  useEffect(() => {
    if (radioChoice === 2) {
      setSearchMenu('');
    } else {
      setCustomMenuName('');
    }
  }, [radioChoice]);

  return (
    <>
      <Dialog open={open} onClose={() => {
        setopen(false);
        initialize();
      }}>
        <DialogContent>
          <div className='card px-3 py-2 mb-3 d-grid'>
            <p>거래처 입력</p>
            <InputWithSuggestions
              inputValue={searchCustomer}
              filteredOptions={customers.filter(customer => customer.name.toLowerCase().includes(searchCustomer.toLowerCase()))}
              onInputChange={e => setSearchCustomer(e.target.value)}
              onOptionClick={handleClickCustomerSuggestions}
              showSuggestions={showCustomerSuggestions}
              placeholder='거래처 검색'
            />
            <hr/>

            <div className='mb-3'>
              <div className='d-flex'>
                <input type="radio" id='orthodox' className='me-2' value={1} checked={radioChoice === 1}
                       onChange={() => setRadioChoice(1)}/>
                <label htmlFor="orthodox">일반 메뉴 선택</label>
              </div>
              <div className='d-flex justify-content-between mb-2'>
                <InputWithSuggestions
                  inputValue={searchMenu}
                  filteredOptions={menus.filter(menu => menu.name.toLowerCase().includes(searchMenu.toLowerCase()))}
                  onInputChange={e => setSearchMenu(e.target.value)}
                  onOptionClick={handleClickMenuSuggestions}
                  showSuggestions={showMenuSuggestions}
                  placeholder='메뉴 검색'
                  disabled={radioChoice !== 1}
                />
              </div>
              <div>
                <input
                  type="radio"
                  id='custom'
                  className='me-2'
                  value={2}
                  checked={radioChoice === 2}
                  onChange={() => setRadioChoice(2)}
                />
                <label htmlFor="custom">추가 메뉴 선택</label>
              </div>
              <div className='d-flex justify-content-between'>
                <input
                  type="text"
                  className='form-control me-2'
                  placeholder='추가 메뉴 입력'
                  disabled={radioChoice !== 2}
                  value={customMenuName}
                  onChange={e => setCustomMenuName(e.target.value)}
                />
                <button
                  className='btn btn-primary'
                  onClick={() => {
                    if (selectedCustomer && customMenuName.length > 0) {
                      const customMenu = defaultMenu;
                      customMenu.name = customMenuName
                      customMenu.category = MenuCategoryEnum.Custom;
                      setSelectedMenu(customMenu);
                    }
                  }}
                  style={{ width: 80 }}
                >
                  선택
                </button>
              </div>
            </div>
          </div>
          <p className='text-secondary'>선택된 거래처: {selectedCustomer?.name}</p>
          <p className='text-secondary'>선택된 메뉴: {selectedMenu?.name}</p>
        </DialogContent>
        <DialogActions>
          <button className='btn btn-secondary' onClick={handleCancel}>취소</button>
          <button className='btn btn-primary' onClick={() => setConfirm(true)}>주문</button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirm}>
        <DialogContent>
          주문하시겠습니까?
        </DialogContent>
        <DialogActions>
          <button className='btn btn-secondary' onClick={() => setConfirm(false)}>아니오</button>
          <button className='btn btn-primary' onClick={handleOrderNew}>예</button>
        </DialogActions>
      </Dialog>
    </>
  );
}