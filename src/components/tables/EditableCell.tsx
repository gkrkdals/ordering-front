import React, {useEffect, useRef} from "react";

interface EditableCellProps {
  value: string;
  isEditing: boolean;
  onClick: () => void;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export default function EditableCell({ value, isEditing, onClick, onChange }: EditableCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(isEditing && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isEditing]);

  return isEditing ? (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={onChange}
      onBlur={onClick}
    />
  ) : (
    <div
      style={{ width: '100%' }}
      onClick={onClick}
      className={value.length === 0 ? 'text-secondary' : ''}
    >
      {value.length === 0 ? '요청사항 입력' : value}
    </div>
  );
}