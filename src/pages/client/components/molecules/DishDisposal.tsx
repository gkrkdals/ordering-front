import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import {useState} from "react";
import {Disposal} from "@src/models/client/Disposal.ts";
import {StatusEnum} from "@src/models/common/StatusEnum.ts";
import client from "@src/utils/network/client.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {useRecoilValue} from "recoil";
import customerState from "@src/recoil/atoms/CustomerState.ts";
import {useDisposalTime} from "@src/hooks/UseDisposalTime.tsx";

interface DishDisposalProps {
  dishDisposals: Disposal[];
  reloadDishDisposals: () => void;
}

export default function DishDisposal({ dishDisposals, reloadDishDisposals }: DishDisposalProps) {
  const user = useRecoilValue(customerState);
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  const {todaySettings: disposalTimeSettings, isWithinDisposalTime} = useDisposalTime();

  async function handleClickRequestDisposal(disposal: Disposal) {
    // 즉각적인 UX 피드백을 위한 클라이언트 사전 확인
    if (!isWithinDisposalTime()) {
      setShowTimeWarning(true);
      return;
    }

    // 서버가 최종 판정 주체 — 시계 오차 등으로 서버가 거부하면 경고를 표시
    try {
      await client.post('/api/order/dish', {
        disposal,
        location: user?.memo ?? '',
      });
      reloadDishDisposals();
    } catch {
      setShowTimeWarning(true);
    }
  }

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
                        onClick={() => handleClickRequestDisposal(disposal)}
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

      <Dialog open={showTimeWarning}>
        <DialogTitle>그릇 수거 요청 불가</DialogTitle>
        <DialogContent>
          <p>그릇 수거 요청이 가능한 시간이 아닙니다.</p>
          {disposalTimeSettings.start_time && disposalTimeSettings.end_time && (
            <p className='text-muted'>
              현재 수거 가능 시간: {disposalTimeSettings.start_time} ~ {disposalTimeSettings.end_time}
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => setShowTimeWarning(false)}>
            확인
          </SecondaryButton>
        </DialogActions>
      </Dialog>
    </>
  );
}