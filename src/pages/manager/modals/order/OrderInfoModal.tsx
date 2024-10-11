import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogActions, DialogTitle} from "@mui/material";
import {DangerButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {Column, SmallColumn, BigColumn} from "@src/components/atoms/Columns.tsx";
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
  const [openConfirmCancelModal, setOpenConfirmCancelModal] = useState<boolean>(false);

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
    setOpenConfirmCancelModal(false);
    props.setOpen(false);
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
      <Dialog open={props.open}>
        <DialogTitle>
          주문정보
        </DialogTitle>
        <DialogContent sx={{ width: '310px' }}>
          <div className='py-2'>
            <Column>
              <SmallColumn>
                순번
              </SmallColumn>
              <BigColumn>
                {currentOrder?.num}
              </BigColumn>
            </Column>
            <Column>
              <SmallColumn>
                고객명
              </SmallColumn>
              <BigColumn>
                {currentOrder?.customer_name}
              </BigColumn>
            </Column>
            <Column>
              <SmallColumn>
                메뉴
              </SmallColumn>
              <BigColumn>
                <input
                  type="text"
                  className='form-control form-control-sm'
                  value={currentOrder?.menu_name}
                  onClick={handleClickOnMenu}
                  readOnly
                />
              </BigColumn>
            </Column>
            <Column>
              <SmallColumn>
                주소
              </SmallColumn>
              <BigColumn>
                {currentOrder?.address} {formatFloor(currentOrder?.floor)}
              </BigColumn>
            </Column>
            <Column>
              <SmallColumn>
                상세<br/>요청사항
              </SmallColumn>
              <BigColumn>
                {currentOrder?.request}
              </BigColumn>
            </Column>
            <Column>
              <SmallColumn>
                고객비고
              </SmallColumn>
              <BigColumn>
                {currentOrder?.customer_memo}
              </BigColumn>
            </Column>
            {
              currentOrder?.location &&
              <Column>
                <SmallColumn>
                  그릇위치
                </SmallColumn>
                <BigColumn>
                  {currentOrder?.location}
                </BigColumn>
              </Column>
            }
            <Column>
              <SmallColumn>
                잔금
              </SmallColumn>
              <BigColumn>
                {formatCurrency(currentOrder?.credit)}
              </BigColumn>
            </Column>
            <Column align='start'>
              <SmallColumn>
                주문기록
              </SmallColumn>
              <BigColumn>
                {orderHistory.map((history, i) =>
                  <p key={i}>
                    {history.status}
                    <br/>
                    {formatDate(history.time)}
                  </p>
                )}
              </BigColumn>
            </Column>
          </div>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={handleClose}>
            닫기
          </SecondaryButton>
          <DangerButton onClick={() => setOpenConfirmCancelModal(true)}>
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

      <Dialog open={openConfirmCancelModal}>
        <DialogContent>
          주문을 삭제하시겠습니까?
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => setOpenConfirmCancelModal(false)}>
            취소
          </SecondaryButton>
          <DangerButton onClick={handleDelete}>
            삭제
          </DangerButton>
        </DialogActions>
      </Dialog>
    </>
  )
}