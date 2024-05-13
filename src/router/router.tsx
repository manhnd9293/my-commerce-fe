import { createBrowserRouter } from 'react-router-dom';
import ProductCreatePage from '@/pages/admin/products/create/ProductCreatePage.tsx';
import SignIn from '@/pages/sign-in/SignIn.tsx';
import RootLayout from '@/pages/layout/RootLayout.tsx';
import Home from '@/pages/home/Home.tsx';
import CategoryCreatePage from '@/pages/admin/categories/create/CategoryCreatePage.tsx';
import AdminLayout from '@/pages/admin/AdminLayout.tsx';
import CategoriesList from '@/pages/admin/categories/list/CategoriesList.tsx';
import TestPage from '@/pages/test/TestPage.tsx';
import { UpdateCategoryPage } from '@/pages/admin/categories/update/UpdateCategoryPage.tsx';
import SignUp from '@/pages/sign-up/SignUp.tsx';

export const router = createBrowserRouter([

  {
    path: '/sign-in',
    element: <SignIn/>
  },
  {
    path: '/sign-up',
    element: <SignUp/>
  },
  {
    path: '/admin',
    element: <AdminLayout/>,
    children: [
      {
        path: 'products/create',
        element: <ProductCreatePage/>
      },
      {
        path: 'categories',
        children: [
          {
            index: true,
            element: <CategoriesList/>,
          },
          {
            path: 'create',
            element: <CategoryCreatePage/>
          },
          {
            path: ':categoryId',
            element: <UpdateCategoryPage/>
          }
        ]
      },
    ]
  },
  {
    path: '/',
    element: <RootLayout/>,
    children: [
      {
        element: <Home/>,
        index: true
      },
      {
        path: 'test',
        element: <TestPage/>
      }

    ]
  }

])