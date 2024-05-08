import { ColumnDef } from '@tanstack/react-table';

export type Category = {
  id: number
  name: string
  createdAt: Date;
  updatedAt: Date;
}

export const categoryColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
  },
]