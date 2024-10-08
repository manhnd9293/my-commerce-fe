import { NavLink, Outlet } from "react-router-dom";

const menuItems = [
  {
    label: "General information",
    path: "",
  },
  {
    label: "Orders",
    path: "my-order",
  },
];

function MyAccountPage() {
  return (
    <div>
      <div className={"flex mt-4 gap-4"}>
        <div className={"flex flex-col gap-2 w-56 border-[1px] rounded"}>
          {menuItems.map((item, index) => {
            return (
              <NavLink
                key={index}
                to={item.path}
                end
                className={({ isActive }) =>
                  isActive
                    ? "bg-gray-300 px-2 py-1 transition"
                    : " px-2 py-1 transition"
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MyAccountPage;
