import { useMutation, useQuery } from "@tanstack/react-query";
import { DEFAULT_COLOR, DEFAULT_SIZE, QueryKey } from "@/constant/query-key.ts";
import ProductsService from "@/services/products.service.ts";
import { useParams, useSearchParams } from "react-router-dom";
import PageTitle from "@/pages/common/PageTitle.tsx";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.tsx";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button.tsx";
import {
  LoaderCircle,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/lib/utils.ts";
import CartService from "@/services/cart.service.ts";
import { useDispatch } from "react-redux";
import { addCartItem } from "@/store/user/userSlice.ts";

function ProductDetailPage() {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const [orderQuantity, setOrderQuantity] = useState(
    searchParams.get("quantity") ? parseInt(searchParams.get("quantity")!) : 1,
  );
  const [selectedColor, setSelectedColor] = useState(searchParams.get("color"));
  const [selectedSize, setSelectedSize] = useState(searchParams.get("size"));
  const dispatch = useDispatch();

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [QueryKey.Product, { id: Number(params.id) }],
    queryFn: () => ProductsService.get(params.id!),
  });

  const {
    mutate: mutateAddCartItem,
    isPending: pendingAddCartItem,
    isSuccess,
    isError: isAddCartItemError,
    error: errorAddCartItem,
  } = useMutation({
    mutationFn: CartService.addCartItem,
    onSuccess: (data) => {
      dispatch(addCartItem(data));
    },
  });

  function handleAddItemToCart() {
    if (!product) return;

    const productSize = product.productSizes?.find(
      (size) => size.name === selectedSize,
    );
    const productColor = product.productColors?.find(
      (color) => color.code === selectedColor,
    );
    const productVariant = product.productVariants?.find(
      (pv) =>
        pv.productSizeId === productSize?.id &&
        pv.productColorId === productColor?.id,
    );
    productVariant &&
      mutateAddCartItem({
        productVariantId: productVariant.id!,
        quantity: orderQuantity,
      });
  }

  useEffect(() => {
    if (!product) {
      return;
    }
    // @ts-ignore
    setCurrentImageUrl(product.productImages[0]!.asset.preSignUrl);

    if (
      product.productSizes &&
      product.productSizes.length > 0 &&
      !searchParams.get("size")
    ) {
      setSelectedSize(product.productSizes[0].name);
    }
    if (
      product.productColors &&
      product.productColors.length > 0 &&
      !searchParams.get("color")
    ) {
      setSelectedColor(product.productColors[0].code);
    }
  }, [product]);

  if (isLoading) {
    return <div>Loading product ... </div>;
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
    setSearchParams({
      ...Object.fromEntries(searchParams),
      quantity: String(validQuantity),
    });
  }

  function changeOrderQuantityBy(amount: number) {
    const updateQuantity = orderQuantity + amount;
    const validQuantity = Math.max(Math.min(updateQuantity, 100), 0);
    setOrderQuantity(validQuantity);
    setSearchParams({
      ...Object.fromEntries(searchParams),
      quantity: String(validQuantity),
    });
  }

  function handleOrderQuantityKeyDown(e) {
    if (isNaN(parseInt(e.key))) {
      return;
    }
  }

  return (
    <>
      {product && (
        <div>
          <div className={"grid grid-cols-6 gap-16"}>
            <div className={"col-span-2"}>
              <img src={currentImageUrl} className={"w-full aspect-[1/1]"} />

              <Carousel
                opts={{
                  align: "center",
                  dragFree: true,
                }}
                className={"mt-4"}
              >
                <CarouselContent>
                  {product.productImages!.map((image) => (
                    <CarouselItem
                      className={"basis-1/5 cursor-pointer"}
                      key={image.id}
                      onClick={() =>
                        setCurrentImageUrl(image.asset!.preSignUrl)
                      }
                    >
                      <img
                        src={image.asset.preSignUrl}
                        className={"w-full aspect-[1/1]"}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className={"left-3"} />
                <CarouselNext className={"right-3"} />
              </Carousel>
            </div>
            <div className={"col-span-4"}>
              <PageTitle>
                {product ? product.name : `Loading product ..`}
              </PageTitle>
              <div className={"mt-4"}>
                <span className={"font-semibold text-xl"}>
                  Price:{" "}
                  {new Intl.NumberFormat().format(product.price) ||
                    "Coming soon"}
                </span>
              </div>
              {product.productSizes &&
                product.productSizes.filter((c) => c.name !== DEFAULT_SIZE)
                  .length > 0 && (
                  <div className={"mt-4"}>
                    <div className={"font-semibold"}>Sizes</div>
                    <div className={"flex gap-4 mt-2"}>
                      {product.productSizes.map((size) => (
                        <div
                          className={cn(
                            "flex gap-2 items-center border-[1px] border-gray-200 rounded-md p-2 cursor-pointer justify-center",
                            { "border-orange-400": selectedSize === size.name },
                            { "border-[2px]": selectedColor === size.name },
                          )}
                          key={size.id}
                          onClick={() => {
                            setSelectedSize(size.name);
                            setSearchParams({
                              ...Object.fromEntries(searchParams),
                              size: size.name,
                            });
                          }}
                        >
                          <span>{size.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              {product.productColors &&
                product.productColors.filter((c) => c.name !== DEFAULT_COLOR)
                  .length > 0 && (
                  <div className={"mt-4"}>
                    <div className={"font-semibold"}>Colors</div>
                    <div className={"flex gap-4 mt-2"}>
                      {product.productColors.map((color) => (
                        <div
                          className={cn(
                            "flex gap-2 items-center justify-center border-[1px] border-gray-200 rounded-md p-2 cursor-pointer box-border",
                            {
                              "border-orange-400": selectedColor === color.code,
                            },
                            { "border-[2px]": selectedColor === color.code },
                          )}
                          key={color.id}
                          onClick={() => {
                            setSelectedColor(color.code);
                            setSearchParams({
                              ...Object.fromEntries(searchParams),
                              color: color.code,
                            });
                          }}
                        >
                          <div
                            style={{ backgroundColor: color.code }}
                            className={"size-4 rounded border-2"}
                          />
                          <span>{color.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              <div className={"mt-4"}>
                <div className={"font-semibold"}>Quantity</div>
                <div className={"flex mt-2 gap-1"}>
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={() => changeOrderQuantityBy(-1)}
                  >
                    <MinusIcon className={"size-4"}></MinusIcon>
                  </Button>
                  <Input
                    defaultValue={1}
                    className={"w-24 text-center"}
                    value={orderQuantity}
                    onKeyDown={handleOrderQuantityKeyDown}
                    onChange={handleChangeQuantity}
                  />
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={() => changeOrderQuantityBy(1)}
                  >
                    <PlusIcon className={"size-4"} />
                  </Button>
                </div>
                {orderQuantity === 100 && (
                  <div className={"text-red-500 mt-2"}>
                    You can order maximum 100 items
                  </div>
                )}
              </div>
              <div className={"mt-8 flex gap-4"}>
                <Button
                  variant={"secondary"}
                  className={"flex gap-2 items-center justify-center"}
                  size={"lg"}
                  disabled={orderQuantity === 0 || pendingAddCartItem}
                  onClick={handleAddItemToCart}
                >
                  <ShoppingCartIcon className={"size-4"} />
                  <span>Add to card</span>
                  {pendingAddCartItem && <LoaderCircle size={"4"} />}
                </Button>

                <Button
                  className={"bg-amber-600 hover:bg-amber-500"}
                  size={"lg"}
                >
                  <span>Buy now</span>
                </Button>
              </div>
            </div>
          </div>
          <div className={"mt-4 font-semibold text-lg"}>Description</div>
          <div
            className={"prose prose-a:text-blue-600 max-w-none mt-4"}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(product.description),
            }}
          ></div>
        </div>
      )}
    </>
  );
}

export default ProductDetailPage;
