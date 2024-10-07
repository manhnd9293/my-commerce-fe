import PageTitle from "@/pages/common/PageTitle.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input.tsx";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import OrdersService from "@/services/orders.service.ts";
import utils from "@/utils/utils.ts";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { OrderQueryDto } from "@/dto/query/order-query.dto.ts";
import { QueryKey } from "@/common/constant/query-key.ts";
import { PaginationGroup } from "@/components/common/PaginationGroup.tsx";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import * as React from "react";

function AdminOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search"));
  const navigate = useNavigate();

  const [queryData, setQueryData] = useState<OrderQueryDto>({
    search: searchParams.get("search"),
    order: searchParams.get("order"),
    sortBy: searchParams.get("sortBy"),
    page: Number(searchParams.get("page") || 1),
    pageSize: Number(searchParams.get("pageSize")) || 10,
  });

  const { data: pageOrder, isLoading } = useQuery({
    queryKey: [QueryKey.Orders, queryData],
    queryFn: () => OrdersService.getOrders(queryData),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const { page, search, order, sortBy, pageSize } = queryData;
    console.log({ queryData });
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
    setSearchInput(queryObject.search);
  }, [searchParams]);

  if (isLoading) {
    return "Loading orders ...";
  }

  function onChangeSearchInput() {
    const updateQuery = Object.assign(queryData, {
      search: searchInput,
      page: 1,
    });
    setQueryData(structuredClone(updateQuery));
  }

  function onChangePage(changeValue: number) {
    if (!queryData.page) return;
    const assign = Object.assign(queryData, {
      page: queryData.page + changeValue,
    });
    setQueryData(structuredClone(assign));
  }

  function handleOrderClick(id: number) {
    navigate(`${id}`);
  }

  function handleSort(field: string) {
    const currentOrder = queryData.order;
    const currentSortBy = queryData.sortBy;
    const sortStates = [undefined, "ASC", "DESC"];
    let nextSort = null;
    if (currentSortBy === field && currentOrder) {
      const currentIndex = sortStates.findIndex(
        (state) => state === currentOrder,
      );
      nextSort = sortStates[(currentIndex + 1) % sortStates.length];
    } else if (!currentSortBy || currentSortBy !== field) {
      nextSort = "ASC";
    }
    const updateQuery = Object.assign(
      queryData,
      nextSort
        ? { sortBy: field, order: nextSort, page: 1, pageSize: 10 }
        : { order: undefined, sortBy: undefined },
    );
    setQueryData(structuredClone(updateQuery));
  }

  return (
    <div>
      <PageTitle>Orders</PageTitle>
      <div className={"mt-4"}>
        <div className={"relative max-w-md"}>
          <Input
            placeholder={"Search"}
            value={searchInput || ""}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter") {
                return;
              }
              onChangeSearchInput();
            }}
          />
          <Search className="absolute right-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className={"mt-4 max-w-4xl"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>User email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>State</TableHead>
              <TableHead
                onClick={() => handleSort("total")}
                className={"flex gap-2 items-center"}
              >
                <span>Total price</span>
                {queryData.sortBy === "total" && queryData.order === "ASC" && (
                  <ArrowUp className={"size-4"} />
                )}
                {queryData.sortBy === "total" && queryData.order === "DESC" && (
                  <ArrowDown className={"size-4"} />
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageOrder?.data.map((order) => (
              <TableRow
                key={order.id}
                className={"cursor-pointer"}
                onClick={() => handleOrderClick(order.id!)}
              >
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.user.email}</TableCell>
                <TableCell>{order.createdAt?.toString()}</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell>{utils.getMoneyNumber(order.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className={"mt-4"}>
          <PaginationGroup
            currentPage={queryData.page}
            onChangePage={onChangePage}
            pageData={pageOrder}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminOrderPage;
