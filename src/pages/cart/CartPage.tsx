import PageTitle from '@/pages/common/PageTitle.tsx';
import { useSelector } from 'react-redux';
import { UserDto } from '@/dto/user/user.dto.ts';
import { Card } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Trash2Icon } from 'lucide-react';

function CartPage() {
  const currentUser: UserDto = useSelector((state) => state.user);
  return (
    <div>
      <PageTitle>Shopping Cart</PageTitle>
      <div className={'mt-4'}>
        {
          currentUser.cart && currentUser.cart.length > 0 &&
          currentUser.cart.map(item => {
            return (
              <div className={'flex gap-4'}>
                <div className={'flex flex-col'}>
                  <div>{item.productVariant.product.name}</div>
                  <div>Quantity: {item.quantity}</div>
                  <div className={'flex gap-4 mt-8'}>
                    <Button className={'bg-amber-600 hover:bg-amber-500'}>
                      Buy Now
                    </Button>
                    <Button variant={'destructive'} size={'icon'}>
                      <Trash2Icon/>
                    </Button>

                  </div>
                </div>
                <img className={'size-32'} src={item.productVariant.product.thumbnailUrl} />

              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default CartPage;
