import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import Autoplay from "embla-carousel-autoplay";
const carouselImages = [
  'https://cf.shopee.vn/file/vn-50009109-3947f098045a2d7e08e5a679fff3d64b_xxhdpi',
  'https://cf.shopee.vn/file/vn-50009109-473bd7441d08aab685ff8b8565d59f64_xxhdpi',
  'https://cf.shopee.vn/file/vn-50009109-eb66403b7abdf73c2701c23397f7d613_xxhdpi',
  'https://cf.shopee.vn/file/vn-50009109-20159ea4ab9606ad244afdcc16a240af_xxhdpi',
  'https://cf.shopee.vn/file/vn-50009109-7e9ea039d64765a29a81957605c8eb69_xxhdpi',
]
function Home() {
  return (
    <div>
      <Carousel opts={{
        loop: true,
        align: 'center'
      }}
                plugins={[
                  Autoplay({
                    delay: 5000,
                    stopOnInteraction: false
                  })
                ]}
      >
        <CarouselContent>
          {
            carouselImages.map(image => (
              <CarouselItem>
                <img src={image}/>
              </CarouselItem>
            ))
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default Home;