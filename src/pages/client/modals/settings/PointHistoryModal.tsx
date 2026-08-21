import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {useEffect, useState} from "react";
import client from "@src/utils/network/client.ts";
import {formatDate} from "@src/utils/date.ts";
import {
  POINT_CANCELED_COLOR,
  POINT_TYPE_LABEL,
  PointHistoryItem,
} from "@src/models/common/PointEnum.ts";

/** 서버가 한 번에 내려주는 최대 건수 (백엔드 POINT_HISTORY_LIMIT과 동일) */
const HISTORY_LIMIT = 100;

/** 고령 고객을 위해 팝업 전체 글씨를 크게 유지합니다. */
const FONT = {
  title: '1.8rem',
  balance: '1.6rem',
  row: '1.2rem',
  sub: '1.0rem',
  button: '1.4rem',
};

function won(pointAmount: number) {
  // 적립금은 백원 단위로 저장된다
  return `${(pointAmount * 100).toLocaleString()}원`;
}

export default function PointHistoryModal(props: BasicModalProps) {
  const [balance, setBalance] = useState(0);
  const [histories, setHistories] = useState<PointHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!props.open) {
      return;
    }

    setLoading(true);
    setFailed(false);

    client
      .get('/api/order/point/history')
      .then(res => {
        setBalance(res.data.balance);
        setHistories(res.data.histories);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [props.open]);

  return (
    <Dialog open={props.open} fullWidth maxWidth='sm'>
      <DialogTitle style={{ fontSize: FONT.title }}>적립금 내역</DialogTitle>
      <DialogContent>
        <div
          className='d-flex justify-content-between align-items-center pb-2'
          style={{ fontSize: FONT.balance, fontWeight: 'bold', borderBottom: '2px solid #ddd' }}
        >
          <span>현재 적립금</span>
          <span>{won(balance)}</span>
        </div>

        {loading && (
          <p className='text-secondary text-center py-4' style={{ fontSize: FONT.row }}>
            불러오는 중...
          </p>
        )}

        {!loading && failed && (
          <p className='text-danger text-center py-4' style={{ fontSize: FONT.row }}>
            내역을 불러오지 못했습니다.
          </p>
        )}

        {!loading && !failed && histories.length === 0 && (
          <p className='text-secondary text-center py-4' style={{ fontSize: FONT.row }}>
            적립금 내역이 없습니다.
          </p>
        )}

        {!loading && !failed && histories.map(history => {
          // 회수된 적립(메뉴·그릇수거)은 원본 행에 취소 표시로만 남는다
          const isCanceled = history.isCanceled === 1;
          const isPlus = history.amount >= 0;

          return (
            <div
              key={history.id}
              className='d-flex justify-content-between align-items-center py-2'
              style={{
                fontSize: FONT.row,
                borderBottom: '1px solid #f0f0f0',
                color: isCanceled ? POINT_CANCELED_COLOR : undefined,
              }}
            >
              <div>
                <div>
                  {POINT_TYPE_LABEL[history.pathType] ?? history.pathType}
                  {
                    isCanceled &&
                    <span className='ms-2' style={{ fontWeight: 'bold' }}>적립취소</span>
                  }
                </div>
                <div className='text-secondary' style={{ fontSize: FONT.sub }}>
                  {formatDate(history.createdAt)}
                  {history.menuName && ` · ${history.menuName}`}
                </div>
              </div>
              <div
                style={{
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  textDecoration: isCanceled ? 'line-through' : undefined,
                }}
              >
                {isPlus ? '+' : '-'}{won(Math.abs(history.amount))}
              </div>
            </div>
          );
        })}

        {!loading && !failed && histories.length >= HISTORY_LIMIT && (
          <p className='text-secondary text-center pt-3 mb-0' style={{ fontSize: FONT.sub }}>
            최근 {HISTORY_LIMIT}건까지 표시됩니다.
          </p>
        )}
      </DialogContent>
      <DialogActions>
        <SecondaryButton style={{ fontSize: FONT.button }} onClick={() => props.setOpen(false)}>
          닫기
        </SecondaryButton>
      </DialogActions>
    </Dialog>
  );
}
