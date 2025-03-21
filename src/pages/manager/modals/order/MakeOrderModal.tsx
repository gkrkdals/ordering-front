import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import Menu from "@src/models/common/Menu.ts";
import Customer from "@src/models/common/Customer.ts";
import client from "@src/utils/network/client.ts";
import {MenuContext} from "@src/contexts/manager/MenuContext.tsx";
import FormControl from "@src/components/atoms/FormControl.tsx";

interface MakeOrderModal extends BasicModalProps {}

export default function MakeOrderModal({open, setOpen}: MakeOrderModal) {
  const [menus, ] = useContext(MenuContext)!;
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const [searchCustomer, setSearchCustomer] = useState<string>('');
  const [searchMenu, setSearchMenu] = useState<string>('');

  const [request, setRequest] = useState('')

  const [confirm, setConfirm] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  function initialize() {
    setSelectedCustomer(null);
    setSelectedMenu(null);
    setSearchCustomer('');
    setSearchMenu('');
    setRequest('');
  }

  function handleCancel() {
    setOpen(false);
    initialize();
  }

  async function handleOrderNew() {
    try {
      setIsProcessing(true);
      await client.post('/api/manager/order', {
        menu: selectedMenu,
        customer: selectedCustomer,
        request,
      });
      setOpen(false);
      setConfirm(false);
      initialize();
    } finally {
      setIsProcessing(false);
    }
  }

  useEffect(() => {
    setSelectedCustomer(customers.find(c => c.name === searchCustomer) ?? null);
  }, [searchCustomer]);

  useEffect(() => {
    setSelectedMenu(menus.find(m => m.name === searchMenu) ?? null);
  }, [searchMenu]);

  useEffect(() => {
    if (open) {
      client
        .get('/api/manager/customer/all')
        .then((res) => setCustomers(res.data));
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onClose={() => {
        setOpen(false);
        initialize();
      }}>
        <DialogContent>
          <div className='card px-3 py-2 mb-3 d-grid'>
            <p>고객 입력</p>
            <input
              type="text"
              className='form-control'
              list='customers'
              value={searchCustomer}
              onChange={e => setSearchCustomer(e.target.value)}
              placeholder='고객 검색'
            />
            <datalist id='customers'>
              {customers.map((item, i) => (
                <option key={i} value={item.name}>{item.tel}</option>
              ))}
            </datalist>
            <hr/>
            <p>메뉴 선택</p>
            <input
              type="text"
              className='form-control'
              list='menus'
              value={searchMenu}
              onChange={e => {
                console.log("asdfsadf")
                setSearchMenu(e.target.value);
              }}
              onInput={() => console.log('fdsafdsa')}
              placeholder='메뉴 검색'
            />
            <datalist id='menus'>
              {menus.map((item, i) => (
                <option key={i} value={item.name}>{item.name}</option>
              ))}
            </datalist>
          </div>
          <p className='text-secondary mb-1'>선택된 고객: {selectedCustomer?.name}</p>
          <p className='text-secondary'>선택된 메뉴: {selectedMenu?.name}</p>
          <p className='mb-2'>요청사항 입력</p>
          <FormControl
            value={request}
            onChange={e => setRequest(e.target.value)}
            placeholder='요청사항 입력'
          />
        </DialogContent>
        <DialogActions>
          <button className='btn btn-secondary w-50' style={{ fontSize: 19 }} onClick={handleCancel}>취소</button>
          <button className='btn btn-primary w-50' style={{ fontSize: 19 }} onClick={() => setConfirm(true)}>주문</button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirm}>
        <DialogContent>
          주문하시겠습니까?
        </DialogContent>
        <DialogActions>
          <button className='btn btn-secondary' onClick={() => setConfirm(false)} disabled={isProcessing}>아니오</button>
          <button className='btn btn-primary' onClick={handleOrderNew} disabled={isProcessing}>
            {isProcessing ? '주문 중' : '예'}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}