interface EnterAmountProps {
  paidAmount: string;
  setPaidAmount: (paidamount: string) => void;
  radioValue: number;
  setRadioValue: (radiovalue: number) => void;
}

export default function EnterAmount({paidAmount, setPaidAmount, radioValue, setRadioValue}: EnterAmountProps) {
  return (
    <>
      <div className='mb-4'>
        <div className='d-flex'>
          <input
            id='inputBill'
            className='me-2'
            type="radio"
            value={1}
            checked={radioValue === 1}
            onChange={() => setRadioValue(1)}
          />
          <label htmlFor="inputBill">금액 입력</label>
        </div>
        <input
          type="number"
          className='form-control w-100'
          placeholder='금액 입력'
          disabled={radioValue === 2}
          value={paidAmount ?? ''}
          onChange={e => setPaidAmount(e.target.value)}
        />
      </div>
      <div>
        <div className='d-flex'>
          <input
            id='postpaid'
            className='me-2'
            type="radio"
            value={2}
            checked={radioValue === 2}
            onChange={() => setRadioValue(2)}
          />
          <label htmlFor="postpaid">후불 요청</label>
        </div>
      </div>
    </>
  );
}