import PageTitle from "@/pages/common/PageTitle.tsx";
import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/common/constant/query-key.ts";
import { useNavigate, useParams } from "react-router-dom";
import OrdersService from "@/services/orders.service.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Button } from "@/components/ui/button.tsx";

function OrderDetail() {
  const params = useParams();
  const orderId = params.id;
  const { data: order, isLoading } = useQuery({
    queryKey: [QueryKey.Order, orderId!],
    queryFn: () => OrdersService.getOrderDetail(Number(orderId)),
  });

  const navigate = useNavigate();

  if (isLoading) {
    return `Loading order detail ...`;
  }

  return (
    <div>
      <PageTitle>Order detail</PageTitle>
      {order && (
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
              {order.orderItems.map((item, index) => (
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
                <TableCell colSpan={5} className={"text-right"}>
                  Total
                </TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat().format(order.total)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          <div className={"flex gap-4 mt-4 justify-end"}>
            <Button variant={"secondary"} onClick={() => navigate("..")}>
              Back to order list
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetail;
