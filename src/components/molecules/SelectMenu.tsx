import FormControl from "@src/components/atoms/FormControl.tsx";
import {useRef} from "react";
import Menu from "@src/models/common/Menu.ts";

interface SelectMenuProps {
  uniqueId: string;
  menus: Menu[];
  setSelectedMenu: (selectedMenu: number) => void;
  setPrice?: (price: string) => void;
}

export default function SelectMenu(props: SelectMenuProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSelecteMenu() {
    const value = inputRef.current!.value;
    const foundMenu = props.menus.find(menu => menu.name === value);

    if (foundMenu) {
      props.setSelectedMenu(foundMenu.id);
      props.setPrice?.(((foundMenu.menuCategory!.price / 1000)).toString());
    }
  }

  return (
    <>
      <FormControl
        ref={inputRef}
        onInput={handleSelecteMenu}
        list={props.uniqueId}
        placeholder='메뉴 선택'
      />
      <datalist id={props.uniqueId}>
        {props.menus.map((menu, i) =>
          <option key={i} value={menu.name}>{menu.name}</option>
        )}
      </datalist>
    </>
  );
}