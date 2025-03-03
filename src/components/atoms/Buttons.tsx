import {ComponentPropsWithoutRef} from "react";

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  small?: boolean | undefined
}

export function PrimaryButton(props: ButtonProps) {
  return <button className={`btn btn-primary ${props.small ? 'btn-sm' : ''}`} {...props}></button>
}

export function SecondaryButton(props: ButtonProps) {
  return <button className={`btn btn-secondary ${props.small ? 'btn-sm' : ''}`} {...props}></button>
}

export function DangerButton(props: ButtonProps) {
  return <button className={`btn btn-danger ${props.small ? 'btn-sm' : ''}`} {...props}></button>
}