import Card from "@src/components/Card.tsx";
import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {useState} from "react";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";

interface CustomMenuProps {
  onClick: () => void;
  customMenuName: string;
  setCustomMenuName: (name: string) => void;
}

export default function CustomMenu({ onClick, customMenuName, setCustomMenuName }: CustomMenuProps) {
  const [open, setOpen] = useState(false);

  function initialize() {
    setOpen(false);
    setCustomMenuName('');
  }

  return (
    <>
      <Card>
        <div style={{ height: '100%', overflow: 'auto' }}>
          <Table>
            <TBody>
              <TRow>
                <Cell onClick={() => setOpen(true)}>추가메뉴</Cell>
              </TRow>
            </TBody>
          </Table>
        </div>
      </Card>

      <Dialog open={open}>
        <DialogContent>
          <p>추가메뉴명:</p>
          <input
            type="text"
            className='form-control'
            value={customMenuName}
            onChange={e => setCustomMenuName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={initialize}>
            취소
          </SecondaryButton>
          <PrimaryButton onClick={() => { setOpen(false); onClick(); }}>
            추가
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </>
  );
}