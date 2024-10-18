import { useEffect } from "react";

function PageTitle({ children }: { children: string }) {
  useEffect(() => {
    document.title = children;
  });

  return <div className={"text-2xl font-semibold"}>{children}</div>;
}

export default PageTitle;
