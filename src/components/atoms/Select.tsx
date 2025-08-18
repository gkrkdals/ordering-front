import {ComponentPropsWithoutRef} from "react";

interface SelectProps extends ComponentPropsWithoutRef<'select'>{
  small?: boolean;
}

export default function Select({ small, children, ...props }: SelectProps) {
  return (
    <select
      className={`form-select ${small ? 'form-select-sm' : ''}`}
      {...props}
    >
      {children}
    </select>
  )
}