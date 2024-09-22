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
  "https://cf.shopee.vn/file/vn-50009109-3345c9947aefda2820f25d4a0f788a37_xxhdpi",
  "https://cf.shopee.vn/file/vn-50009109-1c3004dfbba14f5a1cc10a148bb6640b_xxhdpi",
  "https://cf.shopee.vn/file/vn-50009109-fed2b689331aeb813aa4ececbed5748b_xxhdpi",
  "https://cf.shopee.vn/file/vn-50009109-3fcb2fa296c2640136ea49e79fd212c9_xxhdpi",
  "https://cf.shopee.vn/file/vn-50009109-41ff07edc9d41572f5805a6a026f25ae_xxhdpi",
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
            <CarouselItem>
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
