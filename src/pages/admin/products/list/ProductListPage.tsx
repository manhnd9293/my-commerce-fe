import PageTitle from '@/pages/common/PageTitle.tsx';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { PlusIcon } from 'lucide-react';

function ProductListPage() {
  return (
    <div>
      <PageTitle>Products</PageTitle>
      <div className={'mt-4 max-w-4xl'}>
        <Link to={'new'}>
          <Button className={'bg-amber-600 hover:bg-amber-500'}>
            <PlusIcon className={'w-4 h-4 mr-2 font-bold'}/>
            <span>New</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ProductListPage;