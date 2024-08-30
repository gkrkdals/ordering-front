interface PaginationProps {
  currentpage: number;
  totalpage: number;
  onclickleft: () => void;
  onclickright: () => void;
}

export default function Pagination({currentpage, totalpage, onclickleft, onclickright}: PaginationProps) {
  return (
    <div>
      <i style={{ cursor:'pointer' }} className="bi bi-caret-left-square-fill" onClick={onclickleft}></i>
      &nbsp;{currentpage} / {totalpage}&nbsp;
      <i style={{ cursor:'pointer' }} className="bi bi-caret-right-square-fill" onClick={onclickright}></i>
    </div>
  )
}