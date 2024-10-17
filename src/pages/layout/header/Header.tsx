import UserDropdown from "@/pages/layout/header/UserDropdown.tsx";
import { Link } from "react-router-dom";
import { ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

function Header() {
  return (
    <div className={"bg-amber-600"}>
      <div
        className={
          "max-w-screen-2xl h-14 flex justify-between items-center px-4 mx-auto"
        }
      >
        <div className={"flex items-center flex-1"}>
          <Link to={"/"}>
            <span className={"text-white font-medium text-xl"}>
              My Commerce
            </span>
          </Link>
          <div className={"relative w-[500px] ml-24"}>
            <Input placeholder={"Search products ..."} />
            <MagnifyingGlassIcon className={"size-5 absolute top-3  right-2"} />
          </div>
        </div>
        <div className={"flex items-center gap-4"}>
          <Link to={"/cart"}>
            <Button
              variant={"ghost"}
              size={"icon"}
              className={"bg-transparent text-white rounded-full"}
            >
              <ShoppingCartIcon />
            </Button>
          </Link>
          <UserDropdown />
        </div>
      </div>
    </div>
  );
}

export default Header;
