import { NavLink, Outlet } from "react-router-dom";
import AdminHeader from "@/pages/admin/components/AdminHeader.tsx";
import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/common/constant/query-key.ts";
import AuthService from "@/services/auth.service.ts";
import Utils from "@/utils/utils.ts";
import { useDispatch } from "react-redux";
import { signIn } from "@/store/user/userSlice.ts";
import AppLoading from "@/components/layout/AppLoading.tsx";
import { Gauge, Package, Shapes, ShoppingCartIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { Button } from "@/components/ui/button.tsx";

const paths = [
  {
    to: "dashboard",
    name: "Dashboard",
    icon: <Gauge />,
  },
  {
    to: "categories",
    name: "Categories",
    icon: <Shapes />,
  },
  {
    to: "products",
    name: "Products",
    icon: <Package />,
  },
  {
    to: "orders",
    name: "Orders",
    icon: <ShoppingCartIcon />,
  },
];

function AdminLayout() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [QueryKey.Me],
    queryFn: AuthService.me,
  });
  const dispatch = useDispatch();

  if (isError) {
    Utils.handleError(error);
  }

  if (isLoading) {
    return <AppLoading />;
  }

  if (data) {
    dispatch(signIn(data));
  }

  return (
    <div className={"bg-gray-50 min-h-screen"}>
      <AdminHeader />
      <div className={"flex gap-16 min-h-screen"}>
        <div
          className={"flex flex-col gap-4 bg-white pt-6 px-4 border-r-[1px]"}
        >
          <TooltipProvider>
            {paths.map((p, index) => {
              return (
                <NavLink
                  to={p.to}
                  key={index}
                  className={({ isActive }) =>
                    isActive ? "bg-gray-100 rounded" : " rounded"
                  }
                >
                  <Tooltip>
                    <TooltipTrigger>
                      <Button size={"sm"} variant={"ghost"}>
                        <span className={"font-light"}>{p.icon}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side={"right"}>{p.name}</TooltipContent>
                    {/*<div>{p.name}</div>*/}
                  </Tooltip>
                </NavLink>
              );
            })}
          </TooltipProvider>
        </div>
        <div className={"mt-4"}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
