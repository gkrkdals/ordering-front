import Card from "@src/components/Card.tsx";
import {Table, Cell, TBody, TRow} from "@src/components/tables/Table.tsx";
import SelectedMenu from "@src/models/client/SelectedMenu.ts";
import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import EditableCell from "@src/components/tables/EditableCell.tsx";
import client from "@src/utils/network/client.ts";

interface SelectedMenusProps {
  selectedMenus: SelectedMenu[];
  setSelectedMenus: React.Dispatch<React.SetStateAction<SelectedMenu[]>>;
}

export default function SelectedMenus({ selectedMenus, setSelectedMenus }: SelectedMenusProps) {
  const [recentRequests, setRecentRequests] = useState<string[]>([]);
  const [editingCellRow, setEditingCellRow] = useState<number | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  function handleCellClick(rowIndex: number) {
    setEditingCellRow(rowIndex);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    let { value } = e.target;

    // 8글자 초과 시 알림을 띄우고 8글자까지만 자르기
    if (value.length > 8) {
      alert('요청사항은 최대 8글자까지만 입력 가능합니다.'); // 기획 요구사항 반영 [cite: 5, 46]
      value = value.slice(0, 8);
    }

    setSelectedMenus(prev => {
      const newData = [...prev];
      if (editingCellRow !== null) {
        newData[editingCellRow].request = value;
      }

      return newData;
    });
  }

  function handleBlur() {
    setEditingCellRow(null);
  }

  function handleClickOutside(e: MouseEvent) {
    if (tableRef.current && !tableRef.current.contains(e.target as Node)) {
      handleBlur();
    }
  }

  function handleClickOnCancel(i: number) {
    setSelectedMenus(selectedMenus.filter((_, index) => index !== i));
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    client
      .get('/api/order/recent-request')
      .then(res => setRecentRequests(res.data));
  }, []);

  return (
      selectedMenus.length !== 0 && (<Card>
        <Table ref={tableRef} className='table table-sm table-bordered m-0' style={{ fontSize: "10pt", tableLayout: 'fixed' }}>
          <TBody>
            {selectedMenus.map((selectedMenu, rowIndex) => {
              return (
                <TRow key={rowIndex}>
                  <Cell style={{ width: '40%' }} hex={selectedMenu.menu.menuCategory?.hex}>
                    {selectedMenu.menu.name}
                  </Cell>
                  <Cell>
                    <EditableCell
                      value={selectedMenu.request}
                      isEditing={editingCellRow === rowIndex}
                      onClick={() => handleCellClick(rowIndex)}
                      onChange={handleInputChange}
                      suggestions={recentRequests}
                      id={`requestSuggestion${rowIndex}`}
                    />
                  </Cell>
                  <Cell style={{width: 30}} onClick={() => handleClickOnCancel(rowIndex)}>
                    <i className="bi bi-x" style={{ fontSize: '1.4em' }}></i>
                  </Cell>
                </TRow>
              )
            })}
          </TBody>
        </Table>
      </Card>)
  );
}