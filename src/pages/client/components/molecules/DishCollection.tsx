import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import {useState} from "react";
import DisposalDialog from "@src/pages/client/components/DisposalDialog.tsx";

export interface Disposal {
  name: string;
  disposalRequested: boolean;
  location: string;
}

const disposals = [
  { name: '골뱅이소면', disposalRequested: false, location: '비상구좌측 실외기' },
  { name: '훈제오리', disposalRequested: false, location: '비상구좌측 실외기' },
]

export default function DishCollection() {

  const [disp, setDisp] = useState<Disposal[]>(disposals);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  return (
    <>
      <Table small style={{ fontSize: '9pt' }}>
        <TBody>
          {disp.map((disposal, i) => {
            return (
              <TRow key={i} style={{ height: 30 }}>
                <Cell style={{ width: '25%' }}>{disposal.name}</Cell>
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

      <DisposalDialog open={open} setOpen={setOpen} disp={disp} setDisp={setDisp} index={idx} />
    </>
  );
}