import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {useContext, useMemo, useState} from "react";
import FormControl from "@src/components/atoms/FormControl.tsx";
import {Cell, StartCell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import {MenuContext} from "@src/contexts/client/MenuContext.tsx";
import Menu from "@src/models/common/Menu.ts";
import {useRecoilValue} from "recoil";
import customerState from "@src/recoil/atoms/CustomerState.ts";

interface FindMenuModal extends BasicModalProps {
  addMenuFromFind: (menu: Menu[]) => void;
}

export default function FindMenuModal(props: FindMenuModal) {
  const [searchMenu, setSearchMenu] = useState('');
  const [menus, ] = useContext(MenuContext)!;
  const filteredMenus = useMemo(() => menus.filter(value => value.name.includes(searchMenu) || searchMenu === ''), [searchMenu, menus]);
  const [selectedMenus, setSelectedMenus] = useState<Menu[]>([]);
  const customer = useRecoilValue(customerState);

  function handleClickOnMenuAdd(menu: Menu) {
    setSelectedMenus(selectedMenus.concat(menu));
  }

  function handleClose() {
    setTimeout(() => {
      setSelectedMenus([]);
      setSearchMenu('');
    }, 300);
    props.setOpen(false);
  }

  function handleAddMenus() {
    props.addMenuFromFind(selectedMenus);
    handleClose();
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>
        메뉴 검색
      </DialogTitle>
      <DialogContent style={{ width: "80vw" }}>
        <div className='mt-2' />
        <FormControl
          value={searchMenu}
          onChange={(e) => setSearchMenu(e.target.value)}
          placeholder="메뉴명 입력"
          style={{ width: '100%' }}
        />
        <p style={{ fontSize: 13 }} className='mt-3 mb-2 text-secondary'>추가한 메뉴: </p>
        <p style={{ fontSize: 13, minHeight: 45 }} className='mb-3'>
          {selectedMenus.map(selectedMenu => selectedMenu.name).join(', ')}
        </p>
        <div style={{ height: 270, overflowY: 'scroll' }}>
          <Table tablesize="small">
            <TBody>
              {filteredMenus.map((menu, i) => (
                <TRow key={i}>
                  <StartCell
                    hex={menu.soldOut === 1 ? 'AAAAAA' : menu.menuCategory?.hex}
                    style={{ fontSize: 12 }}
                  >
                    {menu.name}&nbsp;{menu.soldOut === 1 && <span className='text-danger'>(품절)</span>}
                  </StartCell>
                  {(customer && customer.showPrice) ? (
                    <Cell style={{ fontSize: 12 }}>
                      {menu.menuCategory?.price}
                    </Cell>
                  ) : null}
                  <Cell>
                    {
                      menu.soldOut !== 1 ?
                        <i
                          className="bi bi-cart-plus-fill"
                          onClick={() => handleClickOnMenuAdd(menu)}
                        /> :
                        <i className="bi bi-ban"></i>
                    }
                  </Cell>
                </TRow>
              ))}
            </TBody>
          </Table>
        </div>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={handleClose}>
          닫기
        </SecondaryButton>
        <PrimaryButton onClick={handleAddMenus}>
          선택 메뉴 추가
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  )
}