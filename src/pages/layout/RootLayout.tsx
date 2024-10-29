import { Outlet } from "react-router-dom";
import Header from "@/pages/layout/header/Header.tsx";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/common/constant/query-key.ts";
import AuthService from "@/services/auth.service.ts";
import { useDispatch } from "react-redux";
import AppLoading from "@/components/layout/AppLoading.tsx";
import { signIn } from "@/store/user/userSlice.ts";
import Footer from "@/pages/layout/footer/Footer.tsx";

function RootLayout() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [QueryKey.Me],
    queryFn: AuthService.me,
    retry: false,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
  const dispatch = useDispatch();

  if (isLoading) {
    return <AppLoading />;
  }

  if (data) {
    dispatch(signIn(data));
  }

  return (
    <div className={"bg-gray-50 min-h-screen flex flex-col"}>
      <Header />
      <div className={"max-w-screen-2xl px-4 mx-auto py-4 flex-1"}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default RootLayout;
