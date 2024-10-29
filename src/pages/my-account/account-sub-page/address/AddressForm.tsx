import { UserAddressDto } from "@/dto/user/address/user-address.dto.ts";
import { useMutation } from "@tanstack/react-query";
import UsersService from "@/services/users.service.ts";
import { UpdateUserAddressDto } from "@/dto/user/address/update-user-address.dto.ts";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "This field is required" })
    .max(500, { message: "This field is maximum 500 character" }),
  province: z
    .string()
    .min(1, { message: "This field is required" })
    .max(500, { message: "This field is maximum 500 character" }),
  district: z
    .string()
    .min(1, { message: "This field is required" })
    .max(500, { message: "This field is maximum 500 character" }),
  commune: z
    .string()
    .min(1, { message: "This field is required" })
    .max(500, { message: "This field is maximum 500 character" }),
  noAndStreet: z
    .string()
    .min(1, { message: "This field is required" })
    .max(500, { message: "This field is maximum 500 character" }),
});

interface AddressFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isUpdate: boolean;
  initialValues?: UserAddressDto;
}

export function AddressForm({
  onSuccess,
  onCancel,
  isUpdate,
  initialValues,
  withActions,
}: AddressFormProps) {
  const { mutate: addUserAddress, isPending: isPendingAddAddress } =
    useMutation({
      mutationFn: UsersService.addUserAddress,
      onSuccess: async () => {
        toast("Add address success", {
          description: "Your address is added successfully",
          closeButton: true,
        });
        onSuccess && onSuccess();
      },
    });

  const { mutate: updateUserAddress, isPending: isPendingUpdateAddress } =
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: UpdateUserAddressDto }) =>
        UsersService.updateUserAddress(id, data),
      onSuccess: async () => {
        toast("Update address success", {
          description: "Your address is update successfully",
          closeButton: true,
        });
        onSuccess && onSuccess();
      },
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      province: "",
      district: "",
      commune: "",
      noAndStreet: "",
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    isUpdate
      ? updateUserAddress({ id: initialValues!.id!, data: values })
      : addUserAddress(values);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your home or company ...?" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <FormControl>
                  <Input placeholder="Province" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District</FormLabel>
                <FormControl>
                  <Input placeholder="District" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="commune"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commune</FormLabel>
                <FormControl>
                  <Input placeholder="Commune" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="noAndStreet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No and Street</FormLabel>
                <FormControl>
                  <Input placeholder="No And Street" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className={"flex items-center justify-center gap-4 mt-4"}>
        <Button variant={"secondary"} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPendingAddAddress || isPendingUpdateAddress}
          className={""}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isUpdate ? `Update` : `Add`}
        </Button>
      </div>
    </div>
  );
}
