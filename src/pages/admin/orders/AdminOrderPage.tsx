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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import { useQuery } from "@tanstack/react-query";
import OrdersService from "@/services/orders.service.ts";
import utils from "@/utils/utils.ts";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { OrderQueryDto } from "@/dto/query/order-query.dto.ts";
import { QueryKey } from "@/common/constant/query-key.ts";

function AdminOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search"));

  const [queryData, setQueryData] = useState<OrderQueryDto>({
    page: Number(searchParams.get("page") || 1),
    search: searchParams.get("search"),
    order: searchParams.get("sortOrder"),
    sortBy: searchParams.get("sortBy"),
  });

  const {
    data: pageOrder,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [QueryKey.Orders, queryData],
    queryFn: () => OrdersService.getOrders(queryData),
  });

  useEffect(() => {
    const { page, search, order, sortBy } = queryData;
    const queryObject = {};
    page && Object.assign(queryObject, { page: String(page) });
    search && Object.assign(queryObject, { search });
    order && Object.assign(queryObject, { order });
    sortBy && Object.assign(queryObject, { sortBy });
    setSearchParams(queryObject);
  }, [queryData]);

  if (isLoading) {
    return "Loading orders ...";
  }

  function onChangeSearchInput() {
    const assign = Object.assign(queryData, { search: searchInput });
    setQueryData(structuredClone(assign));
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

      <div className={"mt-4"}>
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
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.user.email}</TableCell>
                <TableCell>{order.createdAt.toString()}</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell>{utils.getMoneyNumber(order.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className={"mt-4"}>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default AdminOrderPage;
