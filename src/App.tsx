import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router/router.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router}></RouterProvider>
          <Toaster position={"top-right"} offset={64} />
        </QueryClientProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
