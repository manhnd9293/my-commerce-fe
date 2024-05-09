import PageTitle from '@/pages/common/PageTitle.tsx';
import { DataTableDemo } from '@/pages/test/table/test-full-data-table/TestFullDataTable.tsx';


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

      <div className="container mx-auto mt-4">
        <DataTableDemo/>
      </div>
    </div>

  );
}

export default TestPage;