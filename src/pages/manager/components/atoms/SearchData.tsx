import React from "react";

interface SearchDataProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchData({ value, onChange }: SearchDataProps) {
  return (
    <div className='my-auto'>
      <input
        type="text"
        className='form-control'
        style={{ width: 150 }}
        value={value}
        onChange={onChange}
        placeholder='검색어 입력'
      />
    </div>
  );
}