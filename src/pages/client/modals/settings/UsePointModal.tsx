import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { PrimaryButton, SecondaryButton } from "@src/components/atoms/Buttons";
import FormControl from "@src/components/atoms/FormControl";
import BasicModalProps from "@src/interfaces/BasicModalProps";
import customerState from "@src/recoil/atoms/CustomerState";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import client from "@src/utils/network/client";

interface UsePointModalProps extends BasicModalProps {
  /** 적립금 사용이 완료되면 호출됩니다. (설정 화면의 잔금 갱신용) */
  onUsed?: () => void;
}

interface PointUsePolicy {
  minUsePoint: number;
  useUnit: number;
}

const DEFAULT_POLICY: PointUsePolicy = { minUsePoint: 3000, useUnit: 1000 };

/** 고령 고객을 위해 팝업 전체 글씨를 크게 유지합니다. */
const FONT = {
  amount: '2.0rem',
  title: '1.8rem',
  input: '1.8rem',
  error: '1.5rem',
  description: '1.4rem',
  button: '1.4rem',
};

function won(value: number) {
  return `${value.toLocaleString()}원`;
}

export default function UsePointModal(props: UsePointModalProps) {
  const [customer, setCustomer] = useRecoilState(customerState);

  const [amountText, setAmountText] = useState("");
  const [policy, setPolicy] = useState<PointUsePolicy>(DEFAULT_POLICY);
  const [creditWon, setCreditWon] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ used: number; balance: number } | null>(null);

  const pointWon = (customer?.pointBalance ?? 0) * 100;
  const amount = parseInt(amountText.replace(/[^\d]/g, ""), 10) || 0;
  const policyMessage =
    `${policy.minUsePoint.toLocaleString()}원 이상 ${policy.useUnit.toLocaleString()}원단위`;

  useEffect(() => {
    if (props.open) {
      setAmountText("");
      setErrorMessage("");
      setSubmitting(false);

      client
        .get("/api/settings/point-use-policy")
        .then((res) => setPolicy(res.data))
        .catch(() => setPolicy(DEFAULT_POLICY));

      client
        .get("/api/order/credit")
        .then((res) => setCreditWon(res.data * -1))
        .catch(() => setCreditWon(0));
    }
  }, [props.open]);

  // 숫자만 남기고 천단위 콤마를 붙여 표시합니다.
  function handleChangeAmount(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/[^\d]/g, "").slice(0, 9);
    setAmountText(digits === "" ? "" : parseInt(digits, 10).toLocaleString());
    setErrorMessage("");
  }

  function validate() {
    if (amount <= 0) {
      setErrorMessage("올바른 적립금 사용 금액을 입력해주세요");
      return false;
    }

    if (amount % 100 !== 0 || amount < policy.minUsePoint || amount % policy.useUnit !== 0) {
      setErrorMessage(policyMessage);
      return false;
    }

    if (amount > pointWon) {
      setErrorMessage("적립금 잔액이 부족합니다");
      return false;
    }

    return true;
  }

  async function handleUsePoint() {
    if (submitting || !validate()) {
      return;
    }

    setSubmitting(true);
    try {
      await client.post("/api/order/point/use", { amount });

      const profileRes = await client.get("/api/auth/profile");
      setCustomer(profileRes.data);

      // 사용 후 잔금은 서버 값을 다시 읽어 확정하고, 실패 시 로컬 계산값을 씁니다.
      let newCredit = creditWon - amount;
      try {
        const creditRes = await client.get("/api/order/credit");
        newCredit = creditRes.data * -1;
      } catch {
        // 재조회 실패 시 로컬 계산값 유지
      }

      setResult({ used: amount, balance: newCredit });
      props.setOpen(false);
      props.onUsed?.();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "적립금 사용에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Dialog open={props.open}>
        <DialogTitle style={{ fontSize: FONT.title }}>적립금 사용</DialogTitle>
        <DialogContent>
          <div
            className="d-flex justify-content-between"
            style={{ fontSize: FONT.amount, fontWeight: 'bold' }}
          >
            <span>잔금</span>
            <span>{won(creditWon)}</span>
          </div>
          <div
            className="d-flex justify-content-between"
            style={{ fontSize: FONT.amount, fontWeight: 'bold' }}
          >
            <span>적립금</span>
            <span>{won(pointWon)}</span>
          </div>

          {/* 입력이 조건에 맞지 않을 때만 경고를 노출합니다. */}
          {errorMessage.length > 0 && (
            <p className="text-danger" style={{ fontSize: FONT.error, margin: '12px 0 4px' }}>
              {errorMessage}
            </p>
          )}

          <p className="text-secondary" style={{ fontSize: FONT.description, margin: '12px 0' }}>
            사용한 적립금만큼 잔금에서 차감 됩니다.
          </p>

          <FormControl
            inputMode="numeric"
            pattern="[0-9]*"
            suffix="원"
            suffixStyle={{ fontSize: FONT.input }}
            style={{ fontSize: FONT.input, height: '3.4rem', paddingRight: '4.5rem' }}
            value={amountText}
            onChange={handleChangeAmount}
          />
        </DialogContent>
        <DialogActions>
          <SecondaryButton style={{ fontSize: FONT.button }} onClick={() => props.setOpen(false)}>
            닫기
          </SecondaryButton>
          <PrimaryButton
            style={{ fontSize: FONT.button }}
            disabled={submitting}
            onClick={handleUsePoint}
          >
            적립금사용
          </PrimaryButton>
        </DialogActions>
      </Dialog>

      {/* 사용 결과 안내 */}
      <Dialog open={result !== null}>
        <DialogContent>
          <p style={{ fontSize: FONT.title, marginBottom: 0, lineHeight: 1.5 }}>
            {won(result?.used ?? 0)}이 차감되어 현재 잔액은 {won(result?.balance ?? 0)}입니다.
          </p>
        </DialogContent>
        <DialogActions>
          <PrimaryButton style={{ fontSize: FONT.button }} onClick={() => setResult(null)}>
            확인
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
