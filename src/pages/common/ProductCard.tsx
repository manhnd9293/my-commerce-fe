import { Product } from "@/dto/product/product.ts";
import { Card } from "@/components/ui/card.tsx";

function ProductCard(props: { onClick: () => void; product: Product }) {
  return (
    <Card
      className={"p-2 cursor-pointer flex flex-col space-y-3 shadow-sm"}
      onClick={props.onClick}
    >
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
  );
}
export default ProductCard;
