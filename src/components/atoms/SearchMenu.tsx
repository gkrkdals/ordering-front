import {ComponentPropsWithoutRef} from "react";

interface Name {
  name: string;
}

interface SelecteMenuProps<T extends Name> extends ComponentPropsWithoutRef<'input'> {
  datalists: T[];
  id: string;
}

export default function SearchMenu<T extends Name>({ id, datalists, value, onClick, ...props }: SelecteMenuProps<T>) {
  return (
    <>
      <input type='text' className='form-control' list={id} value={value} onClick={onClick} {...props} />
      <datalist id={id}>
        {datalists.map((item: T) => <option value={item.name}>{item.name}</option>)}
      </datalist>
    </>
  );
}