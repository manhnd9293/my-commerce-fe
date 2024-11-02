import { NavLink, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/common/constant/query-key.ts";
import AuthService from "@/services/auth.service.ts";
import Utils from "@/utils/utils.ts";
import { useDispatch } from "react-redux";
import { signIn } from "@/store/user/userSlice.ts";
import AppLoading from "@/components/layout/AppLoading.tsx";
import {
  LayoutDashboard,
  Package,
  Shapes,
  ShoppingCartIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar.tsx";
import AdminUserDropdown from "@/pages/layout/header/AdminUserDropdown.tsx";

const paths = [
  {
    to: "",
    name: "Dashboard",
    icon: <LayoutDashboard />,
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
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div
              className={
                "text-lg font-bold bg-amber-600 text-white p-2 m-[-8px]"
              }
            >
              MyCommerce Admin
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Store management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {paths.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.to}
                          className={"flex items-center gap-1"}
                        >
                          {item.icon}
                          <span className={"text-sm"}>{item.name}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <AdminUserDropdown />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <main className={"ml-4 p-4"}>
          {/*<SidebarTrigger />*/}
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}

export default AdminLayout;
