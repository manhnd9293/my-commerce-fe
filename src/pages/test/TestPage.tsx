import React from 'react';
import PageTitle from '@/pages/common/PageTitle.tsx';
import { columns, Payment } from '@/pages/test/table/columns.tsx';
import { DataTable } from '@/pages/test/table/data-table.tsx';


function TestPage(props) {
  const data = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ea52f",
      amount: 200,
      status: "accept",
      email: "m2@example.com",
    },
    // ...
  ]
  return (
    <div>
      <PageTitle>Test Pages</PageTitle>

      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data}/>
      </div>
    </div>

  );
}

export default TestPage;