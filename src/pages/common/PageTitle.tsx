import { useEffect } from 'react';

function PageTitle({children}: {children: string}) {

  useEffect(() => {
    document.title = children;
  });

  return (
    <div className={'text-xl font-bold'}>{children}</div>
  );
}

export default PageTitle;