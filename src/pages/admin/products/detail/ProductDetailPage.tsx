import {useQuery} from "@tanstack/react-query";
import {QueryKey} from "@/constant/query-key.ts";
import ProductsService from "@/services/products.service.ts";
import {useParams} from "react-router-dom";
import PageTitle from "@/pages/common/PageTitle.tsx";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {useEffect, useState} from "react";
import DOMPurify from "dompurify";

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
            <div className={'grid grid-cols-6 gap-4'}>
              <div className={'col-span-2'}>
                <img src={currentImageUrl}
                     className={'w-full aspect-[1/1]'}/>

                <Carousel opts={{
                  align: 'center'
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