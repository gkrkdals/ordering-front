import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import {useState} from "react";
import DisposalDialog from "@src/pages/client/modals/DisposalDialog.tsx";
import {Disposal} from "@src/models/client/Disposal.ts";
import {StatusEnum} from "@src/models/common/StatusEnum.ts";

interface DishDisposalProps {
  dishDisposals: Disposal[];
  reloadDishDisposals: () => void;
}

export default function DishDisposal({ dishDisposals, reloadDishDisposals }: DishDisposalProps) {
  const [open, setOpen] = useState(false);

  const [selectedDisposal, setSelectedDisposal] = useState<Disposal | null>(null);

  return (
    <>
      <div className='mt-3' />
      <Table tablesize='small' style={{ fontSize: '11pt' }}>
        <TBody>
          {dishDisposals.map((disposal, i) => {
            return (
              <TRow key={i} style={{ height: 30 }}>
                <Cell style={{ width: '50%' }}>{disposal.menu_name}</Cell>
                <Cell className='p-0' style={{ width: '50%' }}>
                  {
                    disposal.status === StatusEnum.InPickingUp ?
                      <p className='m-0 text-secondary'>요청완료</p> :
                      <button
                        className='btn btn-danger btn-sm px-1 py-0'
                        style={{
                          fontSize: '11pt',
                          backgroundColor: "#FFAA1D",
                          borderColor: "#FFAA1D"
                        }}
                        onClick={() => {
                          setSelectedDisposal(disposal);
                          setOpen(true);
                        }}
                      >
                        수거요청
                      </button>
                  }
                </Cell>
              </TRow>
            );
          })}
        </TBody>
      </Table>

      <DisposalDialog
        open={open}
        setOpen={setOpen}
        currentDisposal={selectedDisposal}
        reload={reloadDishDisposals}
      />
    </>
  );
}