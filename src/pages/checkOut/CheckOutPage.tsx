import PageTitle from "@/pages/common/PageTitle.tsx";
import { useDispatch, useSelector } from "react-redux";
import { CartItemDto } from "@/dto/cart/cart-item.dto.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import OrdersService from "@/services/orders.service.ts";
import { CreateOrderItemDto } from "@/dto/orders/create-order-item.dto.ts";
import { useState } from "react";
import { LoaderIcon } from "lucide-react";
import { removeCartItem, UserState } from "@/store/user/userSlice.ts";

function CheckOutPage() {
  const currentUser: UserState = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [done, setDone] = useState<boolean>(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const instantBuy =
    searchParams.get("instant-buy") === "true" && currentUser.instantBuy;

  const {
    mutate: createOrder,
    isError: isCreateOrderError,
    error: createOrderError,
    isPending,
  } = useMutation({
    mutationFn: OrdersService.create,
    onSuccess: () => {
      checkOutItems.forEach(({ id }) => {
        dispatch(removeCartItem(id));
      });
      setDone(true);
    },
  });

  const checkOutItems: CartItemDto[] = instantBuy
    ? [currentUser.instantBuy!]
    : currentUser.cart.filter((item) => item.isCheckedOut);

  const totalCheckOut = checkOutItems.reduce((total, item) => {
    total += item.quantity * item.productVariant.product!.price;
    return total;
  }, 0);

  if (done) {
    return <div>Your order have been created</div>;
  }

  if (isCreateOrderError) {
    return (
      <div>
        <div>Some thing went wrong when create order</div>
        {createOrderError.toString()}
      </div>
    );
  }
  return (
    <div>
      <PageTitle>Check out</PageTitle>
      <div className={"max-w-4xl"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Image</TableHead>
              <TableHead className={"text-center"}>Unit price</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checkOutItems.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">
                  <span>{item.productVariant.product!.name}</span>
                </TableCell>
                <TableCell>
                  <img
                    src={item.productVariant.product!.thumbnailUrl}
                    className={"size-16"}
                  />
                </TableCell>
                <TableCell className={"text-center"}>
                  {new Intl.NumberFormat().format(
                    item.productVariant.product!.price,
                  )}
                </TableCell>
                <TableCell className={"text-center"}>{item.quantity}</TableCell>
                <TableCell className={"text-right"}>
                  {new Intl.NumberFormat().format(
                    item.productVariant.product!.price * item.quantity,
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5} className={"text-right"}>
                Total
              </TableCell>
              <TableCell className="text-right">
                {new Intl.NumberFormat().format(totalCheckOut)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        <div className={"flex gap-4 mt-4 justify-end"}>
          <Button variant={"secondary"} onClick={() => navigate("/cart")}>
            Back to cart
          </Button>
          <Button
            className={
              "bg-amber-600 hover:bg-amber-500 flex items-center gap-2"
            }
            onClick={() =>
              createOrder({
                orderItems: checkOutItems.map((item) => {
                  const createOrderItemDto: CreateOrderItemDto = {
                    cartItemId: item.id!,
                    quantity: item.quantity,
                    unitPrice: item.productVariant.product!.price,
                    productVariantId: item.productVariantId,
                  };
                  return createOrderItemDto;
                }),
              })
            }
            disabled={isPending}
          >
            <span>Order</span>
            {isPending && <LoaderIcon />}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CheckOutPage;
