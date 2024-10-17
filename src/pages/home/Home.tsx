import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.tsx";
import Autoplay from "embla-carousel-autoplay";
import ProductRecommend from "@/pages/home/product-recommend/ProductRecommend.tsx";

const carouselImages = [
  "https://cf.shopee.vn/file/sg-11134258-7rdxo-m0csxosccbni1a_xxhdpi",
  "https://cf.shopee.vn/file/sg-11134258-7rdwn-m0csxquf93dx40_xxhdpi",
  "https://cf.shopee.vn/file/vn-11134258-7r98o-lygfmvwtyvtta1_xxhdpi",
  "https://cf.shopee.vn/file/sg-11134258-7rdx9-m0csxkauv8906d_xxhdpi",
  "https://cf.shopee.vn/file/sg-11134258-7rdwo-m0csxlaxd1j2c2_xxhdpi",
];

function Home() {
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
