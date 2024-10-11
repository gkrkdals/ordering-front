import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {useContext, useEffect, useState} from "react";
import {MenuContext} from "@src/contexts/manager/MenuContext.tsx";
import {Cell, Table, TBody, THead, TRow} from "@src/components/tables/Table.tsx";
import FormControl from "@src/components/atoms/FormControl.tsx";
import Menu from "@src/models/common/Menu.ts";
import {useDebounce} from "@src/hooks/UseTable.tsx";
import client from "@src/utils/client.ts";
import {LAST_SEQ} from "@src/utils/data.ts";

interface SetMenuShownOrder extends BasicModalProps {}

export default function SetMenuShownOrder(props: SetMenuShownOrder) {
  const [menus] = useContext(MenuContext)!;
  const [modifyingMenus, setModifyingMenus] = useState<Menu[]>([]);
  const [searchText, setSearchText] = useState("");
  const debouncedText = useDebounce(searchText, 500);

  useEffect(() => {
    if (menus) {
      setModifyingMenus(
        menus.sort((a, b) => {
          if (a.seq === LAST_SEQ) {
            return 1;
          } else if (b.seq === LAST_SEQ) {
            return -1;
          } else {
            if (a.seq < b.seq) {
              return -1;
            } else if (a.seq > b.seq) {
              return 1;
            } else {
              return 0;
            }
          }
        })
      );
    }
  }, [menus]);

  async function handleSave() {
    await client.put('/api/manager/menu/seq', {
      seqArray: modifyingMenus.map(menu => ({ id: menu.id, seq: menu.seq })),
    })
    props.setOpen(false);
    window.dispatchEvent(new CustomEvent("reload"));
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>
        메뉴 순서 정하기
      </DialogTitle>
      <DialogContent sx={{ width: '100%' }}>
        <div className='input-group mb-3 mt-2'>
          <span className='input-group-text'>
            <i className="bi bi-search" />
          </span>
          <FormControl
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder='메뉴명 검색'
          />
        </div>

        <Table>
          <THead>
            <TRow>
              <Cell>메뉴명</Cell>
              <Cell>순서</Cell>
            </TRow>
          </THead>
          <TBody>
            {modifyingMenus
              .filter(menu => menu.id !== 0 && menu.name.includes(debouncedText))
              .map((item, i) => (
                <TRow key={i}>
                  <Cell hex={item.menuCategory?.hex}>{item.name}</Cell>
                  <Cell>
                    <FormControl
                      type='number'
                      style={{ width: 55 }}
                      value={item.seq !== LAST_SEQ ? item.seq : ''}
                      onChange={e => setModifyingMenus(modifyingMenus.map((menuNow) => {
                        const p = parseInt(e.target.value);
                        if (item.id === menuNow.id) {
                          menuNow.seq = isNaN(p) ? LAST_SEQ : p;
                        }

                        return menuNow;
                      }))}
                    />
                  </Cell>
                </TRow>
            ))}
          </TBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={() => props.setOpen(false)}>
          닫기
        </SecondaryButton>
        <PrimaryButton onClick={handleSave}>
          저장
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  )
}