import * as React from "react";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import categoriesService from "@/services/categories.service.ts";
import { QueryKey } from "@/common/constant/query-key.ts";
import notification from "@/utils/notification.tsx";
import { Link, useNavigate } from "react-router-dom";
import { categoryColumns } from "@/pages/admin/categories/list/category-table/CategoryColumns.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon, Search, Trash2Icon } from "lucide-react";
import ConfirmDeleteCategoryModal from "@/pages/admin/categories/list/category-table/ConfirmDeleteCategoryModal.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import ProductsService from "@/services/products.service.ts";
import { productColumns } from "@/pages/admin/products/list/product-table/ProductColumns.tsx";

export function ProductTable() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [QueryKey.Products],
    queryFn: ProductsService.getAll,
  });
  const navigate = useNavigate();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (ids: number[]) => categoriesService.delete(ids),
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: [QueryKey.Categories],
        })
        .then(() => {
          table.toggleAllPageRowsSelected(false);
          notification.success("Deleted categories success");
        });
    },
    onError: (error) => {
      notification.error(`Fail to delete categories: ${error?.message}`);
    },
  });

  const table = useReactTable({
    data: data || [],
    columns: productColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      navigate,
      mutate,
    },
    initialState: {
      columnVisibility: {
        id: false,
      },
    },
  });

  async function handleDeleteSelectedRows() {
    mutate(
      table.getSelectedRowModel().rows.map((r) => r.original.id as number),
    );
  }

  if (isLoading) {
    return "Loading products ...";
  }

  return (
    <div className="w-full">
      <div className={"flex gap-4 items-center"}>
        <Link to={"new"}>
          <Button className={""}>
            <PlusIcon className={"w-4 h-4 mr-2 font-bold"} />
            <span>New</span>
          </Button>
        </Link>
        <ConfirmDeleteCategoryModal onConfirm={handleDeleteSelectedRows}>
          <Button
            variant={"outline"}
            disabled={table.getSelectedRowModel().rows.length === 0}
          >
            <Trash2Icon className={"w-4 h-4 mr-2"} />
            <span>Delete</span>
          </Button>
        </ConfirmDeleteCategoryModal>
      </div>
      <div className="relative max-w-sm mt-4">
        <Input
          placeholder="Product name"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm pr-9"
        />
        <Search className="absolute right-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
      </div>
      <div className="rounded-md border mt-4 bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={categoryColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
