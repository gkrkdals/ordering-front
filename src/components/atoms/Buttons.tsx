import {ComponentPropsWithoutRef} from "react";

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {}

export function PrimaryButton(props: ButtonProps) {
  return <button className='btn btn-primary' {...props}></button>
}

export function SecondaryButton(props: ButtonProps) {
  return <button className='btn btn-secondary' {...props}></button>
}

export function DangerButton(props: ButtonProps) {
  return <button className='btn btn-danger' {...props}></button>
}