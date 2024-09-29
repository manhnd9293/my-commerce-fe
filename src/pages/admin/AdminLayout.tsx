import { Outlet } from "react-router-dom";
import AdminHeader from "@/pages/admin/components/AdminHeader.tsx";
import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/common/constant/query-key.ts";
import AuthService from "@/services/auth.service.ts";
import Utils from "@/utils/utils.ts";
import { useDispatch } from "react-redux";
import { signIn } from "@/store/user/userSlice.ts";
import AppLoading from "@/components/layout/AppLoading.tsx";

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
    <div>
      <AdminHeader />
      <div className={"my-4 max-w-screen-2xl px-4 mx-auto"}>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
