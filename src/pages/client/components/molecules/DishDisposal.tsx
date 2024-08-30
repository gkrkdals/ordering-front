import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import {useEffect, useState} from "react";
import DisposalDialog from "@src/pages/client/components/DisposalDialog.tsx";
import client from "@src/utils/client.ts";
import {Disposal} from "@src/models/client/Disposal.ts";

export default function DishDisposal() {

  useEffect(() => {
    client
      .get('/api/order/dish')
      .then((res) => setDishDisposals(res.data));
  }, []);

  const [dishDisposals, setDishDisposals] = useState<Disposal[]>([]);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  return (
    <>
      <Table tablesize='small' style={{ fontSize: '9pt' }}>
        <TBody>
          {dishDisposals.map((disposal, i) => {
            return (
              <TRow key={i} style={{ height: 30 }}>
                <Cell style={{ width: '25%' }}>{disposal.menu}</Cell>
                <Cell className='p-0' style={{ width: '25%' }}>
                  {
                    disposal.disposalRequested ?
                      <p className='m-0 text-secondary' style={{ fontSize: '8pt' }}>요청완료</p> :
                      <button
                        className='btn btn-secondary btn-sm px-1 py-0'
                        style={{fontSize: '9pt'}}
                        onClick={() => {
                          setIdx(i);
                          setOpen(true);
                        }}
                      >
                        수거요청
                      </button>
                  }
                </Cell>
                <Cell style={{width: '50%'}}>
                  {disposal.disposalRequested ? disposal.location : null}
                </Cell>
              </TRow>
            );
          })}
        </TBody>
      </Table>

      <DisposalDialog
        open={open}
        setopen={setOpen}
        disposals={dishDisposals}
        setdishdisposals={setDishDisposals}
        index={idx}
      />
    </>
  );
}