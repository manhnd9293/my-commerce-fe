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
import { useDispatch } from "react-redux";
import { signOut } from "@/store/user/userSlice.ts";
import { useNavigate } from "react-router-dom";

function UserDropdown() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSignOut() {
    dispatch(signOut());
    navigate("/sign-in");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={"end"} side={"bottom"} sideOffset={8}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigate("/my-account")}>
          Account setting
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Shop management</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigate("/admin")}>
          Admin page
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
