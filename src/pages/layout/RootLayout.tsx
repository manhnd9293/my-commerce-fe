import { Outlet } from 'react-router-dom';
import Header from '@/pages/layout/header/Header.tsx';
import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '@/constant/query-key.ts';
import AuthService from '@/services/auth.service.ts';
import { useDispatch } from 'react-redux';
import Utils from '@/utils/utils.ts';
import AppLoading from '@/components/layout/AppLoading.tsx';
import { signIn } from '@/store/user/userSlice.ts';

function RootLayout() {
  const {data, isLoading, isError, error} = useQuery({
    queryKey: [QueryKey.Me],
    queryFn: AuthService.me,
  });
  const dispatch = useDispatch();

  if (isError) {
    Utils.handleError(error);
  }

  if (isLoading) {
    return (
      <AppLoading/>
    )
  }

  if (data) {
    dispatch(signIn(data));
  }

  return (
    <div>
      <Header/>
      <div className={'max-w-screen-2xl px-4 mx-auto py-4'}>
        <Outlet/>
      </div>
    </div>
  );
}

export default RootLayout;