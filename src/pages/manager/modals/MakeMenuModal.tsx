import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import Menu, {defaultMenu} from "@src/models/common/Menu.ts";
import {useContext, useState} from "react";
import {MenuCategoryContext} from "@src/contexts/manager/MenuCategoryContext.tsx";
import client from "@src/utils/client.ts";
import {Column, ColumnLeft, ColumnRight} from "@src/components/atoms/Columns.tsx";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";

interface MakeMenuModalProps extends BasicModalProps {
  reload: () => void;
}

export default function MakeMenuModal(props: MakeMenuModalProps) {
  const [newMenu, setNewMenu] = useState<Menu>(defaultMenu);
  const [menuCategories, ] = useContext(MenuCategoryContext)!;

  function handleClose() {
    props.setOpen(false);
  }

  async function handleCreate() {
    await client.post('/api/manager/menu', newMenu);
    props.setOpen(false);
    props.reload();
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>
        메뉴 생성
      </DialogTitle>
      <DialogContent>
        <div className='py-2'>
          <Column>
            <ColumnLeft>
              메뉴명
            </ColumnLeft>
            <ColumnRight>
              <input
                type="text"
                className='form-control'
                value={newMenu?.name}
                onChange={(e) => setNewMenu({...newMenu, name: e.target.value} as Menu)}
              />
            </ColumnRight>
          </Column>
          <Column>
            <ColumnLeft>
              분류
            </ColumnLeft>
            <ColumnRight>
              <select
                className='form-select'
                value={newMenu?.category}
                onChange={(e) => setNewMenu({
                  ...newMenu,
                  category: parseInt(e.target.value),
                } as Menu)}
              >
                {menuCategories.map((category, i) => {
                  return (
                    <option key={i} value={category.id}>
                      {category.name}({category.price}원)
                    </option>
                  );
                })}
              </select>
            </ColumnRight>
          </Column>
        </div>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={handleClose}>취소</SecondaryButton>
        <PrimaryButton onClick={handleCreate}>추가</PrimaryButton>
      </DialogActions>
    </Dialog>
  )
}