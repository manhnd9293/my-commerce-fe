import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';

function Header() {
  return (
    <div className={'bg-amber-600'}>
      <div className={'max-w-screen-2xl h-12 flex justify-between items-center px-4 mx-auto'}>
        <div className={'text-white font-bold text-2xl'}>My-App</div>
        <div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png"/>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}

export default Header;