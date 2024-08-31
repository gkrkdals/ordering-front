import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import {useEffect, useState} from "react";
import DisposalDialog from "@src/pages/client/components/DisposalDialog.tsx";
import client from "@src/utils/client.ts";
import {Disposal} from "@src/models/client/Disposal.ts";
import {getSocket} from "@src/utils/socket.ts";
import {StatusEnum} from "@src/models/common/StatusEnum.ts";

const socket = getSocket();

export default function DishDisposal() {
  const [dishDisposals, setDishDisposals] = useState<Disposal[]>([]);
  const [open, setOpen] = useState(false);

  const [selectedDisposal, setSelectedDisposal] = useState<Disposal | null>(null);

  function reload() {
    client
      .get('/api/order/dish')
      .then((res) => setDishDisposals(res.data));
  }

  useEffect(() => {
    reload();
  }, []);

  useEffect(() => {
    socket.on('refresh_client', () => {
      reload();
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    }
  }, []);

  return (
    <>
      <Table tablesize='small' style={{ fontSize: '11pt' }}>
        <TBody>
          {dishDisposals.map((disposal, i) => {
            return (
              <TRow key={i} style={{ height: 30 }}>
                <Cell style={{ width: '25%' }}>{disposal.menu_name}</Cell>
                <Cell className='p-0' style={{ width: '25%' }}>
                  {
                    disposal.status === StatusEnum.InPickingUp ?
                      <p className='m-0 text-secondary'>요청완료</p> :
                      <button
                        className='btn btn-secondary btn-sm px-1 py-0'
                        style={{fontSize: '11pt'}}
                        onClick={() => {
                          setSelectedDisposal(disposal);
                          setOpen(true);
                        }}
                      >
                        수거요청
                      </button>
                  }
                </Cell>
                <Cell style={{width: '50%'}}>
                  {disposal.location}
                </Cell>
              </TRow>
            );
          })}
        </TBody>
      </Table>

      <DisposalDialog
        open={open}
        setopen={setOpen}
        currentDisposal={selectedDisposal}
        reload={reload}
      />
    </>
  );
}