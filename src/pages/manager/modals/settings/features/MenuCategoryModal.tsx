import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,

} from "@mui/material";
import {DangerButton, PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons";
import BasicModalProps from "@src/interfaces/BasicModalProps";
import {useContext, useEffect, useState} from "react";
import {Cell, Table, TBody, THead, TRow,} from "@src/components/tables/Table.tsx";
import client from "@src/utils/network/client.ts";
import MenuCategory from "@src/models/common/MenuCategory.ts";
import FormControl from "@src/components/atoms/FormControl.tsx";
import {MenuCategoryContext} from "@src/contexts/manager/MenuCategoryContext.tsx";

interface MenuCategoryExt extends MenuCategory {
  modified: boolean;
  deleted: boolean;
}

export default function MenuCategoryModal(props: BasicModalProps) {

  const [modifiedCategories, setModifiedCategories] = useState<MenuCategoryExt[]>([]);
  const [addedCategories, setAddedCategories] = useState<MenuCategoryExt[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const [_, setMenuCategories] = useContext(MenuCategoryContext)!;

  const modifyRow1 = (index: number, key: string, e: any) => {
    setModifiedCategories(modifiedCategories.map((p, i) => {
      if (index === i) {
        p[key] = e.target.value;
        p.modified = true;
      }
      return p;
    }));
  }

  const modifyRow2 = (index: number, key: string, e: any) => {
    setAddedCategories(addedCategories.map((p, i) => {
      if (index === i) {
        p[key] = e.target.value;
        p.modified = true;
      }
      return p;
    }));
  }

  function handleAddNewCategory() {
    setAddedCategories(addedCategories.concat({
      id: 0,
      price: 0,
      hex: 'FFFFFF',
      name: '',
      modified: false,
      deleted: false,
    }));
  }

  function initialize() {
    setModifiedCategories([]);
    setAddedCategories([]);
  }

  function handleClose() {
    props.setOpen(false);
    setTimeout(initialize, 300);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await client.put("/api/manager/settings/menu/category", {
        modified: modifiedCategories,
        added: addedCategories,
      });
      const res = await client.get("/api/manager/menu/category");
      setMenuCategories(res.data);
      handleClose();
    } catch(e) {

    } finally {
      setIsSaving(false);
    }

  }

  useEffect(() => {
    if (props.open) {
      client
        .get("/api/manager/settings/menu/category")
        .then((res) => setModifiedCategories(res.data));
    }
  }, [props.open]);

  return (
    <Dialog open={props.open}>
      <DialogTitle>메뉴 카테고리 설정</DialogTitle>
      <DialogContent style={{ width: 500 }}>
        <p className="text-secondary">사용중인 카테고리는 삭제되지 않습니다.</p>
        <Table>
          <THead>
            <TRow>
              <Cell>색상명</Cell>
              <Cell>색상코드</Cell>
              <Cell>가격</Cell>
              <Cell style={{ width: 80 }}></Cell>
            </TRow>
          </THead>
          <TBody>
            {
              modifiedCategories
                .filter((item) => !item.deleted)
                .map((item, i) => (
                  <TRow key={i}>
                    <Cell>
                      <FormControl
                        value={item.name}
                        onChange={e => modifyRow1(i, "name", e)}
                      />
                    </Cell>
                    <Cell>
                      <FormControl
                        value={item.hex}
                        onChange={e => modifyRow1(i, "hex", e)}
                      />
                    </Cell>
                    <Cell>
                      <FormControl
                        type="number"
                        value={item.price}
                        onChange={e => modifyRow1(i, "price", e)}
                      />
                    </Cell>
                    <Cell>
                      <DangerButton onClick={() => {
                        setModifiedCategories(modifiedCategories.map(p => {
                          if (p.id === item.id) {
                            p.deleted = true;
                          }

                          return p;
                        }));
                      }}>
                        삭제
                      </DangerButton>
                    </Cell>
                  </TRow>
                ))
            }
            {
              addedCategories
                .map((item, i) => (
                  <TRow key={`added-${i}`}>
                    <Cell>
                      <FormControl
                        value={item.name}
                        onChange={e => modifyRow2(i, "name", e)}
                      />
                    </Cell>
                    <Cell>
                      <FormControl
                        value={item.hex}
                        onChange={e => modifyRow2(i, "hex", e)}
                      />
                    </Cell>
                    <Cell>
                      <FormControl
                        type="number"
                        value={item.price}
                        onChange={e => modifyRow2(i, "price", e)}
                      />
                    </Cell>
                    <Cell>
                      <DangerButton onClick={() => setAddedCategories(addedCategories.filter((_, index) => {
                        return i !== index;
                      }))}>
                        삭제
                      </DangerButton>
                    </Cell>
                  </TRow>
                ))
            }
          </TBody>
        </Table>
        <div className="d-flex mt-3">
          <PrimaryButton onClick={handleAddNewCategory}>카테고리 추가</PrimaryButton>
        </div>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={handleClose} disabled={isSaving}>
          닫기
        </SecondaryButton>
        <PrimaryButton onClick={handleSave} disabled={isSaving}>
          {isSaving ? "저장 중.." : "저장"}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  )
}