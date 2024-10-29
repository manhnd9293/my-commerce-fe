import PageTitle from "@/pages/common/PageTitle.tsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks";
import UsersService from "@/services/users.service.ts";
import { QueryKey } from "@/common/constant/query-key.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { useState } from "react";
import { Ellipsis, Loader2Icon, Pencil, Plus, Trash2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { AddressForm } from "@/pages/my-account/account-sub-page/address/AddressForm.tsx";
import { UserAddressDto } from "@/dto/user/address/user-address.dto.ts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { toast } from "sonner";
import { AddressCard } from "@/pages/my-account/account-sub-page/address/AddressCard.tsx";

function AddressPage() {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateAddress, setUpdateAddress] = useState<UserAddressDto>();
  const [showConfirmDeleteModal, setShowConfirmDelete] = useState(false);
  const [deleteAddressId, setDeleteAddressId] = useState<number>();

  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.user);

  const { data, isLoading } = useQuery({
    queryKey: [QueryKey.UserAddress, user.id],
    queryFn: UsersService.getUserAddresses,
  });

  const { mutate: deleteAddress, isPending: isPendingDeleteAddress } =
    useMutation({
      mutationFn: UsersService.deleteUserAddress,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [QueryKey.UserAddress, user.id],
        });
        toast("Delete address success", {
          description: "Your address has been deleted",
          closeButton: true,
        });
      },
    });

  if (isLoading) {
    return "Loading user address ...";
  }

  function handleDeleteAddress() {
    deleteAddress(deleteAddressId!);
  }

  return (
    <div>
      <PageTitle>My Addresses</PageTitle>
      {data && (
        <div className={"mt-4"}>
          {data.map((address) => {
            return (
              <AddressCard
                key={address.id}
                address={address}
                onSelectUpdate={() => {
                  setShowAddressModal(true);
                  setIsUpdate(true);
                  setUpdateAddress(structuredClone(address));
                }}
                onSelectDelete={() => {
                  setDeleteAddressId(address.id!);
                  setShowConfirmDelete(true);
                }}
              />
            );
          })}
        </div>
      )}

      <div className={"mt-4"}>
        <Button
          onClick={() => {
            setIsUpdate(false);
            setShowAddressModal(true);
          }}
          className={""}
        >
          <Plus />
          <span className={"ml-2"}>Add address</span>
        </Button>
        <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isUpdate ? "Update address" : "New address"}
              </DialogTitle>
              <DialogDescription>
                {isUpdate ? `Update your address` : `Add a new address`}
              </DialogDescription>
            </DialogHeader>
            <div>
              <AddressForm
                onSuccess={async () => {
                  setShowAddressModal(false);
                  await queryClient.invalidateQueries({
                    queryKey: [QueryKey.UserAddress, user.id],
                  });
                }}
                onCancel={() => setShowAddressModal(false)}
                isUpdate={isUpdate}
                initialValues={isUpdate ? updateAddress : undefined}
              />
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={showConfirmDeleteModal}
          onOpenChange={setShowConfirmDelete}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure to delete this address ?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                address.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setShowConfirmDelete(false);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAddress}
                disabled={isPendingDeleteAddress}
              >
                {!isPendingDeleteAddress && "Confirm"}
                {isPendingDeleteAddress && <Loader2Icon />}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default AddressPage;
