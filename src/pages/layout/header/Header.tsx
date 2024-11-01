import UserDropdown from "@/pages/layout/header/UserDropdown.tsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useAppSelector } from "@/hooks";
import { HeaderSearch } from "@/pages/layout/header/HeaderSearch.tsx";

function Header() {
  const location = useLocation();
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  function handleClickCartButton() {
    navigate("/cart");
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
            <HeaderSearch />
          </div>
          <div className={"flex items-center gap-4 cursor-pointer"}>
            <div className={"relative"} onClick={handleClickCartButton}>
              {user.cart?.length > 0 && (
                <div
                  className={
                    "absolute right-[-1px] top-0 text-white text-[12px] rounded-[20px] p-2 bg-red-500 font-bold flex items-center justify-center size-5 "
                  }
                >
                  <span>
                    {user.cart.reduce(
                      (total, item) => total + item.quantity,
                      0,
                    )}
                  </span>
                </div>
              )}
              <Button
                variant={"ghost"}
                size={"icon"}
                className={
                  "bg-transparent text-white rounded-full hover:bg-transparent hover:text-white "
                }
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
    </>
  );
}

export default Header;
