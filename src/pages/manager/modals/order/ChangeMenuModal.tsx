import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import FormControl from "@src/components/atoms/FormControl.tsx";
import {useContext, useEffect, useState} from "react";
import client from "@src/utils/network/client.ts";
import {OrderStatusWithNumber} from "@src/pages/manager/components/molecules/OrderTable.tsx";
import SelectMenu from "@src/components/molecules/SelectMenu.tsx";
import {MenuContext} from "@src/contexts/manager/MenuContext.tsx";
import {OrderDetail} from "@src/models/manager/OrderDetail.ts";

interface ChangeMenuModalProps extends BasicModalProps {
  currentOrder: OrderStatusWithNumber | null;
  setCurrentOrder: (newOrder: OrderStatusWithNumber | null) => void;
  setFlag: (flag: boolean) => void;
}

/** 원 단위 가격을 입력창(천원 단위) 문자열로 변환 */
function toThousandUnit(price: number): string {
  return (price / 1000).toString();
}

/** 입력창(천원 단위) 문자열을 원 단위 가격으로 변환. 비어있으면 기존 가격을 유지한다. */
function toWon(value: string, fallback: number): number {
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? fallback : Math.round(parsed * 1000);
}

export default function ChangeMenuModal({ currentOrder, ...props }: ChangeMenuModalProps) {
  const [menus, ] = useContext(MenuContext)!;

  // 수정 전 원본 값 (변경 여부 판단·되돌리기 기준)
  const [original, setOriginal] = useState<OrderDetail | null>(null);

  const [selectedMenu, setSelectedMenu] = useState<number>(-1);
  const [menuName, setMenuName] = useState('');
  const [price, setPrice] = useState('');
  const [request, setRequest] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);

  const nextPrice = toWon(price, original?.price ?? 0);
  const isChanged = original !== null && (
    selectedMenu !== original.menu ||
    request !== original.request ||
    nextPrice !== original.price
  );

  function applyDetail(detail: OrderDetail) {
    setOriginal(detail);
    setSelectedMenu(detail.menu);
    setMenuName(detail.menuName);
    setPrice(toThousandUnit(detail.price));
    setRequest(detail.request);
  }

  function initialize() {
    setTimeout(() => {
      setOriginal(null);
      setSelectedMenu(-1);
      setMenuName('');
      setPrice('');
      setRequest('');
    }, 300);
  }

  function handleClose() {
    props.setOpen(false);
    initialize();
  }

  async function handleChangeMenu() {
    if (!currentOrder || !original) {
      return;
    }

    if (!isChanged) {
      handleClose();
      return;
    }

    try {
      setIsProcessing(true);
      await client.put('/api/manager/order/menu', {
        orderCode: currentOrder.order_code,
        from: original.menu,
        to: selectedMenu,
        price: nextPrice,
        request: request,
      });

      const newMenuName = menus.find(menu => menu.id === selectedMenu)?.name ?? menuName;

      props.setOpen(false);
      initialize();
      props.setCurrentOrder({
        ...currentOrder,
        menu_name: newMenuName,
        menu: selectedMenu,
        price: nextPrice,
        request: request,
      } as OrderStatusWithNumber);
      props.setFlag(true);
    } finally {
      setIsProcessing(false);
    }
  }

  // 모달을 열 때 기존 메뉴·가격·요청사항을 그대로 불러온다.
  // 목록 데이터의 request는 미수 탭에서 memo로 대체되므로 반드시 상세 조회 값을 쓴다.
  useEffect(() => {
    if (!props.open || !currentOrder) {
      return;
    }

    client
      .get('/api/manager/order/detail', { params: { orderCode: currentOrder.order_code } })
      .then(res => applyDetail(res.data))
      .catch(() => applyDetail({
        orderCode: currentOrder.order_code,
        menu: currentOrder.menu,
        menuName: currentOrder.menu_name ?? '',
        price: currentOrder.price ?? 0,
        request: currentOrder.request ?? '',
      }));
  }, [currentOrder?.order_code, props.open]);

  return (
    <Dialog open={props.open}>
      <DialogContent>
        <p>변경 전 메뉴: {original?.menuName ?? currentOrder?.menu_name}</p>
        <p className='mb-1'>변경 후 메뉴</p>
        <SelectMenu
          uniqueId={'changemenumodal'}
          menus={menus}
          setSelectedMenu={setSelectedMenu}
          setPrice={setPrice}
          initialValue={menuName}
        />
        <p/>
        <p className='mb-1'>가격(천원)</p>
        <FormControl
          type='number'
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder='가격 입력'
        />
        <p/>
        <p className='mb-1'>요청사항</p>
        <FormControl
          type='text'
          value={request}
          onChange={e => setRequest(e.target.value)}
          placeholder='빈 요청사항'
        />
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={handleClose} disabled={isProcessing}>
          취소
        </SecondaryButton>
        <PrimaryButton onClick={handleChangeMenu} disabled={isProcessing || original === null}>
          적용
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  )
}
