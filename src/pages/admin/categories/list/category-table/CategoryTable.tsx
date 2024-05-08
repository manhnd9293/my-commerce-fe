import { Category, categoryColumns } from '@/pages/admin/categories/list/category-table/CategoryColumns.tsx';
import { DataTable } from '@/pages/test/table/data-table.tsx';

function CategoryTable({data}: {data: Category[]}) {
  return (
    <div>
      <DataTable columns={categoryColumns} data={data}/>
    </div>
  );
}

export default CategoryTable;