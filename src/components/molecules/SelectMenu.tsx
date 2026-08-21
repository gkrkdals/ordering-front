import {useEffect, useState} from "react";
import Menu from "@src/models/common/Menu.ts";
import SearchAutocomplete from "@src/components/molecules/SearchAutocomplete.tsx";

interface SelectMenuProps {
  uniqueId: string;
  menus: Menu[];
  setSelectedMenu: (selectedMenu: number) => void;
  setPrice?: (price: string) => void;
  /** 처음 표시할 메뉴명 (기존 값 불러오기용) */
  initialValue?: string;
}

export default function SelectMenu(props: SelectMenuProps) {
  const [selected, setSelected] = useState<Menu | null>(null);

  function handleSelect(menu: Menu | null) {
    setSelected(menu);

    if (menu) {
      props.setSelectedMenu(menu.id);
      props.setPrice?.((menu.menuCategory!.price / 1000).toString());
    }
  }

  // 기존 값을 그대로 보여준다. 이후 선택은 사용자가 고른 값이 유지되어야 하므로
  // initialValue가 바뀔 때(다른 주문을 열었을 때)만 덮어쓴다.
  useEffect(() => {
    if (props.initialValue !== undefined) {
      setSelected(props.menus.find(menu => menu.name === props.initialValue) ?? null);
    }
  }, [props.initialValue]);

  return (
    <SearchAutocomplete
      id={props.uniqueId}
      options={props.menus}
      getLabel={menu => menu.name}
      value={selected}
      onSelect={handleSelect}
      placeholder='메뉴 선택'
    />
  );
}
