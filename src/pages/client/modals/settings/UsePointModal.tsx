import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { PrimaryButton, SecondaryButton } from "@src/components/atoms/Buttons";
import FormControl from "@src/components/atoms/FormControl";
import BasicModalProps from "@src/interfaces/BasicModalProps";
import customerState from "@src/recoil/atoms/CustomerState";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import client from "@src/utils/network/client";

interface UsePointModalProps extends BasicModalProps {}

export default function UsePointModal(props: UsePointModalProps) {
  const [pointString, setPointString] = useState("");
  const [customer, setCustomer] = useRecoilState(customerState);

  const [errorMessage, setErrorMessage] = useState("");
  const [minUsePoint, setMinUsePoint] = useState<number>(3000);
  const [confirmingPoint, setConfirmingPoint] = useState<number | null>(null);

  useEffect(() => {
    if (props.open) {
      client
        .get("/api/settings/min-use-point")
        .then((res) => setMinUsePoint(res.data))
        .catch(() => setMinUsePoint(3000));
    }
  }, [props.open]);

  // 입력 검증 후 확인 다이얼로그를 띄운다 (사용 취소 수단이 없으므로 반드시 재확인)
  const handleRequestUsePoint = () => {
    const isOnlyDigits = /^\d+$/.test(pointString);
    const point = parseInt(pointString, 10);

    if (!isOnlyDigits || isNaN(point) || point <= 0) {
      setErrorMessage("올바른 적립금 사용 금액을 입력해주세요");
      return;
    }

    const pointInThousand = point * 1000;

    if (pointInThousand < minUsePoint) {
      setErrorMessage(`${minUsePoint.toLocaleString()}원 이상 사용가능`);
      return;
    }

    if (customer && point * 10 > customer.pointBalance) {
      setErrorMessage("적립금 잔액이 부족합니다");
      return;
    }

    setErrorMessage("");
    setConfirmingPoint(point);
  };

  const handleUsePoint = async () => {
    if (confirmingPoint === null) return;
    const point = confirmingPoint;
    setConfirmingPoint(null);

    try {
      await client.post("/api/order/point/use", { point });

      const profileRes = await client.get("/api/auth/profile");
      setCustomer(profileRes.data);

      props.setOpen(false);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "적립금 사용에 실패했습니다.");
    }
  };

  useEffect(() => {
    setPointString("");
    setErrorMessage("");
    setConfirmingPoint(null);
  }, [props.open]);

  return (
    <>
      <Dialog open={props.open}>
        <DialogTitle>적립금 사용</DialogTitle>
        <DialogContent>
          <p className="text-secondary" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{minUsePoint.toLocaleString()}원 이상 사용가능</p>
          <p className="text-secondary" style={{ fontSize: '1.0rem', marginBottom: '16px' }}>단위: 천원 (예: 3 입력 시 3,000원)</p>
          <p className="text-secondary" style={{ fontSize: '1.0rem', marginBottom: '16px' }}>사용한 적립금은 잔금에서 차감됩니다.</p>
          {errorMessage.length > 0 && <p className="text-danger">{errorMessage}</p>}
          <FormControl
            style={{ fontSize: '1.2rem' }}
            suffix="천원"
            value={pointString}
            onChange={(e) => setPointString(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => props.setOpen(false)}>닫기</SecondaryButton>
          <PrimaryButton onClick={handleRequestUsePoint}>적립금 사용</PrimaryButton>
        </DialogActions>
      </Dialog>

      {/* 사용 확정 전 재확인 다이얼로그 */}
      <Dialog open={confirmingPoint !== null}>
        <DialogContent>
          <p style={{ fontSize: '1.2rem', marginBottom: 0 }}>
            {(confirmingPoint ?? 0).toLocaleString()}천원 ({((confirmingPoint ?? 0) * 1000).toLocaleString()}원)
          </p>
          <p style={{ fontSize: '1.2rem', marginBottom: 0 }}>
            선택한 금액으로 적립금을 사용하시겠습니까?
          </p>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => setConfirmingPoint(null)}>취소</SecondaryButton>
          <PrimaryButton onClick={handleUsePoint}>사용</PrimaryButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
