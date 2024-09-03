interface EnterCustomAmountProps {
  paidAmount: string;
  setPaidAmount: (paidAmount: string) => void;
  menuName: string;
  setMenuName: (menuName: string) => void;
}

export default function EnterCustomAmount({ paidAmount, setPaidAmount, menuName, setMenuName }: EnterCustomAmountProps) {
  return (
    <div>
      <p>메뉴명</p>
      <input
        type="text"
        className='form-control'
        placeholder='메뉴명 입력'
        value={menuName}
        onChange={e => setMenuName(e.target.value)}
      />
      <div className='my-3' />
      <p>금액</p>
      <input
        type="number"
        className='form-control'
        placeholder='금액 입력'
        value={paidAmount}
        onChange={e => setPaidAmount(e.target.value)}
      />
    </div>
  )
}
