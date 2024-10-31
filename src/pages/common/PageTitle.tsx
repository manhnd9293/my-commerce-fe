import { useEffect } from "react";

function PageTitle({ children }: { children: string }) {
  useEffect(() => {
    document.title = children;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  return <div className={"text-2xl font-semibold"}>{children}</div>;
}

export default PageTitle;
