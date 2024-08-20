import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import {PlusIcon, Search, Trash2Icon} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {categoryColumns} from '@/pages/admin/categories/list/category-table/CategoryColumns.tsx';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import categoriesService from '@/services/categories.service.ts';
import {keepPreviousData, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QueryKey} from '@/constant/query-key.ts';
import notification from '@/utils/notification.tsx';
import ConfirmDeleteCategoryModal from '@/pages/admin/categories/list/category-table/ConfirmDeleteCategoryModal.tsx';
import {useEffect, useState} from "react";

export function CategoryTable() {
  const [params, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [page, setPage] = useState(params.get('page') ? Number(params.get('page')) : 0);
  const [pageSize, setPageSize] = useState(params.get('pageSize') ? Number(params.get('pageSize')) : 5);

  const {data, isLoading, isError , error} = useQuery({
    queryKey: [QueryKey.Categories, page, pageSize],
    queryFn: () => categoriesService.getPage(page, pageSize),
    placeholderData: keepPreviousData,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({});
  const queryClient = useQueryClient();
  const {mutate} = useMutation({
    mutationFn: (ids: number[]) => categoriesService.delete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.Categories]
      }).then(() => {
        table.toggleAllPageRowsSelected(false);
        notification.success('Deleted categories success');
      })
    },
    onError: error => {
      notification.error(`Fail to delete categories: ${error?.message}`)
    }
  });



  const table = useReactTable({
    data: data?.items ?? [],
    columns: categoryColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    rowCount: data?.total,
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
        id: false
      },
      pagination: {
        pageIndex: 0,
        pageSize,
      }
    }
  });

  useEffect(()=>{
    setSearchParams((params)=> ({...params, page, pageSize}))
  }, [page, pageSize])


  if (isLoading) {
    return <div>Loading data ...</div>
  }

  if(isError) {
    return <div>Fail to load categories: {error.message}</div>
  }

  async function handleDeleteSelectedRows() {
    mutate(table.getSelectedRowModel().rows.map(r => r.original.id as number));
  }



  return (
    <div className="w-full">
      <div className={'flex gap-4 items-center'}>
        <Link to={'create'}>
          <Button className={'bg-amber-600 hover:bg-amber-500'}>
            <PlusIcon className={'w-4 h-4 mr-2 font-bold'}/>
            <span>New</span>
          </Button>
        </Link>
        <ConfirmDeleteCategoryModal onConfirm={handleDeleteSelectedRows}>
          <Button variant={'outline'}
                  disabled={table.getSelectedRowModel().rows.length === 0}
          >
            <Trash2Icon className={'w-4 h-4 mr-2'}/>
            <span>Delete</span>
          </Button>
        </ConfirmDeleteCategoryModal>
      </div>
      <div className="relative max-w-sm mt-4">
        <Input
          placeholder="Category names"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm pr-9"
        />
        <Search className="absolute right-0 top-0 m-2.5 h-4 w-4 text-muted-foreground"/>
      </div>
      <div className="rounded-md border mt-4">
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
                          header.getContext()
                        )}
                    </TableHead>
                  )
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
                        cell.getContext()
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
            onClick={() => {
              setPage(page => page - 1);
              table.resetRowSelection();
            }}
            disabled={page === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPage(page => page + 1);
              table.resetRowSelection();
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
