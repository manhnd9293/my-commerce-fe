import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress.tsx';

function AppLoading() {
  const [progress, setProgress] = useState(30)

  useEffect( () => {
    const timer = setTimeout(() => setProgress((state)=> state + 60), 500)
    return () => clearTimeout(timer)
  }, [])
  return (
    <div className={'absolute top-0 left-0 right-0 bottom-0 w-[100-vh] text-white flex flex-col gap-4 items-center justify-center z-20 bg-white'}>
      <div className={'text-3xl text-amber-600'}>My commerce</div>
      <Progress value={progress} className={'w-72 h-2 *:bg-amber-600'} />
    </div>
  );
}

export default AppLoading;