import {ComponentPropsWithoutRef, forwardRef} from "react";

interface TableProps extends ComponentPropsWithoutRef<'table'> {
  tablesize?: 'small' | 'medium' | 'large';
  font?: 'small' | 'big';
  fixed?: boolean;
}

interface TableBodyProps extends ComponentPropsWithoutRef<'tbody'> {}

interface TableRowProps extends ComponentPropsWithoutRef<'tr'> {}

interface TableCellProps extends ComponentPropsWithoutRef<'td'> {
  hex?: string;
}

export interface Sort {
  order: '' | 'asc' | 'desc';
  currentIndex: number;
}

interface TableHeadCellProps extends ComponentPropsWithoutRef<'td'> {
  sort: Sort;
  setSort: (data: Sort) => void;
  focusIndex: number;
}

export const Table = forwardRef<HTMLTableElement, TableProps>((props, ref) => {
  return (
    <table
      ref={ref}
      className={`table table-bordered ${props.tablesize === 'small' ? 'table-sm' : ''} m-0`}
      style={{
        overflow: 'hidden',
        tableLayout: props.fixed ? 'fixed' : undefined,
        fontSize: props.font === 'small' ? '9pt' : '12pt',
        ...props.style,
      }}
      {...props}
    >
      {props.children}
    </table>
  )
});

export function THead({ children, ...props }: ComponentPropsWithoutRef<'thead'>) {
  return <thead style={{ fontWeight: 'bolder' }} {...props}>{children}</thead>;
}

export function TBody({children, ...props}: TableBodyProps) {
  return <tbody {...props}>{children}</tbody>;
}

export function TRow({children, ...props}: TableRowProps) {
  return <tr {...props} style={{verticalAlign: 'middle', ...props.style }}>{children}</tr>;
}

export function Cell(
  { hex, children, ...props }
    : TableCellProps) {
  return (
    <td {...props} className="text-center" style={{backgroundColor: `#${hex}`, ...props.style,}}>
      {children}

    </td>
  );
}

export function StartCell(
  { hex, children, ...props }
  : TableCellProps) {
  return (
    <td {...props} className="text-start" style={{backgroundColor: `#${hex}`, ...props.style,}}>
      {children}

    </td>
  );
}

export function HeadCell({ children, sort, focusIndex, setSort, ...props }: TableHeadCellProps) {
  function isAscending() {
    return focusIndex === sort.currentIndex && sort.order === 'asc';
  }

  function isDescending() {
    return focusIndex === sort.currentIndex && sort.order === 'desc';
  }

  function handleClickOnCell() {
    if (focusIndex !== 0) {
      if (focusIndex === sort.currentIndex) {
        if (sort.order === "") {
          setSort({ currentIndex: focusIndex, order: 'asc' });
        } else if (sort.order === "asc") {
          setSort({ currentIndex: focusIndex, order: "desc" })
        } else if (sort.order === "desc") {
          setSort({ currentIndex: focusIndex, order: '' });
        }
      } else {
        setSort({ currentIndex: focusIndex, order: 'asc' });
      }
    }
  }

  return (
    <td
      {...props}
      onClick={handleClickOnCell}
      className="text-center"
      style={{fontWeight: 'bolder', cursor: 'pointer', ...props.style,}}
    >
      {children}
      {isAscending() && <i className="bi bi-arrow-up-short position-absolute"></i>}
      {isDescending() && <i className="bi bi-arrow-down-short position-absolute"></i>}
    </td>
  )
}