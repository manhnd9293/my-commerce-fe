import { useMutation, useQuery } from "@tanstack/react-query";
import {
  DEFAULT_COLOR,
  DEFAULT_SIZE,
  QueryKey,
} from "@/common/constant/query-key.ts";
import ProductsService from "@/services/products.service.ts";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  LoaderIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/lib/utils.ts";
import CartService from "@/services/cart.service.ts";
import { useDispatch } from "react-redux";
import { addCartItem, updateInstantBuy } from "@/store/user/userSlice.ts";
import { Product } from "@/dto/product/product.ts";
import { ProductVariant } from "@/dto/product/product-variant.ts";
import { RoutePath } from "@/router/RoutePath.ts";
import utils from "@/utils/utils.ts";
import { useAppSelector } from "@/hooks";
import { toast } from "sonner";
import { CartItemDto } from "@/dto/cart/cart-item.dto.ts";
import ProductCard from "@/pages/common/ProductCard.tsx";
import ProductReview from "@/pages/admin/products/detail/ProductReview.tsx";

function ProductDetailPage() {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);

  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState(searchParams.get("color"));
  const [selectedSize, setSelectedSize] = useState(searchParams.get("size"));

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [QueryKey.Product, { id: Number(params.id) }],
    queryFn: () => ProductsService.get(params.id!),
    retry: false,
  });

  const { data: similarProductPage } = useQuery({
    queryKey: [QueryKey.SimilarProducts, { id: params.id }],
    queryFn: () => ProductsService.getSimilarProducts(Number(params.id!), {}),
  });

  function onSuccessAddCartItem(data: CartItemDto) {
    dispatch(addCartItem(data));
    toast("Add item to cart success", {
      description: "Your item have been added to cart",
      action: {
        label: "Go to Cart",
        onClick: () => navigate("/cart"),
      },
      actionButtonStyle: {
        backgroundColor: "#d87606",
        fontWeight: "bold",
      },
      closeButton: true,
    });
  }

  const {
    mutate: mutateAddCartItem,
    isPending: pendingAddCartItem,
    isSuccess,
    isError: isAddCartItemError,
    error: errorAddCartItem,
  } = useMutation({
    mutationFn: CartService.addCartItem,
    onSuccess: onSuccessAddCartItem,
  });

  if (isError) {
    utils.handleError(error);
  }

  function getSelectProductVariant(): ProductVariant | undefined {
    if (!product) return;
    const productSize = product.productSizes?.find(
      (size) => size.name === selectedSize,
    );
    const productColor = product.productColors?.find(
      (color) => color.code === selectedColor,
    );
    const productVariant = product.productVariants?.find(
      (pv) =>
        pv.productSizeId === (productSize?.id || null) &&
        pv.productColorId === (productColor?.id || null),
    );

    return productVariant;
  }

  function handleAddItemToCart() {
    const productVariant = getSelectProductVariant();
    if (!productVariant) {
      return;
    }
    if (!user.id) {
      productVariant.product = structuredClone(product);
      const data: CartItemDto = {
        id: `ci_${productVariant.id}`,
        productVariantId: productVariant.id!,
        productVariant: structuredClone(productVariant),
        quantity: orderQuantity,
        isCheckedOut: true,
      };
      onSuccessAddCartItem(data);
      return;
    }

    mutateAddCartItem({
      productVariantId: productVariant.id! as number,
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
  }

  function changeOrderQuantityBy(amount: number) {
    const updateQuantity = orderQuantity + amount;
    const validQuantity = Math.max(Math.min(updateQuantity, 100), 0);
    setOrderQuantity(validQuantity);
  }

  function handleOrderQuantityKeyDown(e) {
    if (isNaN(parseInt(e.key))) {
      return;
    }
  }

  function handleBuyNow() {
    const productVariant = getSelectProductVariant();
    if (!productVariant) return;
    productVariant.product = structuredClone(product);
    dispatch(
      updateInstantBuy({
        productVariantId: productVariant.id!,
        productVariant,
        quantity: orderQuantity,
        isCheckedOut: true,
        id: "1",
      }),
    );
    navigate(
      `/check-out?instant-buy=true&productId=${product?.id}&productVariantId=${productVariant.id}`,
    );
  }

  return (
    <>
      {product && (
        <div>
          <div
            className={
              "flex flex-col gap-4 md:flex-row md:gap-16 md:items-start"
            }
          >
            <div className={"w-full md:w-[420px]"}>
              <img
                src={currentImageUrl}
                className={"aspect-[1/1] object-cover object-center"}
              />
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
                        setCurrentImageUrl(image.asset!.preSignUrl || "")
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
            <div
              className={
                "bg-white p-4 rounded-2xl shadow-sm w-full md:w-[600px]"
              }
            >
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
                            "flex gap-2 items-center border-[1px] border-gray-200 rounded-md py-1 px-2 cursor-pointer justify-center min-w-12",
                            { "border-orange-400": selectedSize === size.name },
                            { "border-[2px]": selectedSize === size.name },
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
                            "flex gap-2 items-center justify-center border-[1px] border-gray-200 rounded-md py-1 px-2 cursor-pointer box-border",
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
                  {pendingAddCartItem && <LoaderIcon className={"size-4"} />}
                  {!pendingAddCartItem && (
                    <ShoppingCartIcon className={"size-4"} />
                  )}
                  <span>Add to card</span>
                </Button>

                <Button className={""} size={"lg"} onClick={handleBuyNow}>
                  <span>Buy now</span>
                </Button>
              </div>
            </div>
          </div>
          <div className={"mt-4"}>
            <ProductDescription product={product} />
          </div>

          <div className={"mt-4"}>
            <ProductReview productId={Number(product.id!)} />
          </div>

          <div className={"mt-4"}>
            <div className={"text-lg font-semibold"}>Similar Products</div>
            <div
              className={
                "grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5 md:gap-4 mt-4"
              }
            >
              {similarProductPage?.data &&
                similarProductPage?.data.map((product) => (
                  <ProductCard
                    key={product.id}
                    onClick={() =>
                      navigate(`${RoutePath.ProductDetail}/${product.id}`)
                    }
                    product={product}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProductDescription(props: { product: Product }) {
  const [collapse, setCollapse] = useState(true);

  return (
    <div className={"bg-white rounded-2xl shadow-sm p-4"}>
      <div className={"font-semibold text-lg"}>Description</div>
      <div
        className={cn(
          {
            "h-[300px]": collapse,
          },
          "overflow-hidden",
        )}
      >
        <div
          className={cn("prose prose-a:text-blue-600 max-w-none mt-4")}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(props.product.description),
          }}
        />
      </div>

      <div className={"text-center mt-4"}>
        <Button
          size={"sm"}
          variant={"outline"}
          onClick={() => setCollapse((value) => !value)}
        >
          {collapse ? `Show more` : "Show less"}
        </Button>
      </div>
    </div>
  );
}

export default ProductDetailPage;
