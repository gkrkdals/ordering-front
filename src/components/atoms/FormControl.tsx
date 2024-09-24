import {ComponentPropsWithoutRef, forwardRef} from "react";

interface FormControlProps extends ComponentPropsWithoutRef<'input'> {
  small?: boolean;
}

const FormControl = forwardRef<HTMLInputElement, FormControlProps>((props, ref) =>
  <input
    ref={ref}
    type="text"
    className={`form-control ${props.small ? 'form-control-sm' : ''}`}
    {...props}
  />
);

export default FormControl;