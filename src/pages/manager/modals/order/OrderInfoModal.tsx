import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogActions, DialogTitle} from "@mui/material";
import {DangerButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {Column, ColumnLeft, ColumnRight} from "@src/components/atoms/Columns.tsx";
import client from "@src/utils/client.ts";
import {OrderStatusWithNumber} from "@src/pages/manager/components/molecules/OrderTable.tsx";
import {formatCurrency, formatFloor} from "@src/utils/data.ts";
import {formatDate} from "@src/utils/date.ts";
import {OrderHistory} from "@src/models/manager/OrderHistory.ts";
import ChangeMenuModal from "@src/pages/manager/modals/order/ChangeMenuModal.tsx";

interface ModifyOrderModalProps extends BasicModalProps {
  modifyingOrder: OrderStatusWithNumber | null;
  reload: () => void;
}

export default function OrderInfoModal(props: ModifyOrderModalProps) {

  const [currentOrder, setCurrentOrder] = useState<OrderStatusWithNumber | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);

  const [openChangeMenuModal, setOpenChangeMenuModal] = useState<boolean>(false);

  const [flag, setFlag] = useState(false);

  function handleClose() {
    props.setOpen(false);
    if (flag) {
      props.reload();
      setFlag(false);
    }
  }

  async function handleDelete() {
    await client.delete(`/api/manager/order/${props.modifyingOrder?.id}`);
    props.setOpen(false);
    props.reload();
  }

  function handleClickOnMenu() {
    setOpenChangeMenuModal(true);
  }

  useEffect(() => {
    setCurrentOrder(props.modifyingOrder);
  }, [props.modifyingOrder]);

  useEffect(() => {
    if(props.open) {
      client
        .get('/api/manager/order/history', { params: { orderCode: props.modifyingOrder?.order_code } })
        .then((res) => setOrderHistory(res.data))
    }
  }, [props.modifyingOrder, props.open]);

  useEffect(() => {
    if (flag) {
      props.reload();
      setFlag(false);
    }
  }, [flag]);

  return (
    <>
      <Dialog open={props.open} onClose={() => console.log("hello")}>
        <DialogTitle>
          주문정보
        </DialogTitle>
        <DialogContent sx={{ width: '310px' }}>
          <div className='py-2'>
            <Column>
              <ColumnLeft>
                순번
              </ColumnLeft>
              <ColumnRight>
                {currentOrder?.num}
              </ColumnRight>
            </Column>
            <Column>
              <ColumnLeft>
                고객명
              </ColumnLeft>
              <ColumnRight>
                {currentOrder?.customer_name}
              </ColumnRight>
            </Column>
            <Column>
              <ColumnLeft>
                메뉴
              </ColumnLeft>
              <ColumnRight>
                <input
                  type="text"
                  className='form-control form-control-sm'
                  value={currentOrder?.menu_name}
                  onClick={handleClickOnMenu}
                  readOnly
                />
              </ColumnRight>
            </Column>
            <Column>
              <ColumnLeft>
                주소
              </ColumnLeft>
              <ColumnRight>
                {currentOrder?.address} {formatFloor(currentOrder?.floor)}
              </ColumnRight>
            </Column>
            <Column>
              <ColumnLeft>
                상세<br/>요청사항
              </ColumnLeft>
              <ColumnRight>
                {currentOrder?.request}
              </ColumnRight>
            </Column>
            <Column>
              <ColumnLeft>
                고객비고
              </ColumnLeft>
              <ColumnRight>
                {currentOrder?.customer_memo}
              </ColumnRight>
            </Column>
            <Column>
              <ColumnLeft>
                잔금
              </ColumnLeft>
              <ColumnRight>
                {formatCurrency(currentOrder?.credit)}
              </ColumnRight>
            </Column>
            <Column align='start'>
              <ColumnLeft>
                주문기록
              </ColumnLeft>
              <ColumnRight>
                {orderHistory.map((history, i) =>
                  <p key={i}>
                    {history.status}
                    <br/>
                    {formatDate(history.time)}
                  </p>
                )}
              </ColumnRight>
            </Column>
          </div>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={handleClose}>
            닫기
          </SecondaryButton>
          <DangerButton onClick={handleDelete}>
            주문취소
          </DangerButton>
        </DialogActions>
      </Dialog>

      <ChangeMenuModal
        open={openChangeMenuModal}
        setOpen={setOpenChangeMenuModal}
        currentOrder={currentOrder}
        setCurrentOrder={setCurrentOrder}
        setFlag={setFlag}
      />
    </>
  )
}