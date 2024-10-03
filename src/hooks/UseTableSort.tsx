import {Column} from "@src/models/manager/Column.ts";
import {useMemo, useState} from "react";
import {Sort} from "@src/components/tables/Table.tsx";

export const useTableSort = (columns: Column[]) => {
  const [sort, setSort] = useState<Sort>({
    order: '',
    currentIndex: -1
  });

  const params = useMemo(() => ({
    column: columns.at(sort.currentIndex)?.key,
    order: sort.order,
  }), [sort]);

  return [sort, setSort, params] as const;
}