import { Outlet } from "react-router-dom";
import Header from "@/pages/layout/header/Header.tsx";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/common/constant/query-key.ts";
import AuthService from "@/services/auth.service.ts";
import { useDispatch } from "react-redux";
import AppLoading from "@/components/layout/AppLoading.tsx";
import { signIn } from "@/store/user/userSlice.ts";
import Footer from "@/pages/layout/footer/Footer.tsx";
import ChatWidget from "@/pages/layout/components/chat-widget/ChatWidget.tsx";
import { io } from "socket.io-client";
import { useEffect } from "react";

console.debug(
  `create socket connection, access token = ${localStorage.getItem("accessToken")}`,
);
export const socket = io(import.meta.env.VITE_SERVER_URL, {
  autoConnect: false,
  withCredentials: true,
  auth: {
    Authorization: localStorage.getItem("accessToken"),
  },
});

function RootLayout() {
  const dispatch = useDispatch();

  const { data: currentUserData, isLoading } = useQuery({
    queryKey: [QueryKey.Me],
    queryFn: AuthService.me,
    retry: false,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
  const isAuth = !!currentUserData?.id;

  useEffect(() => {
    console.debug({ isAuth });
    if (!isAuth) {
      return;
    }
    socket.auth = {
      Authorization: localStorage.getItem("accessToken"),
    };
    socket.connect();
    console.debug("connect socket");

    return () => {
      if (!isAuth) {
        return;
      }
      console.debug("disconnect socket");
      socket.disconnect();
    };
  }, [isAuth]);

  if (isLoading) {
    return <AppLoading />;
  }

  if (currentUserData) {
    dispatch(signIn(currentUserData));
  }

  return (
    <div className={"bg-gray-50 min-h-screen flex flex-col"}>
      <Header />
      <div
        className={
          "max-w-screen-2xl px-4 mx-auto py-4 w-full flex-1 md:min-h-[850px]"
        }
      >
        <Outlet />
        {currentUserData && <ChatWidget />}
      </div>
      <Footer />
    </div>
  );
}

export default RootLayout;
