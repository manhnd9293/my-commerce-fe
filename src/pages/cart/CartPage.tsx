import PageTitle from "@/pages/common/PageTitle.tsx";
import { useDispatch, useSelector } from "react-redux";
import { UserDto } from "@/dto/user/user.dto.ts";
import { Button } from "@/components/ui/button.tsx";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Trash2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";

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
      <PageTitle>My Cart</PageTitle>
      <div className={"mt-8 flex gap-4 items-start"}>
        <Table className={"bg-white rounded"}>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead className={"w-[450px] font-bold"}>Item</TableHead>
              <TableHead className={"font-bold"}>Quantity</TableHead>
              <TableHead className={"font-bold"}>Price</TableHead>
              <TableHead className={"font-bold"}>Total</TableHead>
              <TableHead className={"font-bold"}>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUser.cart &&
              currentUser.cart.length > 0 &&
              currentUser.cart.map((item) => {
                return (
                  <TableRow>
                    <TableCell className="font-medium">
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
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className={"flex items-center gap-4"}>
                        <img
                          src={item.productVariant.product?.thumbnailUrl}
                          className={"size-20 shadow-md rounded"}
                        />
                        <div>{item.productVariant.product?.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>{item.quantity}</div>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat().format(
                        item.productVariant.product?.price || 0,
                      )}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat().format(
                        (item.productVariant.product?.price || 0) *
                          item.quantity,
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        onClick={() => onDeleteCartItem(item.id!)}
                        variant={"ghost"}
                        size={"icon"}
                      >
                        <Trash2Icon size={"20"} />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

        <div className={"w-[500px]"}>
          <Card>
            <CardHeader>
              <CardTitle className={"text-2xl font-semibold"}>
                Summary
              </CardTitle>
            </CardHeader>
            <Separator orientation={"horizontal"} className={"my-4"} />
            <CardContent>
              <div className={"flex flex-col space-y-2 mt-4"}>
                <div className={"flex justify-between"}>
                  <div>Subtotal</div>
                  <div>$1000</div>
                </div>
                <div className={"flex justify-between"}>
                  <div>Shipping fee</div>
                  <div>$1000</div>
                </div>
                <div className={"flex justify-between"}>
                  <div>Taxes</div>
                  <div>$1000</div>
                </div>
              </div>
            </CardContent>
            <Separator orientation={"horizontal"} className={"my-4"} />

            <CardFooter>
              <div className={"flex justify-between w-full font-semibold"}>
                <div>Total</div>
                <div className={"text-xl"}>$1000</div>
              </div>
            </CardFooter>
          </Card>

          <Button
            disabled={
              currentUser.cart.filter((item) => item.isCheckedOut).length === 0
            }
            className={"mt-4 bg-amber-600 hover:bg-amber-500 w-full"}
            onClick={() => navigate("/check-out")}
          >
            Go to Check out
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
