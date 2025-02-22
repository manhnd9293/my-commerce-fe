import PageTitle from "@/pages/common/PageTitle.tsx";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/common/constant/query-key.ts";
import UsersService from "@/services/users.service.ts";
import { Input } from "@/components/ui/input.tsx";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { useQueryState } from "@/hooks";
import { useState } from "react";
import { PaginationGroup } from "@/components/common/PaginationGroup.tsx";

function PurchaseHistoryPage() {
  const { queryData, onChangePage, setQueryData } = useQueryState();

  const { data: orderItemPage, isLoading } = useQuery({
    queryKey: [QueryKey.MyPurchase, queryData],
    queryFn: () => UsersService.getPurchaseHistory(queryData),
    placeholderData: keepPreviousData,
  });

  const [searchInput, setSearchInput] = useState<string>(
    queryData.search || "",
  );

  function handleSearchPurchase(event) {
    if (event.key !== "Enter") {
      return;
    }
    const updateQuery = Object.assign(queryData, {
      search: searchInput,
      page: 1,
    });
    setQueryData(structuredClone(updateQuery));
  }

  if (isLoading) {
    return "Loading purchase history ...";
  }

  return (
    <div>
      <PageTitle>Purchase history</PageTitle>
      <div className={"mt-4"}>
        <div className={"relative max-w-sm"}>
          <Input
            placeholder={"Search purchased products ..."}
            className={""}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchPurchase}
          />
          <MagnifyingGlassIcon className={"size-5 absolute top-2 right-2"} />
        </div>
      </div>
      <div className={"mt-4 bg-white rounded"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Image</TableHead>
              <TableHead className={"text-center"}>Unit price</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderItemPage &&
              orderItemPage.data.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    <span>{item.productVariant.product!.name}</span>
                  </TableCell>
                  <TableCell>
                    <img
                      src={item.productVariant.product!.thumbnailUrl}
                      className={"size-16"}
                    />
                  </TableCell>
                  <TableCell className={"text-center"}>
                    {new Intl.NumberFormat().format(
                      item.productVariant.product!.price,
                    )}
                  </TableCell>
                  <TableCell className={"text-center"}>
                    {item.quantity}
                  </TableCell>
                  <TableCell className={"text-right"}>
                    {new Intl.NumberFormat().format(
                      item.productVariant.product!.price * item.quantity,
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div className={"mt-4"}>
        <PaginationGroup
          currentPage={queryData.page || 1}
          onChangePage={onChangePage}
          pageData={orderItemPage}
        />
      </div>
    </div>
  );
}

export default PurchaseHistoryPage;
