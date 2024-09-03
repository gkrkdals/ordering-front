import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {useContext, useEffect, useState} from "react";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {OrderCategoryContext} from "@src/contexts/common/OrderCategoryContext.tsx";
import client from "@src/utils/client.ts";
import {StatusEnum} from "@src/models/common/StatusEnum.ts";
import EnterCustomAmount from "@src/pages/manager/components/molecules/EnterCustomOrderAmount.tsx";
import EnterAmount from "@src/pages/manager/components/molecules/EnterAmount.tsx";

interface ClickToGoNextProps extends BasicModalProps {
  menu: number | undefined;
  orderstatusid: number | undefined;
  currentstatus: number | undefined;
  reload: () => void;
}

export default function ClickToGoNextModal(props: ClickToGoNextProps) {
  const [orderStatusId, setOrderStatusId] = useState<number>(0);
  const [currentStatus, setCurrentStatus] = useState<number>(0);

  const [paidAmount, setPaidAmount] = useState<string>('');
  const [menuName, setMenuName] = useState<string>('');
  const [radioValue, setRadioValue] = useState(1);
  const [orderCategories, ] = useContext(OrderCategoryContext)!;

  function initialize() {
    setPaidAmount('');
    setRadioValue(1);
    props.setOpen(false);
  }

  async function handleChangeStatus() {
    await client.put('/api/manager/order', {
      orderId: orderStatusId,
      newStatus: currentStatus + 1,
      paidAmount: parseInt(paidAmount),
      postpaid: radioValue === 2,
      menu: props.menu,
      menuName,
    });
    props.setOpen(false);
    props.reload();
  }

  useEffect(() => {
    setOrderStatusId(props.orderstatusid ?? 0);
    setCurrentStatus(props.currentstatus ?? 0);
  }, [props.orderstatusid, props.currentstatus]);

  return (
    <Dialog open={props.open}>
      <DialogContent>
        {
          props.currentstatus === StatusEnum.InDelivery ?
            <EnterAmount
              paidAmount={paidAmount}
              setPaidAmount={setPaidAmount}
              radioValue={radioValue}
              setRadioValue={setRadioValue}
            /> :
            props.currentstatus === StatusEnum.PendingReceipt && props.menu === 0 ?
              <EnterCustomAmount
                paidAmount={paidAmount}
                setPaidAmount={setPaidAmount}
                menuName={menuName}
                setMenuName={setMenuName}
              /> :
              `상태를 ${orderCategories.find(value => value.status === currentStatus + 1)?.name}(으)로 바꾸시겠습니까?`
        }
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={initialize}>취소</SecondaryButton>
        <PrimaryButton onClick={handleChangeStatus}>확인</PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}