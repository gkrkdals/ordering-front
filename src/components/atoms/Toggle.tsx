import {CSSProperties, useMemo, useState} from "react";

interface ToggleProps {
  onChange?: (value?: boolean) => void;
  value?: boolean;
}

const style: CSSProperties = {
  fontSize: '24pt'
}

export default function Toggle({ onChange, value }: ToggleProps) {
  const [innerValue, setInnerValue] = useState(false);
  const flag = useMemo(() => {
    if((typeof value === 'boolean') && onChange) {
      return value;
    }

    return innerValue;
  }, [onChange, value, innerValue])

  function handleClick() {
    if ((typeof value === 'boolean') && onChange) {
      onChange(value);
    } else {
      setInnerValue(!innerValue);
      if (onChange) {
        onChange(!innerValue);
      }
    }
  }

  return (
    <span onClick={handleClick}>
      {!flag && <i className="bi bi-toggle-off" style={style}></i>}
      {flag && <i className="bi bi-toggle-on" style={style}></i>}
    </span>
  )
}