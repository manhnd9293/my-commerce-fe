import { Link } from "react-router-dom";
import UserDropdown from "@/pages/layout/header/UserDropdown.tsx";

function AdminHeader() {
  return (
    <div className={"bg-amber-600"}>
      <div className={"h-14 flex justify-between items-center px-4"}>
        <Link to={"/"}>
          <span className={"text-white font-medium text-xl"}>Admin</span>
        </Link>
        <div className={"flex items-center gap-8"}>
          <UserDropdown />
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
