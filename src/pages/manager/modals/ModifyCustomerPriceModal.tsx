import Customer from "@src/models/common/Customer.ts";
import {useContext, useEffect, useState} from "react";
import {MenuCategoryContext} from "@src/contexts/manager/MenuCategoryContext.tsx";
import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {Column, ColumnLeft, ColumnRight} from "@src/components/atoms/Columns.tsx";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import client from "@src/utils/client.ts";
import {CustomerPrice} from "@src/models/manager/CustomerPrice.ts";

interface ModifyCustomerPriceModalProps extends BasicModalProps {
  customer: Customer | null;
}

export default function ModifyCustomerPriceModal(props: ModifyCustomerPriceModalProps) {
  const [transparent, setTransparent] = useState<string>('');
  const [blue, setBlue] = useState<string>('');
  const [green, setGreen] = useState<string>('');

  const [menuCategories, ] = useContext(MenuCategoryContext)!;

  function initialize() {
    setTransparent('');
    setBlue('');
    setGreen('');
  }

  function handleClose() {
    initialize();
    props.setOpen(false);
  }

  async function handleModifyPrice() {
    await client.put('/api/manager/customer/price', {
      0: transparent,
      1: blue,
      2: green,
      customer: props.customer?.id
    });
    props.setOpen(false);
  }

  useEffect(() => {
    if (props.open) {
      client
        .get(`/api/manager/customer/price?id=${props.customer?.id}`)
        .then(res => {
          const prices: CustomerPrice[] = res.data;
          setTransparent(prices.find(price => price.category === 1)?.price.toString() ?? '');
          setBlue(prices.find(price => price.category === 2)?.price.toString() ?? '');
          setGreen(prices.find(price => price.category === 3)?.price.toString() ?? '');
        });
    }
  }, [props.customer?.id, props.open]);

  return (
    <Dialog open={props.open}>
      <DialogContent>
        <Column>
          <ColumnLeft>
            {menuCategories[0].name}
          </ColumnLeft>
          <ColumnRight>
            <input
              type="number"
              className='form-control'
              value={transparent}
              onChange={(e) => setTransparent(e.target.value)}
            />
          </ColumnRight>
        </Column>
        <Column>
          <ColumnLeft>
            {menuCategories[1].name}
          </ColumnLeft>
          <ColumnRight>
            <input
              type="number"
              className='form-control'
              value={blue}
              onChange={(e) => setBlue(e.target.value)}
            />
          </ColumnRight>
        </Column>
        <Column>
          <ColumnLeft>
            {menuCategories[2].name}
          </ColumnLeft>
          <ColumnRight>
            <input
              type="number"
              className='form-control'
              value={green}
              onChange={(e) => setGreen(e.target.value)}
            />
          </ColumnRight>
        </Column>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={handleClose}>취소</SecondaryButton>
        <PrimaryButton onClick={handleModifyPrice}>설정</PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}