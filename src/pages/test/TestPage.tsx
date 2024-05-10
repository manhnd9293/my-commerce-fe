import PageTitle from '@/pages/common/PageTitle.tsx';
import { DataTableDemo } from '@/pages/test/table/test-full-data-table/TestFullDataTable.tsx';


function TestPage() {

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