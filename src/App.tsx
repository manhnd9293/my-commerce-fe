import './App.css'
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router/router.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '@/store';

const queryClient = new QueryClient();

function App() {

  return (
    <Provider store={store} ><QueryClientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
    </QueryClientProvider></Provider>
  )
}

export default App
