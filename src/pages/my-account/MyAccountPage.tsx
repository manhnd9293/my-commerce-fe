import { NavLink, Outlet } from "react-router-dom";
import {
  CircleUser,
  CreditCard,
  History,
  MapPin,
  ShoppingCart,
  Star,
} from "lucide-react";

const menuItems = [
  {
    label: "General information",
    path: "",
    icon: <CircleUser />,
  },
  {
    label: "Address",
    path: "my-address",
    icon: <MapPin />,
  },
  // {
  //   label: "Payments",
  //   path: "my-payments",
  //   icon: <CreditCard />,
  // },
  // {
  //   label: "Orders",
  //   path: "my-orders",
  //   icon: <ShoppingCart />,
  // },

  {
    label: "Purchase history",
    path: "purchase-history",
    icon: <History />,
  },
  {
    label: "Rating",
    path: "product-rating",
    icon: <Star />,
  },
];

function MyAccountPage() {
  return (
    <div>
      <div className={"flex mt-4 gap-4 items-start"}>
        <div className={"flex flex-col w-64 border-[1px] rounded bg-white"}>
          {menuItems.map((item, index) => {
            return (
              <NavLink
                key={index}
                to={item.path}
                end
                className={({ isActive }) =>
                  isActive ? "bg-gray-300 transition" : "transition"
                }
              >
                <div
                  className={"flex items-center gap-4 py-3 px-4 justify-start"}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </NavLink>
            );
          })}
        </div>
        <div className={"flex-1"}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MyAccountPage;
