import { Link, NavLink } from "react-router-dom";
import UserDropdown from "@/pages/layout/header/UserDropdown.tsx";

const paths = [
  {
    to: "categories",
    name: "Category",
  },
  {
    to: "products",
    name: "Product",
  },
  {
    to: "orders",
    name: "Orders",
  },
];

function AdminHeader() {
  return (
    <div className={"bg-amber-600"}>
      <div
        className={
          "max-w-screen-2xl h-14 flex justify-between items-center px-4 mx-auto"
        }
      >
        <Link to={"/"}>
          <span className={"text-white font-medium text-xl"}>
            My Commerce - Admin
          </span>
        </Link>
        <div className={"flex items-center gap-8"}>
          {paths.map((p, index) => {
            return (
              <NavLink
                key={index}
                to={p.to}
                className={({ isActive }) =>
                  isActive
                    ? "underline text-white font-bold underline-offset-[18px] decoration-4"
                    : ""
                }
              >
                <span className={"text-white font-medium cursor-pointer"}>
                  {p.name}
                </span>
              </NavLink>
            );
          })}
          <UserDropdown />
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
