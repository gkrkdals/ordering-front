import React from "react";

interface SearchDataProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchData({ value, onChange }: SearchDataProps) {
  return (
    <div>
      <input
        type="text"
        className='form-control'
        value={value}
        onChange={onChange}
        placeholder='검색어를 입력하세요.'
      />
    </div>
  );
}