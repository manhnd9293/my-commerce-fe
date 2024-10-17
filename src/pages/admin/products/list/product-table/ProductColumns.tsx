import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  ArrowUpDown,
  EditIcon,
  LucideTrash2,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Product } from "@/dto/product/product.ts";
import ConfirmDeleteProductModal from "@/pages/admin/products/list/product-table/ConfirmDeleteProductModal.tsx";
import { Link } from "react-router-dom";

export const productColumns: ColumnDef<Product>[] = [
  {
    id: "select-row",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => (
      <img src={row.original.thumbnailUrl} className={"size-16"} />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span>Name</span>
          <ArrowUpDown className={"ml-2 h-4 w-4"} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Link to={`${row.original.id}`}>{row.original.name}</Link>
    ),
  },
  {
    id: "category",
    header: "Category",
    cell: ({ row }) => <span>{row.original.category?.name}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const product = row.original as Product;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [openConfirmDeleteModal, setOpenConfirmDeleteModal] =
        useState(false);
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  // @ts-expect-error
                  table.options.meta?.navigate(`${product.id}`);
                }}
              >
                <EditIcon className={"mr-2 w-4 h-4"} />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenConfirmDeleteModal(true)}>
                <LucideTrash2 className={"mr-2 h-4 w-4"} />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ConfirmDeleteProductModal
            open={openConfirmDeleteModal}
            onOpenChange={setOpenConfirmDeleteModal}
            onConfirm={() => {
              // @ts-expect-error
              table.options.meta?.mutate([product.id]);
            }}
          />
        </>
      );
    },
  },
];
