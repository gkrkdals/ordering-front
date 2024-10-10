import Menu from "@src/models/common/Menu.ts";
import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {useContext, useEffect, useState} from "react";
import {MenuCategoryContext} from "@src/contexts/manager/MenuCategoryContext.tsx";
import client from "@src/utils/client.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {Column, SmallColumn, BigColumn} from "@src/components/atoms/Columns.tsx";
import {DangerButton, PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";

interface ModifyMenuModal extends BasicModalProps {
  currentMenu: Menu | null;
  reload: () => void;
}

export default function ModifyMenuModal(props: ModifyMenuModal) {
  const [modifyingMenu, setModifyingMenu] = useState<Menu | null>(null);
  const [confirmModal, setConfirmModal] = useState<boolean>(false);

  const [menuCategories, ] = useContext(MenuCategoryContext)!;

  useEffect(() => {
    setModifyingMenu(props.currentMenu);
  }, [props.currentMenu]);

  async function handleUpdate() {
    await client.put('/api/manager/menu', modifyingMenu);
    props.setOpen(false);
    props.reload();
  }

  function handlePressOnDelete() {
    props.setOpen(false);
    setConfirmModal(true);
  }

  async function handleDelete() {
    await client.delete('/api/manager/menu', { params: { id: modifyingMenu?.id } });
    setConfirmModal(false);
    props.reload();
  }

  return (
    <>
      <Dialog open={props.open}>
        <DialogTitle>
          메뉴 변경
        </DialogTitle>
        <DialogContent>
          <div className='py-2'>
            <Column>
              <SmallColumn>
                메뉴명
              </SmallColumn>
              <BigColumn>
                <input
                  type="text"
                  className='form-control'
                  value={modifyingMenu?.name}
                  onChange={(e) => setModifyingMenu({...modifyingMenu, name: e.target.value} as Menu)}
                />
              </BigColumn>
            </Column>
            <Column>
              <SmallColumn>
                분류
              </SmallColumn>
              <BigColumn>
                <select
                  className='form-select'
                  value={modifyingMenu?.category}
                  onChange={(e) => setModifyingMenu({
                    ...modifyingMenu,
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
              </BigColumn>
            </Column>
            <Column>
              <SmallColumn>
                품절여부
              </SmallColumn>
              <BigColumn>
                <div className='d-flex justify-content-between'>
                  <div>
                    <input
                      id='exists'
                      type="radio"
                      value={modifyingMenu?.soldOut}
                      checked={modifyingMenu?.soldOut === 0}
                      onChange={() => setModifyingMenu({ ...modifyingMenu, soldOut: 0 } as Menu)}
                    />
                    <label htmlFor="exists">재고있음</label>
                  </div>
                  <div>
                    <input
                      id='soldout'
                      type="radio"
                      value={modifyingMenu?.soldOut}
                      checked={modifyingMenu?.soldOut === 1}
                      onChange={() => setModifyingMenu({ ...modifyingMenu, soldOut: 1 } as Menu)}
                    />
                    <label htmlFor="soldout">품절</label>
                  </div>
                </div>
              </BigColumn>
            </Column>
          </div>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => props.setOpen(false)}>닫기</SecondaryButton>
          <DangerButton onClick={handlePressOnDelete}>
            삭제
          </DangerButton>
          <PrimaryButton onClick={handleUpdate}>적용</PrimaryButton>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmModal}>
        <DialogContent>
          정말 삭제하시겠습니까?
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => setConfirmModal(false)}>취소</SecondaryButton>
          <DangerButton onClick={handleDelete}>삭제</DangerButton>
        </DialogActions>
      </Dialog>
    </>
  );
}