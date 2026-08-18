import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {useEffect, useState} from "react";
import BasicDialogProps from "@src/interfaces/BasicModalProps.ts";
import {Disposal} from "@src/models/client/Disposal.ts";
import client from "@src/utils/network/client.ts";
import {useRecoilValue} from "recoil";
import customerState from "@src/recoil/atoms/CustomerState.ts";
import {SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {useDisposalTime} from "@src/hooks/UseDisposalTime.tsx";

interface DisposalDialogProps extends BasicDialogProps {
  currentDisposal: Disposal | null;
  reload: () => void;
}

export default function DisposalDialog({ open, setOpen, currentDisposal, reload }: DisposalDialogProps) {
  const user = useRecoilValue(customerState);
  const [location, setLocation] = useState<string>(user?.memo ?? '');
  const [modifyingDisposal, setModifyingDisposal] = useState<Disposal | null>(null);
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  const {todaySettings: disposalTimeSettings, isWithinDisposalTime} = useDisposalTime();

  function initialize() {
    setLocation(user?.memo ?? '');
    setModifyingDisposal(null);
  }

  function handleClose() {
    setOpen(false);
    initialize();
  }

  async function handleDisposal() {
    // 즉각적인 UX 피드백을 위한 클라이언트 사전 확인
    if (!isWithinDisposalTime()) {
      setShowTimeWarning(true);
      return;
    }

    // 서버가 최종 판정 주체 — 시계 오차 등으로 서버가 거부하면 경고를 표시
    try {
      await client.post('/api/order/dish', {
        disposal: modifyingDisposal,
        location,
      });
      setOpen(false);
      reload();
    } catch {
      setShowTimeWarning(true);
    }
  }

  useEffect(() => {
    setModifyingDisposal(currentDisposal);
  }, [currentDisposal]);

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <h6>그릇 위치 입력</h6>
          <input
            type="text"
            className='form-control'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="그릇 위치 입력"
          />
        </DialogContent>
        <DialogActions>
          <button className='btn btn-sm btn-secondary' onClick={handleClose}>취소</button>
          <button
            className='btn btn-sm btn-primary'
            onClick={handleDisposal}
          >
            수거요청
          </button>
        </DialogActions>
      </Dialog>

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
  )
}