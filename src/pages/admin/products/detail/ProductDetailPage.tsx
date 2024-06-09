import {useQuery} from "@tanstack/react-query";
import {DEFAULT_COLOR, DEFAULT_SIZE, QueryKey} from "@/constant/query-key.ts";
import ProductsService from "@/services/products.service.ts";
import {useParams} from "react-router-dom";
import PageTitle from "@/pages/common/PageTitle.tsx";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {useEffect, useState} from "react";
import DOMPurify from "dompurify";
import {Button} from "@/components/ui/button.tsx";
import {MinusIcon, PlusIcon, ShoppingCartIcon} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";

function ProductDetailPage() {
  const params = useParams();
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
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
  }, [data])

  if (isLoading) {
    return <div>Loading product ... </div>
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
                            <div className={'flex gap-2 items-center border-[1px] border-gray-200 rounded-md p-2 cursor-pointer justify-center'} key={size.id}>
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
                            <div className={'flex gap-2 items-center justify-center border-[1px] border-gray-200 rounded-md p-2 cursor-pointer'} key={color.id}>
                              <div style={{backgroundColor: color.code}} className={'size-4 rounded border-2'}></div>
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
                  <div className={'flex mt-2'}>
                    <Button variant={'outline'} size={'icon'}>
                      <MinusIcon className={'size-4'}></MinusIcon>
                    </Button>
                    <Input type={'number'}
                           defaultValue={1}
                           className={'w-24 text-center'}/>
                    <Button variant={'outline'} size={'icon'}>
                      <PlusIcon className={'size-4'}/>
                    </Button>
                  </div>
                </div>
                <div className={'mt-8 flex gap-4'}>
                  <Button variant={'secondary'} className={'flex gap-2 items-center justify-center'} size={'lg'}>
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