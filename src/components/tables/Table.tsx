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
    <td {...props} className="text-center" style={{ backgroundColor: `#${hex}`, ...props.style, }} >
      {children}
    </td>
  );
}