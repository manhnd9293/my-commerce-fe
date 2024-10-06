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
import { useQuery } from "@tanstack/react-query";
import OrdersService from "@/services/orders.service.ts";
import utils from "@/utils/utils.ts";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { OrderQueryDto } from "@/dto/query/order-query.dto.ts";
import { QueryKey } from "@/common/constant/query-key.ts";
import { PaginationGroup } from "@/components/common/PaginationGroup.tsx";

function AdminOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search"));
  const navigate = useNavigate();

  const [queryData, setQueryData] = useState<OrderQueryDto>({
    page: Number(searchParams.get("page") || 1),
    search: searchParams.get("search"),
    order: searchParams.get("sortOrder"),
    sortBy: searchParams.get("sortBy"),
    pageSize: Number(searchParams.get("pageSize")) || 10,
  });

  const { data: pageOrder, isLoading } = useQuery({
    queryKey: [QueryKey.Orders, queryData],
    queryFn: () => OrdersService.getOrders(queryData),
  });

  useEffect(() => {
    const { page, search, order, sortBy, pageSize } = queryData;
    const queryObject = {};
    page && Object.assign(queryObject, { page: String(page) });
    search && Object.assign(queryObject, { search });
    order && Object.assign(queryObject, { order });
    sortBy && Object.assign(queryObject, { sortBy });
    pageSize !== undefined && Object.assign(queryObject, { pageSize });
    setSearchParams(queryObject);
  }, [queryData]);

  useEffect(() => {
    const queryObject = {
      page: Number(searchParams.get("page") || 1),
      search: searchParams.get("search"),
      order: searchParams.get("sortOrder"),
      sortBy: searchParams.get("sortBy"),
      pageSize: Number(searchParams.get("pageSize")) || 10,
    };
    setQueryData(queryObject);
    setSearchInput(queryObject.search);
  }, [searchParams]);

  if (isLoading) {
    return "Loading orders ...";
  }

  function onChangeSearchInput() {
    const assign = Object.assign(queryData, { search: searchInput, page: 1 });
    setQueryData(structuredClone(assign));
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

  return (
    <div>
      <PageTitle>Orders</PageTitle>
      <div className={"mt-4"}>
        <Input
          placeholder={"Search"}
          className={"w-96"}
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
      </div>

      <div className={"mt-4 max-w-4xl"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>User email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Total price</TableHead>
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
