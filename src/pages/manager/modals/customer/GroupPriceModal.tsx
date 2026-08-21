import React, {useContext, useEffect, useState} from "react";
import {MenuCategoryContext} from "@src/contexts/manager/MenuCategoryContext.tsx";
import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {BigColumn, Column, SmallColumn} from "@src/components/atoms/Columns.tsx";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import client from "@src/utils/network/client.ts";
import FormControl from "@src/components/atoms/FormControl.tsx";
import {DiscountGroup} from "@src/models/manager/DiscountGroup.tsx";

interface GroupPriceModalProps extends BasicModalProps {
  group: DiscountGroup | null;
}

interface PriceData {
  /** menu_category.id */
  id: number;
  /** 천원 단위 */
  price: string;
}

/**
 * 그룹별 메뉴카테고리 가격 설정.
 *
 * 메뉴 금액은 그룹 단위로만 정한다. 비워두면 그룹 가격을 지워 전역 가격을 따른다.
 */
export default function GroupPriceModal(props: GroupPriceModalProps) {
  const [menuCategories, ] = useContext(MenuCategoryContext)!;
  const [prices, setPrices] = useState<PriceData[]>([]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, id: number) {
    setPrices(prices.map(price => price.id === id ? { ...price, price: e.target.value } : price));
  }

  async function handleSave() {
    await client.put('/api/manager/customer/group/price', {
      groupId: props.group?.id,
      data: prices,
    });
    props.setOpen(false);
  }

  useEffect(() => {
    if (!props.open || !props.group) {
      return;
    }

    client
      .get('/api/manager/customer/group/price', { params: { groupId: props.group.id } })
      .then(res => {
        const saved: { category: number, price: number }[] = res.data;

        setPrices(menuCategories.map(category => ({
          id: category.id,
          price: saved.find(item => item.category === category.id)?.price?.toString() ?? '',
        })));
      });
  }, [props.open, props.group?.id, menuCategories]);

  return (
    <Dialog open={props.open}>
      <DialogTitle>
        그룹 가격 설정 — {props.group?.name}
      </DialogTitle>
      <DialogContent>
        <p className='text-secondary'>
          비워두면 전역 메뉴 가격을 따릅니다.
        </p>
        {menuCategories.map((category, i) => (
          <Column key={i}>
            <SmallColumn>
              {category.name}
            </SmallColumn>
            <BigColumn>
              <FormControl
                type='number'
                suffix='천원'
                value={prices.find(price => price.id === category.id)?.price ?? ''}
                onChange={e => handleChange(e, category.id)}
                placeholder='전역 가격 사용'
              />
            </BigColumn>
          </Column>
        ))}
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={() => props.setOpen(false)}>
          닫기
        </SecondaryButton>
        <PrimaryButton onClick={handleSave}>
          적용
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}
