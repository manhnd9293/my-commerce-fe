import { useQuery } from "@tanstack/react-query";
import { DEFAULT_COLOR, DEFAULT_SIZE, QueryKey } from "@/constant/query-key.ts";
import ProductsService from "@/services/products.service.ts";
import { useParams, useSearchParams } from "react-router-dom";
import PageTitle from "@/pages/common/PageTitle.tsx";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel.tsx";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button.tsx";
import { MinusIcon, PlusIcon, ShoppingCartIcon } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { cn } from '@/lib/utils.ts';

function ProductDetailPage() {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [orderQuantity, setOrderQuantity] = useState(searchParams.get('quantity') ? parseInt(searchParams.get('quantity')!) : 0);
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color'));
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size'));

  const {data, isLoading, isError, error} = useQuery({
    queryKey: [QueryKey.Product, {id: Number(params.id)}],
    queryFn: () => ProductsService.get(params.id!),
  });

  useEffect(()=> {
    if (!data) {
      return;
    }
    // @ts-ignore
    setCurrentImageUrl(data.productImages[0]!.asset.preSignUrl);

    if(data.productSizes && data.productSizes.length > 0 && !searchParams.get('size')) {
      setSelectedSize(data.productSizes[0].name);
    }
    if(data.productColors && data.productColors.length > 0 && !searchParams.get('color')) {
      setSelectedColor(data.productColors[0].code);
    }
  }, [data])

  if (isLoading) {
    return <div>Loading product ... </div>
  }

  function handleChangeQuantity(e) {
    const quantity = parseInt(e.target.value);
    let validQuantity = null;
    if (isNaN(quantity)) {
      validQuantity = 0;
    } else {
      validQuantity = Math.min(quantity, 100);
    }
    setOrderQuantity(validQuantity);
    setSearchParams({...Object.fromEntries(searchParams) ,quantity: String(validQuantity)})
  }

  function changeOrderQuantityBy(amount: number) {
    const updateQuantity = orderQuantity + amount;
    const validQuantity = Math.max(Math.min(updateQuantity, 100), 0)
    setOrderQuantity(validQuantity);
    setSearchParams({...Object.fromEntries(searchParams) ,quantity: String(validQuantity)})
  }

  function handleOrderQuantityKeyDown(e) {
    if(isNaN(parseInt(e.key))) {
      return;
    }
  }


  return (
    <>
      {
        data && (
          <div>
            <div className={'grid grid-cols-6 gap-16'}>
              <div className={'col-span-2'}>
                <img src={currentImageUrl}
                     className={'w-full aspect-[1/1]'}/>

                <Carousel opts={{
                  align: 'center',
                  dragFree: true
                }}
                          className={'mt-4'}
                >
                  <CarouselContent>
                    {
                      data.productImages!.map(image => (
                        <CarouselItem className={'basis-1/5 cursor-pointer'}
                                      key={image.id}
                                      onClick={() => setCurrentImageUrl(image.asset!.preSignUrl)}
                        >
                          <img src={image.asset.preSignUrl}
                               className={'w-full aspect-[1/1]'}/>
                        </CarouselItem>
                      ))
                    }
                  </CarouselContent>
                  <CarouselPrevious className={'left-3'}/>
                  <CarouselNext className={'right-3'}/>
                </Carousel>
              </div>
              <div className={'col-span-4'}>
                <PageTitle>{data ? data.name : `Loading product ..`}</PageTitle>
                <div className={'mt-4'}>
                  <span className={'font-semibold text-xl'}>Price: 8.000.000</span>
                </div>
                {
                  data.productSizes && data.productSizes.filter(c => c.name !== DEFAULT_SIZE).length > 0 &&  (
                    <div className={'mt-4'}>
                      <div className={'font-semibold'}>Sizes</div>
                      <div className={'flex gap-4 mt-2'}>
                        {
                          data.productSizes.map(size => (
                            <div className={
                              cn('flex gap-2 items-center border-[1px] border-gray-200 rounded-md p-2 cursor-pointer justify-center',
                                {'border-orange-400': selectedSize === size.name},
                                {'border-[2px]': selectedColor === size.name},
                              )
                            }
                                 key={size.id}
                                 onClick={() => {
                                   setSelectedSize(size.name)
                                   setSearchParams({ ...Object.fromEntries(searchParams),size: size.name })
                                 }}
                            >
                              <span>{size.name}</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )
                }
                {
                  data.productColors && data.productColors.filter(c => c.name !== DEFAULT_COLOR).length > 0 &&  (
                    <div className={'mt-4'}>
                      <div className={'font-semibold'}>Colors</div>
                      <div className={'flex gap-4 mt-2'}>
                        {
                          data.productColors.map(color => (
                            <div className={cn(
                                  'flex gap-2 items-center justify-center border-[1px] border-gray-200 rounded-md p-2 cursor-pointer box-border',
                                  {'border-orange-400': selectedColor === color.code},
                                  {'border-[2px]': selectedColor === color.code},
                                )
                                } key={color.id}
                                 onClick={() => {
                                   setSelectedColor(color.code)
                                   setSearchParams({ ...Object.fromEntries(searchParams),color: color.code })
                                 }}
                            >
                              <div style={{backgroundColor: color.code}}
                                   className={'size-4 rounded border-2'}></div>
                              <span>{color.name}</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )
                }
                <div className={'mt-4'}>
                  <div className={'font-semibold'}>Quantity</div>
                  <div className={'flex mt-2 gap-1'}>
                    <Button variant={'outline'}
                            size={'icon'}
                            onClick={() => changeOrderQuantityBy(-1)}
                    >
                      <MinusIcon className={'size-4'}></MinusIcon>
                    </Button>
                    <Input defaultValue={1}
                           className={'w-24 text-center'}
                           value={orderQuantity}
                           onKeyDown={handleOrderQuantityKeyDown}
                           onChange={handleChangeQuantity}
                    />
                    <Button variant={'outline'}
                            size={'icon'}
                            onClick={()=> changeOrderQuantityBy(1)}
                    >
                      <PlusIcon className={'size-4'}/>
                    </Button>
                  </div>
                  {orderQuantity === 100 && <div className={'text-red-500 mt-2'}>You can order maximum 100 items</div>}
                </div>
                <div className={'mt-8 flex gap-4'}>
                  <Button variant={'secondary'}
                          className={'flex gap-2 items-center justify-center'}
                          size={'lg'}>
                    <ShoppingCartIcon className={'size-4'}/>
                    <span>Add to card</span>
                  </Button>
                  <Button className={'bg-amber-600 hover:bg-amber-500'} size={'lg'}>
                    <span>Buy now</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className={'mt-4 font-semibold text-lg'}>Description</div>
            <div
              className={'prose prose-a:text-blue-600 max-w-none mt-4'}
              dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(data.description)}}></div>
          </div>
        )
      }
    </>
  );
}

export default ProductDetailPage;
