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

const useTable = <T,>(origin: string, params?: object) => {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [count, setCount] = useState(0);

  const [url, setUrl] = useState(origin);

  const [searchData, setSearchData] = useState("");
  const debouncedSearchText = useDebounce(searchData, 500);

  async function reload() {
    const res = await client
      .get(url, { params: {
        ...params,
          page: currentPage,
          query: debouncedSearchText,
      } });

    const totalPage = res.data.totalPage;
    if (totalPage < currentPage) {
      setCurrentPage(totalPage);

      const newRes = await client
        .get(url, { params: {
            ...params,
            page: totalPage,
            query: debouncedSearchText,
        }});
      setData(newRes.data.data);
      setTotalPage(newRes.data.totalPage);
      setCount(newRes.data.count);
      return;
    }

    setData(res.data.data);
    setTotalPage(res.data.totalPage);
    setCount(res.data.count);
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
  }, [debouncedSearchText, currentPage, params]);

  useEffect(() => {
    if (currentPage === 1) {
      reload().then();
    } else {
      setCurrentPage(1);
    }
  }, [url]);
  
  return {
    data,
    currentPage,
    totalPage,
    count,
    prev,
    next,
    reload,
    searchData,
    setSearchData,
    url,
    setUrl,
  };
}

export default useTable;