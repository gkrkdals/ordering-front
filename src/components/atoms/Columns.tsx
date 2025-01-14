import React, {ComponentPropsWithoutRef} from "react";

interface ColumnProps {
  children?: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  style? :React.CSSProperties
}

interface BasicColumnProps extends ComponentPropsWithoutRef<'div'> {}

export function Column({ children, align, style }: ColumnProps) {
  return (
    <div className={`col d-flex mb-3 align-items-${align ?? 'center'}`} style={style}>
      {children}
    </div>
  )
}

export function SmallColumn(props: BasicColumnProps) {
  return <div className='col-3 col-sm-5' {...props} />
}

export function BigColumn(props: BasicColumnProps) {
  return <div className='col-9 col-sm-7' {...props} />
}

export function Wrapper({ children }: { children?: React.ReactNode }) {
  return (
    <div className='py-2'>
      {children}
    </div>
  )
}