import { Outlet, useNavigate } from 'react-router-dom';
import Header from '@/pages/layout/header/Header.tsx';
import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '@/constant/query-key.ts';
import AuthService from '@/services/auth.service.ts';
import { useDispatch } from 'react-redux';
import Notification from '@/utils/notification.tsx';
import Utils from '@/utils/utils.ts';
import AppLoading from '@/components/layout/AppLoading.tsx';
import { signIn } from '@/store/user/userSlice.ts';

function RootLayout() {
  const {data, isLoading, isError, error} = useQuery({
    queryKey: [QueryKey.Me],
    queryFn: AuthService.me,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (isError) {
    Notification.error(`Fail to load user data: ${Utils.getErrorMessage(error)}`);
    navigate('/sign-in');
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
      <div className={'mt-4 max-w-screen-2xl px-4 mx-auto'}>
        <Outlet/>
      </div>
    </div>
  );
}

export default RootLayout;