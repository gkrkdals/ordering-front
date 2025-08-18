import React, {useEffect, useRef} from "react";

interface EditableCellProps {
  value: string;
  isEditing: boolean;
  onClick: () => void;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  suggestions?: string[];
  id?: string;
}

export default function EditableCell({ value, isEditing, onClick, onChange, suggestions, id }: EditableCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(isEditing && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isEditing]);

  return isEditing ? (
    <>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onClick}
        list={id}
        style={{ width: '100%' }}
      />
      {suggestions && (
        <datalist id={id}>
          {suggestions?.map((item, i) => (
            <option key={i} value={item}>{item}</option>
          ))}
        </datalist>
      )}
    </>
  ) : (
    <div
      onClick={onClick}
      className={value.length === 0 ? 'text-secondary' : ''}
    >
      {value.length === 0 ? '요청사항 입력' : value}
    </div>
  );
}