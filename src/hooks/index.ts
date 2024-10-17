import { useDispatch, useSelector, useStore } from "react-redux";
import { AppDispatch, AppStore, RootState } from "@/store";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BaseQueryDto } from "@/dto/query/base-query.dto.ts";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export function useQueryState(initialValue?: BaseQueryDto) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [queryData, setQueryData] = useState<BaseQueryDto>(
    initialValue || {
      search: searchParams.get("search"),
      order: searchParams.get("order"),
      sortBy: searchParams.get("sortBy"),
      page: Number(searchParams.get("page") || 1),
      pageSize: Number(searchParams.get("pageSize")) || 10,
    },
  );

  useEffect(() => {
    const { page, search, order, sortBy, pageSize } = queryData;
    const queryObject = {};
    search && Object.assign(queryObject, { search });
    order && Object.assign(queryObject, { order });
    sortBy && Object.assign(queryObject, { sortBy });
    page && Object.assign(queryObject, { page: String(page) });
    pageSize !== undefined &&
      Object.assign(queryObject, { pageSize: String(pageSize) });
    setSearchParams(queryObject);
  }, [queryData]);

  useEffect(() => {
    const queryObject = {
      search: searchParams.get("search"),
      order: searchParams.get("order"),
      sortBy: searchParams.get("sortBy"),
      page: Number(searchParams.get("page") || 1),
      pageSize: Number(searchParams.get("pageSize")) || 10,
    };

    if (JSON.stringify(queryObject) === JSON.stringify(queryData)) {
      return;
    }
    setQueryData(queryObject);
  }, [searchParams]);

  function onChangePage(changeValue: number) {
    if (!queryData.page) return;
    const assign = Object.assign(queryData, {
      page: queryData.page + changeValue,
    });
    setQueryData(structuredClone(assign));
  }

  function onSearch(searchKey: string) {
    const updateQuery = Object.assign(queryData, {
      search: searchKey,
      page: 1,
    });
    setQueryData(structuredClone(updateQuery));
  }

  return { queryData, setQueryData, onChangePage, onSearch };
}
