import UserDropdown from '@/pages/layout/header/UserDropdown.tsx';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className={'bg-amber-600'}>
      <div className={'max-w-screen-2xl h-14 flex justify-between items-center px-4 mx-auto'}>
        <Link to={'/'}>
          <span className={'text-white font-medium text-xl'}>My Commerce</span>
        </Link>
        <div className={'flex items-center'}>
          <UserDropdown/>
        </div>
      </div>
    </div>
  );
}

export default Header;