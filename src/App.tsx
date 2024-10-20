import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router/router.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "@/components/ui/toaster.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}></RouterProvider>
        <Toaster />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
