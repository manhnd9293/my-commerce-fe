import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { useDispatch, useSelector } from "react-redux";
import { signOut, UserState } from "@/store/user/userSlice.ts";
import { useNavigate } from "react-router-dom";
import { LogOutIcon, Settings, UserCog } from "lucide-react";

function UserDropdown() {
  const dispatch = useDispatch();
  const currentUser: UserState = useSelector((state) => state.user);

  const navigate = useNavigate();

  function handleSignOut() {
    dispatch(signOut());
    navigate("/sign-in");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={currentUser.avatarUrl || ""} />
          <AvatarFallback>{currentUser.email[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={"end"} side={"bottom"} sideOffset={8}>
        <DropdownMenuLabel>
          <span>My Account</span>
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigate("/my-account")}>
          <div className={"flex gap-2 items-center"}>
            <Settings className={"size-4"} />
            <span>Account setting</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <div className={"flex gap-2 items-center"}>
            <LogOutIcon className={"size-4"} />
            <span>Sign out</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Shop management</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigate("/admin")}>
          <div className={"flex gap-2 items-center"}>
            <UserCog className={"size-4"} />
            <span>Admin page</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
