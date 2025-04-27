import { Button } from "@/components/ui/button.tsx";
import { Edit2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
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
import { ProductSize } from "@/dto/product/product-size.ts";

const blankFormState = {
  id: null,
  name: "",
  index: -1,
};

export const sizeFormSchema = z.object({
  id: z.string().optional().nullable(),
  index: z.number().optional().nullable(),
  name: z
    .string({ message: "Please provide size name" })
    .min(1, { message: "Please provide color name" }),
});

interface ProductColorFormProps {
  onAddSize: (values: z.infer<typeof sizeFormSchema>) => void;
  onUpdateSize: (values: z.infer<typeof sizeFormSchema>) => void;
  onDeleteSize: (index: number) => void;
  initialSizes?: Pick<ProductSize, "name" | "id">[];
}

function ProductSizeForm({
  onAddSize,
  initialSizes,
  onUpdateSize,
  onDeleteSize,
}: ProductColorFormProps) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] =
    useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number>(-1);

  const sizeFormSchemaRefine = sizeFormSchema.refine(
    (data) => {
      return !initialSizes?.some(
        (color, index) =>
          color.name.toLowerCase() === data.name.toLowerCase() &&
          index !== data.index,
      );
    },
    {
      message: "Product size name existed",
      path: ["name"],
    },
  );

  const [initialFormValue, setInitialFormValue] =
    useState<z.infer<typeof sizeFormSchemaRefine>>(blankFormState);

  const sizeForm = useForm<z.infer<typeof sizeFormSchemaRefine>>({
    resolver: zodResolver(sizeFormSchemaRefine),
    defaultValues: blankFormState,
    values: initialFormValue,
  });

  function handleAddColor(values: z.infer<typeof sizeFormSchemaRefine>) {
    onAddSize(values);
    setOpenDialog(false);
    sizeForm.reset();
  }

  function handleUpdateColor(values: z.infer<typeof sizeFormSchemaRefine>) {
    onUpdateSize(values);
    setOpenDialog(false);
    sizeForm.reset();
  }

  return (
    <div>
      <Button
        variant={"outline"}
        className={"flex items-center w-48"}
        type={"button"}
        onClick={() => {
          setIsUpdate(false);
          setInitialFormValue(blankFormState);
          setOpenDialog(true);
        }}
      >
        <PlusIcon className={"size-4 mr-2 font-bold"} />
        Add Size
      </Button>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Product Size</DialogTitle>
            <DialogDescription>
              {isUpdate ? "Update" : "Add"} product size
            </DialogDescription>
            <FormProvider {...sizeForm}>
              <FormField
                control={sizeForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Size name"
                        {...field}
                        className={"max-w-xs"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormProvider>
            <DialogFooter>
              <div className={"flex gap-2"}>
                {!isUpdate && (
                  <Button
                    type={"button"}
                    className={""}
                    onClick={sizeForm.handleSubmit(handleAddColor)}
                  >
                    Add
                  </Button>
                )}
                {isUpdate && (
                  <Button
                    type={"button"}
                    className={""}
                    onClick={sizeForm.handleSubmit(handleUpdateColor)}
                  >
                    Update
                  </Button>
                )}
                <Button
                  type={"button"}
                  variant={"outline"}
                  onClick={() => {
                    sizeForm.reset();
                    setOpenDialog(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className={"mt-4"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>

              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialSizes ? (
              initialSizes.map((color, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium cursor-pointer">
                    <div>{color.name}</div>
                  </TableCell>

                  <TableCell>
                    <div className={"flex items-center gap-4"}>
                      <Edit2Icon
                        className={"size-4 cursor-pointer"}
                        onClick={() => {
                          setInitialFormValue({
                            name: color.name,
                            id: color.id,
                            index: index,
                          });
                          setIsUpdate(true);
                          setOpenDialog(true);
                        }}
                      ></Edit2Icon>
                      <Trash2Icon
                        className={"size-4 cursor-pointer"}
                        onClick={() => {
                          setDeleteIndex(index);
                          setOpenDeleteConfirmDialog(true);
                        }}
                      ></Trash2Icon>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className={"text-center"} colSpan={3}>
                  No color data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={openDeleteConfirmDialog}
        onOpenChange={setOpenDeleteConfirmDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className={"flex gap-2 items-center flex-wrap"}>
                <span>Do you want to delete this product size ?</span>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Do you really want to delete size{" "}
              {initialSizes?.[deleteIndex]?.name} from your product ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDeleteSize(deleteIndex);
                setDeleteIndex(-1);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ProductSizeForm;
