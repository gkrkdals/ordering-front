import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogActions, DialogTitle} from "@mui/material";
import {DangerButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {Column, ColumnLeft, ColumnRight} from "@src/components/atoms/Columns.tsx";
import client from "@src/utils/client.ts";
import {OrderStatusWithNumber} from "@src/pages/manager/components/molecules/OrderTable.tsx";
import {formatCurrency, formatFloor} from "@src/utils/data.ts";
import {formatDate} from "@src/utils/date.ts";

interface ModifyOrderModalProps extends BasicModalProps {
  modifyingOrder: OrderStatusWithNumber | null;
  reload: () => void;
}

export default function OrderInfoModal(props: ModifyOrderModalProps) {

  const [currentOrder, setCurrentOrder] = useState<OrderStatusWithNumber | null>(null);

  useEffect(() => {
    setCurrentOrder(props.modifyingOrder);
  }, [props.modifyingOrder]);

  async function handleDelete() {
    await client.delete(`/api/manager/order/${props.modifyingOrder?.id}`);
    props.setOpen(false);
    props.reload();
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>
        주문정보
      </DialogTitle>
      <DialogContent sx={{ width: '350px' }}>
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
              시간
            </ColumnLeft>
            <ColumnRight>
              {formatDate(currentOrder?.time)}
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
              잔금
            </ColumnLeft>
            <ColumnRight>
              {formatCurrency(currentOrder?.credit)}
            </ColumnRight>
          </Column>
        </div>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={() => props.setOpen(false)}>
          닫기
        </SecondaryButton>
        <DangerButton onClick={handleDelete}>
          주문취소
        </DangerButton>
      </DialogActions>
    </Dialog>
  )
}