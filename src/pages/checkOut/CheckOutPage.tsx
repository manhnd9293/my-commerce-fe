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
import { RootState } from "@/store";
import {
  DeliveryAddressForm,
  deliveryFormSchema,
} from "@/pages/my-account/account-sub-page/address/DeliveryAddressForm.tsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

function CheckOutPage() {
  const currentUser: UserState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const instantBuy = searchParams.get("instant-buy") === "true";

  const [done, setDone] = useState<boolean>(false);
  const [selectAddress, _] = useState(
    currentUser.addresses && currentUser.addresses.length > 0
      ? currentUser.addresses[0]
      : null,
  );

  const deliveryAddressForm = useForm<z.infer<typeof deliveryFormSchema>>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      province: "",
      phone: "",
      district: "",
      commune: "",
      noAndStreet: "",
      customerName: "",
    },
  });

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
    ? [JSON.parse(localStorage.getItem("instantBuy")!)]
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

  async function handleCreateOrder() {
    const validateDeliveryAddress = await deliveryAddressForm.trigger();
    if (!validateDeliveryAddress) {
      return;
    }
    const deliveryAddress = deliveryAddressForm.getValues();
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
      customerName: deliveryAddress.customerName,
      phone: deliveryAddress.phone,
      province: deliveryAddress.province,
      district: deliveryAddress.district,
      commune: deliveryAddress.commune,
      noAndStreet: deliveryAddress.noAndStreet,
    });
  }

  return (
    <div>
      <PageTitle>Place order</PageTitle>
      <div className={"flex items-start gap-4 mt-4 justify-between"}>
        <div className={"flex-1"}>
          <div className={"bg-white p-4 rounded-xl border"}>
            <div className={"flex gap-4 items-center"}>
              <span className={"text-lg font-semibold"}>Delivery Address</span>
              {currentUser.id && (
                <Button variant={"outline"} size={"sm"}>
                  Change
                </Button>
              )}
            </div>
            {selectAddress && (
              <div className={"mt-4"}>
                <div className={"font-semibold"}>{selectAddress.name}</div>
                <div
                  className={"mt-2"}
                >{`${selectAddress.noAndStreet}, ${selectAddress.commune}, ${selectAddress.district}, ${selectAddress.province}`}</div>
              </div>
            )}
            {!currentUser.id && (
              <div className={"mt-4"}>
                <DeliveryAddressForm form={deliveryAddressForm} />
              </div>
            )}
          </div>

          <div className={"bg-white mt-4 p-4 rounded-xl border"}>
            <div className={"flex gap-4 items-center"}>
              <span className={"text-lg font-semibold"}>Payment method</span>
            </div>
            <div className={"mt-4"}>
              <div className={"mt-2"}>Cash on delivery</div>
            </div>
          </div>
        </div>
        <div className={"w-1/2 bg-white p-2 border rounded-xl"}>
          <div className={"text-xl font-semibold"}>Order Summary</div>
          <Table className={"rounded-xl p-2"}>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead className={"text-center"}>Unit price</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkOutItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className={"w-40"}>
                    <img
                      src={item.productVariant.product!.thumbnailUrl}
                      className={"w-20 h-20 shadow-md rounded-xl"}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <span>{item.productVariant.product!.name}</span>
                  </TableCell>

                  <TableCell className={"text-center"}>
                    {new Intl.NumberFormat().format(
                      item.productVariant.product!.price,
                    )}
                  </TableCell>
                  <TableCell className={"text-center"}>
                    {item.quantity}
                  </TableCell>
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
                <TableCell colSpan={4} className={"text-right"}>
                  Total
                </TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat().format(totalCheckOut)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          <div className={"flex gap-4 mt-4 justify-end"}>
            <Button variant={"secondary"} onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              className={" flex items-center gap-2"}
              onClick={handleCreateOrder}
              disabled={isPending}
            >
              <span>Place the order</span>
              {isPending && <LoaderIcon />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOutPage;
