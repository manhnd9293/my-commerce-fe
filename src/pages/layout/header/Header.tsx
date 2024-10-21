import UserDropdown from "@/pages/layout/header/UserDropdown.tsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useAppSelector } from "@/hooks";
import { useState } from "react";
import { SignInModal } from "@/components/common/SignInModal.tsx";

function Header() {
  const location = useLocation();
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const [showSignInModal, setShowSignInModal] = useState(false);

  function handleClickCartButton() {
    if (user.id) {
      navigate("/cart");
    } else {
      setShowSignInModal(true);
    }
  }

  return (
    <>
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
              <MagnifyingGlassIcon
                className={"size-5 absolute top-3  right-2"}
              />
            </div>
          </div>
          <div className={"flex items-center gap-4 cursor-pointer"}>
            <div className={"relative"}>
              {user.id && user.cart?.length > 0 && (
                <div
                  className={
                    "absolute right-[-1px] top-[-5px] text-white text-xs rounded-2xl p-1 bg-red-500 font-semibold"
                  }
                >
                  {user.cart.reduce((total, item) => total + item.quantity, 0)}
                </div>
              )}
              <Button
                variant={"ghost"}
                size={"icon"}
                className={
                  "bg-transparent text-white rounded-full hover:bg-transparent hover:text-white "
                }
                onClick={handleClickCartButton}
              >
                <ShoppingCartIcon />
              </Button>
            </div>
            {user.id && <UserDropdown />}
            {!user.id && (
              <Link to={`/sign-in?redirect=${location.pathname}`}>
                <Button variant={"outline"}>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <SignInModal open={showSignInModal} onOpenChange={setShowSignInModal} />
    </>
  );
}

export default Header;
