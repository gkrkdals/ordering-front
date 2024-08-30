import React, {ComponentPropsWithoutRef} from "react";

interface BasicColumnProps extends ComponentPropsWithoutRef<'div'> {}

export function Column({ children }: { children?: React.ReactNode }) {
  return (
    <div className='col d-flex align-items-center mb-3'>
      {children}
    </div>
  )
}

export function ColumnLeft(props: BasicColumnProps) {
  return <div className='col-5' {...props} />
}

export function ColumnRight(props: BasicColumnProps) {
  return <div className='col-7' {...props} />
}