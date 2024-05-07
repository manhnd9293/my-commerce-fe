import { Outlet } from 'react-router-dom';
import Header from '@/pages/layout/header/Header.tsx';

function RootLayout() {
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