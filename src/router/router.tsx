import { createBrowserRouter } from 'react-router-dom';
import SignIn from '@/pages/sign-in/SignIn.tsx';
import RootLayout from '@/pages/layout/RootLayout.tsx';
import Home from '@/pages/home/Home.tsx';
import CategoryCreatePage from '@/pages/admin/categories/create/CategoryCreatePage.tsx';
import AdminLayout from '@/pages/admin/AdminLayout.tsx';
import CategoriesList from '@/pages/admin/categories/list/CategoriesList.tsx';
import TestPage from '@/pages/test/TestPage.tsx';
import { UpdateCategoryPage } from '@/pages/admin/categories/update/UpdateCategoryPage.tsx';
import SignUp from '@/pages/sign-up/SignUp.tsx';
import ProductCreatePage from '@/pages/admin/products/new/ProductCreatePage.tsx';
import ProductListPage from '@/pages/admin/products/list/ProductListPage.tsx';
import ProductUpdatePage from '@/pages/admin/products/update/ProductUpdatePage.tsx';
import {RoutePath} from "@/router/RoutePath.ts";
import ProductDetailPage from "@/pages/admin/products/detail/ProductDetailPage.tsx";
import Cv from "@/pages/cv/cv.tsx";

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
    path: '/cv',
    element: <Cv/>
  },
  {
    path: '/admin',
    element: <AdminLayout/>,
    children: [
      {
        path: 'products',
        children: [
          {
            path: 'new',
            element: <ProductCreatePage/>
          },
          {
            index: true,
            element: <ProductListPage/>
          },
          {
            path: ':id',
            element: <ProductUpdatePage/>
          },
        ]
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
        path: `${RoutePath.ProductDetail}/:id`,
        element: <ProductDetailPage/>
      },
      {
        path: 'test',
        element: <TestPage/>
      }
    ]
  }

])