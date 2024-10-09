import PageTitle from "@/pages/common/PageTitle.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { useDispatch, useSelector } from "react-redux";
import { updateAvatar, UserState } from "@/store/user/userSlice.ts";
import { Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useMutation } from "@tanstack/react-query";
import UsersService from "@/services/users.service.ts";

function GeneralInformationPage() {
  const currentUser: UserState = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [avatarFile, setAvatarFile] = useState<BlobPart | null>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { mutate: uploadAvatar, isPending } = useMutation({
    mutationFn: () => UsersService.uploadAvatar(avatarFile as File),
    onSuccess: (data) => {
      dispatch(updateAvatar(data));
      setOpenModal(false);
    },
  });

  function selectFile() {
    const avaInput = document.getElementById("ava-input");
    avaInput.click();
  }

  return (
    <div className={"max-w-5xl"}>
      <PageTitle>General information</PageTitle>
      <div className={"mt-4 flex"}>
        <div className={"flex-1"}>
          <div>Data</div>
        </div>
        <div className={"relative"}>
          <div className={"text-lg font-semibold"}>Avatar</div>
          <Avatar className={"w-32 h-32 mt-4"}>
            <AvatarImage src={currentUser.avatarUrl || ""} />
            <AvatarFallback className={"text-4xl"}>
              {currentUser.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div
            className={
              "size-5 absolute top-[150px] left-[110px] cursor-pointer"
            }
          >
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Pencil className={"size-5"} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align={"end"}>
                <DropdownMenuItem onClick={selectFile}>
                  Upload a photo ...
                </DropdownMenuItem>
                <DropdownMenuItem>Remove Avatar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <input
              type={"file"}
              multiple={false}
              id={"ava-input"}
              className={"hidden"}
              onChange={(event) => {
                const files = event.target.files;
                if (!files || files.length === 0) {
                  return;
                }
                setAvatarFile(files[0]);
                setOpenModal(true);
              }}
            />
          </div>
        </div>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Avatar</DialogTitle>
          </DialogHeader>
          <Avatar className={"w-56 h-56 mt-4 mx-auto"}>
            <AvatarImage src={URL.createObjectURL(new Blob([avatarFile!]))} />
          </Avatar>
          <DialogFooter>
            <Button
              variant={"secondary"}
              onClick={() => {
                setAvatarFile(null);
                setOpenModal(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => uploadAvatar()} disabled={isPending}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GeneralInformationPage;
