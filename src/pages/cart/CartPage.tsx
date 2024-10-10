import PageTitle from "@/pages/common/PageTitle.tsx";
import { useDispatch, useSelector } from "react-redux";
import { UserDto } from "@/dto/user/user.dto.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Trash2Icon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { useMutation } from "@tanstack/react-query";
import CartService from "@/services/cart.service.ts";
import {
  removeCartItem,
  updateCartItemCheckOut,
} from "@/store/user/userSlice.ts";
import { useNavigate } from "react-router-dom";
import { CartCheckOutUpdateDto } from "@/dto/cart/cart-check-out-update.dto.ts";
import { RootState } from "@/store";

function CartPage() {
  const currentUser: UserDto = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutate: removeItemMutate } = useMutation({
    mutationFn: CartService.removeCartItem,
    onSuccess: (_data, variables) => {
      const removeId = variables;
      dispatch(removeCartItem(removeId));
    },
  });

  const { mutate: mutateCartItemCheckOut } = useMutation({
    mutationFn: CartService.updateCartItemCheckOut,
    onSuccess: (data) => {
      dispatch(updateCartItemCheckOut(data));
    },
  });

  async function onDeleteCartItem(id: number) {
    removeItemMutate(id);
  }

  return (
    <div>
      <PageTitle>Shopping Cart</PageTitle>
      <div className={"mt-4 flex flex-col gap-4"}>
        {currentUser.cart &&
          currentUser.cart.length > 0 &&
          currentUser.cart.map((item) => {
            return (
              <Card
                key={item.id}
                className={"max-w-[700px] flex items-center px-4 gap-2"}
              >
                <Checkbox
                  checked={item.isCheckedOut}
                  onCheckedChange={(checked) => {
                    const updateData: CartCheckOutUpdateDto = {
                      cartItemId: item.id!,
                      isCheckedOut: !!checked,
                    };
                    mutateCartItemCheckOut(updateData);
                  }}
                />
                <div className={"flex-1"}>
                  <CardHeader>
                    <CardTitle
                      className={"font-semibold text-lg truncate max-w-[500px]"}
                    >
                      {item.productVariant.product?.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className={"flex gap-4 justify-between items-center"}>
                      <div className={"flex flex-col"}>
                        <div className={"flex justify-between"}>
                          <span>Price:</span>
                          <span>
                            {new Intl.NumberFormat().format(
                              item.productVariant.product?.price || 0,
                            )}
                          </span>
                        </div>
                        <div className={"flex justify-between"}>
                          <span>Quantity: </span>
                          <span>{item.quantity}</span>
                        </div>
                        <div className={"flex justify-between"}>
                          <span>Total:</span>
                          <span>
                            {new Intl.NumberFormat().format(
                              (item.productVariant.product?.price || 0) *
                                item.quantity,
                            )}
                          </span>
                        </div>

                        <div className={"flex gap-4 mt-8"}>
                          <Button className={"bg-amber-600 hover:bg-amber-500"}>
                            Buy Now
                          </Button>
                          <Button variant={"destructive"} size={"icon"}>
                            <Trash2Icon
                              onClick={() => onDeleteCartItem(item.id!)}
                            />
                          </Button>
                        </div>
                      </div>
                      <img
                        className={"size-32"}
                        src={item.productVariant.product?.thumbnailUrl}
                      />
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
      </div>

      <Button
        disabled={
          currentUser.cart.filter((item) => item.isCheckedOut).length === 0
        }
        className={"mt-4 bg-amber-600 hover:bg-amber-500"}
        onClick={() => navigate("/check-out")}
      >
        Check out
      </Button>
    </div>
  );
}

export default CartPage;
