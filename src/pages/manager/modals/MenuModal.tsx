import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import Menu, {defaultMenu} from "@src/models/common/Menu.ts";
import {useContext, useEffect, useState} from "react";
import {MenuCategoryContext} from "@src/contexts/manager/MenuCategoryContext.tsx";
import client from "@src/utils/client.ts";

interface ModifyMenuModalProps extends BasicModalProps {
  currentmenu: Menu | null;
  isupdating: boolean;
  reload: () => void;
}

export default function MenuModal({ open, setopen, currentmenu, reload, isupdating, onclose }: ModifyMenuModalProps) {

  const [tmpMenu, setTmpMenu] = useState<Menu | null>(null);
  const [menuCategories, ] = useContext(MenuCategoryContext)!;

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  async function handleCreate() {
    await client.post('/api/manager/menu', tmpMenu);
    setopen(false);

    reload();
  }

  async function handleUpdate() {
    await client.put('/api/manager/menu', tmpMenu);
    setopen(false);

    reload();
  }

  async function handleDelete() {
    await client.delete('/api/manager/menu', { params: { id: tmpMenu?.id } });
    setConfirmDelete(false);

    reload();
  }

  useEffect(() => {
    if(isupdating) {
      setTmpMenu(currentmenu);
    } else {
      setTmpMenu(defaultMenu);
    }
  }, [currentmenu]);

  return (
    <>
      <Dialog open={open} onClose={onclose} >
        <DialogTitle>
          메뉴 {isupdating ? '변경' : '생성'}
        </DialogTitle>
        <DialogContent sx={{ width: '350px' }}>
          <div className='py-2'>
            <div className='col d-flex align-items-center mb-3'>
              <div className='col-3'>메뉴명</div>
              <div>
                <input
                  type="text"
                  className='form-control'
                  value={tmpMenu?.name}
                  onChange={(e) => setTmpMenu({...tmpMenu, name: e.target.value} as Menu)}
                />
              </div>
            </div>
            <div className='col d-flex align-items-center'>
              <div className='col-3'>메뉴명</div>
              <div>
                <select
                  className='form-select'
                  value={tmpMenu?.category}
                  onChange={(e) => setTmpMenu({
                    ...tmpMenu,
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
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button className='btn btn-secondary' onClick={() => setopen(false)}>취소</button>
          {
            isupdating ?
              <>
                <button
                  className='btn btn-danger'
                  onClick={() => {
                    setopen(false);
                    setConfirmDelete(true);
                  }}
                >
                  삭제
                </button>
                <button className='btn btn-primary' onClick={handleUpdate}>적용</button>
              </> :
              <button className='btn btn-primary' onClick={handleCreate}>추가</button>
          }
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDelete}>
        <DialogContent>
          정말 삭제하시겠습니까?
        </DialogContent>
        <DialogActions>
          <button className='btn btn-secondary' onClick={() => setConfirmDelete(false)}>취소</button>
          <button className='btn btn-danger' onClick={handleDelete}>삭제</button>
        </DialogActions>
      </Dialog>
    </>
  )
}