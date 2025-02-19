import { Product } from "@/dto/product/product.ts";
import { Card } from "@/components/ui/card.tsx";
import { Link } from "react-router-dom";
import { RoutePath } from "@/router/RoutePath.ts";

function ProductCard(props: { product: Product }) {
  return (
    <Link to={`${RoutePath.ProductDetail}/${props.product.id}`}>
      <Card className={"p-2 cursor-pointer flex flex-col space-y-3 shadow-sm"}>
        <div className={"truncate font-semibold"}>{props.product.name}</div>
        <div
          className={"flex justify-center h-[120px] md:h-[250px] aspect-[1/1]"}
        >
          <img
            className={"object-center object-cover "}
            src={props.product.thumbnailUrl}
          />
        </div>
        <div className={"text-center"}>
          {props.product.price
            ? new Intl.NumberFormat().format(props.product.price)
            : "No Information"}
        </div>
      </Card>
    </Link>
  );
}
export default ProductCard;
