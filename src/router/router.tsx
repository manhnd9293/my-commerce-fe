import { createBrowserRouter } from 'react-router-dom';
import ProductCreatePage from '@/pages/admin/create-product/ProductCreatePage.tsx';
import SignIn from '@/pages/sign-in/SignIn.tsx';
import RootLayout from '@/pages/layout/RootLayout.tsx';
import Home from '@/pages/home/Home.tsx';

export const router = createBrowserRouter([
  {
    path: '/admin',
    children: [
      {
        path: 'product/create',
        element: <ProductCreatePage/>
      }
    ]
  },
  {
    path: '/sign-in',
    element: <SignIn/>
  },
  {
    path: '/',
    element: <RootLayout/>,
    children: [
      {
        element: <Home/>,
        index: true
      }
    ]
  }

])