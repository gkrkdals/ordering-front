
import React, {useContext, useEffect, useState} from "react";
import {MenuCategoryContext} from "@src/contexts/manager/MenuCategoryContext.tsx";
import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {Column, SmallColumn, BigColumn} from "@src/components/atoms/Columns.tsx";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import client from "@src/utils/client.ts";
import {CustomerPrice} from "@src/models/manager/CustomerPrice.ts";
import {CustomerRaw} from "@src/models/manager/CustomerRaw.ts";
import FormControl from "@src/components/atoms/FormControl.tsx";

interface ModifyCustomerPriceModalProps extends BasicModalProps {
  customer: CustomerRaw | null;
}

interface PriceData {
  id: number;
  price: string;
}

export default function ModifyCustomerPriceModal(props: ModifyCustomerPriceModalProps) {
  const [menuCategories, ] = useContext(MenuCategoryContext)!;
  const [customMenuCategories, setCustomMenuCategories] = useState<PriceData[]>([]);

  function handleClose() {
    props.setOpen(false);
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>, id: number) {
    setCustomMenuCategories(customMenuCategories.map(category => {
      if (id === category.id) {
        category.price = e.target.value;
      }

      return category;
    }))
  }

  async function handleModifyPrice() {
    await client.put('/api/manager/customer/price', {
      customer: props.customer?.id,
      data: customMenuCategories,
    });
    props.setOpen(false);
  }

  useEffect(() => {
    if (props.open) {
      client
        .get(`/api/manager/customer/price?id=${props.customer?.id}`)
        .then(res => {
          const prices: CustomerPrice[] = res.data;

          setCustomMenuCategories(menuCategories.map(category => ({
            id: category.id,
            price: (prices.find(price => price.category === category.id)?.price ?? '').toString(),
          })));
        });
    }
  }, [props.customer?.id, props.open]);

  return (
    <Dialog open={props.open}>
      <DialogContent>
        <p className='text-secondary'>단위는 천원입니다.</p>
        {customMenuCategories.map(category => (
          <Column key={category.id}>
            <SmallColumn>
              {menuCategories.find(c => c.id === category.id)?.name}
            </SmallColumn>
            <BigColumn>
              <FormControl
                type='number'
                value={category.price}
                onChange={e => handleChange(e, category.id)}
                placeholder='천원'
              />
            </BigColumn>
          </Column>
        ))}

      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={handleClose}>취소</SecondaryButton>
        <PrimaryButton onClick={handleModifyPrice}>설정</PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}