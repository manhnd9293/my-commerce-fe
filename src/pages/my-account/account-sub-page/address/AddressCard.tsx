import { UserAddressDto } from "@/dto/user/address/user-address.dto.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Ellipsis, Pencil, Trash2Icon } from "lucide-react";

export function AddressCard(props: {
  address: UserAddressDto;
  onSelectUpdate?: () => void;
  onSelectDelete?: () => void;
  hideAction?: boolean;
}) {
  return (
    <Card className={"shadow-md max-w-lg mt-2"}>
      <CardHeader>
        <CardTitle
          className={"text-lg font-semibold flex items-center justify-between"}
        >
          <span>{props.address.name}</span>

          {!props.hideAction && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Ellipsis className={"size-5"} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align={"center"}>
                <DropdownMenuItem
                  className={"flex items-center gap-2"}
                  onClick={props.onSelectUpdate}
                >
                  <Pencil className={"size-4"} />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={"flex items-center gap-2 text-red-500"}
                  onClick={props.onSelectDelete}
                >
                  <Trash2Icon className={"size-4"} />
                  <span> Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{`${props.address.noAndStreet}, ${props.address.commune}, ${props.address.district}, ${props.address.province}`}</p>
      </CardContent>
    </Card>
  );
}
