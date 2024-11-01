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
import { ChevronUp, LogOutIcon, Settings, UserCog } from "lucide-react";
import { RootState } from "@/store";
import { SidebarMenuButton } from "@/components/ui/sidebar.tsx";

function AdminUserDropdown() {
  const dispatch = useDispatch();
  const currentUser: UserState = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  function handleSignOut() {
    dispatch(signOut());
    navigate("/sign-in");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className={"flex items-center gap-4 p-6"}>
          <Avatar>
            <AvatarImage src={currentUser.avatarUrl || ""} />
            <AvatarFallback>
              {currentUser.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className={"font-semibold"}>{currentUser.fullName}</div>
            <div>{currentUser.email}</div>
          </div>
          <ChevronUp className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={"top"}
        className={"w-[--radix-popper-anchor-width]"}
      >
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
        <DropdownMenuItem onClick={() => navigate("/")}>
          <div className={"flex gap-2 items-center"}>
            <UserCog className={"size-4"} />
            <span>Front Store</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AdminUserDropdown;
