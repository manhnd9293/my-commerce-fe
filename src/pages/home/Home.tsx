import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.tsx";
import Autoplay from "embla-carousel-autoplay";
import ProductRecommend from "@/pages/home/product-recommend/ProductRecommend.tsx";
import { useEffect } from "react";

const carouselImages = [
  "https://cf.shopee.vn/file/vn-11134258-7ras8-m1zex3slvicb3e_xxhdpi",
  "https://cf.shopee.vn/file/sg-11134258-7reob-m20gzx7ko2d39c_xxhdpi",
  "https://cf.shopee.vn/file/sg-11134258-7reor-m1xtdaqjrfjq17_xxhdpi",
  "https://cf.shopee.vn/file/sg-11134258-7reqp-m1xtdd8649xb41_xxhdpi",
];

function Home() {
  useEffect(() => {
    document.title = "My commerce";
  }, []);
  return (
    <div>
      <Carousel
        opts={{
          loop: true,
          align: "center",
        }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
          }),
        ]}
      >
        <CarouselContent>
          {carouselImages.map((image) => (
            <CarouselItem key={image}>
              <img src={image} className={"w-full h-94 aspect-[900/277]"} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={"left-3"} />
        <CarouselNext className={"right-3"} />
      </Carousel>

      <div className={"text-lg font-bold mt-4"}>Categories</div>

      <ProductRecommend />
    </div>
  );
}

export default Home;
