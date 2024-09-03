import {useEffect, useState} from "react";
import client from "@src/utils/client.ts";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    }; //value 변경 시점에 clearTimeout을 해줘야함.
  }, [value]);

  return debouncedValue;
};

const useTable = <T,>(url: string, params?: object) => {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);

  async function reload() {
    const res = await client
      .get(url, { params: {
        ...params,
          page: currentPage,
          query: debouncedSearchText,
      } });
    setData(res.data.data);
    setTotalPage(res.data.totalPage);
  }

  function prev() {
    if(currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  
  function next() {
    if(currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  }


  useEffect(() => {
    reload()
      .then(() => {});
  }, [debouncedSearchText, currentPage]);
  
  return [
    data,
    currentPage,
    totalPage,
    prev,
    next,
    reload,
    searchText,
    setSearchText,
  ] as const;
}

export default useTable;