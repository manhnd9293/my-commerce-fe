import { Button } from "@/components/ui/button.tsx";
import { Edit2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductColor } from "@/dto/product/product-color.ts";
import { cn } from "@/lib/utils.ts";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
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

const blankFormState = {
  id: null,
  name: "",
  code: "#FFFFFF",
  index: -1,
};

export const colorFormSchema = z.object({
  id: z.string().optional().nullable(),
  index: z.number().optional().nullable(),
  name: z
    .string({ message: "Please provide color name" })
    .min(1, { message: "Please provide color name" }),
  code: z
    .string({ message: "Please provide color" })
    .min(1, { message: "Please select product color" }),
});

interface ProductColorFormProps {
  onAddColor: (values: z.infer<typeof colorFormSchema>) => void;
  onUpdateColor: (values: z.infer<typeof colorFormSchema>) => void;
  onDeleteColor: (index: number) => void;
  initialColors?: Pick<ProductColor, "name" | "code" | "id">[];
}

function ProductColorForm({
  onAddColor,
  initialColors,
  onUpdateColor,
  onDeleteColor,
}: ProductColorFormProps) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] =
    useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number>(-1);

  const colorFormSchemaRefine = colorFormSchema
    .refine(
      (data) => {
        return !initialColors?.some(
          (color, index) =>
            color.name.toLowerCase() === data.name.toLowerCase() &&
            index !== data.index,
        );
      },
      {
        message: "Product color name existed",
        path: ["name"],
      },
    )
    .refine(
      (data) =>
        !initialColors?.some(
          (color, index) =>
            color.code.toLowerCase() === data.code.toLowerCase() &&
            index !== data.index,
        ),
      {
        message: "Product color existed",
        path: ["code"],
      },
    );

  const [initialFormValue, setInitialFormValue] =
    useState<z.infer<typeof colorFormSchemaRefine>>(blankFormState);

  const colorForm = useForm<z.infer<typeof colorFormSchemaRefine>>({
    resolver: zodResolver(colorFormSchemaRefine),
    defaultValues: blankFormState,
    values: initialFormValue,
  });

  function handleAddColor(values: z.infer<typeof colorFormSchemaRefine>) {
    onAddColor(values);
    setOpenDialog(false);
    colorForm.reset();
  }

  function handleUpdateColor(values: z.infer<typeof colorFormSchemaRefine>) {
    onUpdateColor(values);
    setOpenDialog(false);
    colorForm.reset();
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
        Add color
      </Button>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Product Color</DialogTitle>
            <DialogDescription>Add or update product color</DialogDescription>
            <FormProvider {...colorForm}>
              <FormField
                control={colorForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Color name"
                        {...field}
                        className={"max-w-xs"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={colorForm.control}
                name="code"
                render={() => (
                  <FormItem>
                    <FormLabel>Pick color</FormLabel>
                    <FormDescription>
                      Pick color for your product
                    </FormDescription>
                    <FormControl>
                      <HexColorPicker
                        color={colorForm.getValues("code")}
                        onChange={(value) => colorForm.setValue("code", value)}
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
                    onClick={colorForm.handleSubmit(handleAddColor)}
                  >
                    Add
                  </Button>
                )}
                {isUpdate && (
                  <Button
                    type={"button"}
                    className={""}
                    onClick={colorForm.handleSubmit(handleUpdateColor)}
                  >
                    Update
                  </Button>
                )}
                <Button
                  type={"button"}
                  variant={"outline"}
                  onClick={() => {
                    colorForm.reset();
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
              <TableHead>Code</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialColors ? (
              initialColors.map((color, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium cursor-pointer">
                    <div>{color.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className={"flex gap-4 items-center"}>
                      <div
                        style={{ backgroundColor: color.code }}
                        className={cn("size-4 rounded")}
                      ></div>
                      <span>{color.code.toUpperCase()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={"flex items-center gap-4"}>
                      <Edit2Icon
                        className={"size-4 cursor-pointer"}
                        onClick={() => {
                          setInitialFormValue({
                            name: color.name,
                            code: color.code,
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
                <span>Do you want to delete this product color ?</span>
                <div
                  style={{
                    backgroundColor: initialColors?.[deleteIndex]?.code,
                  }}
                  className={cn("size-4 rounded")}
                />
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Do you really want to delete color{" "}
              {initialColors?.[deleteIndex]?.name} from your product ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDeleteColor(deleteIndex);
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

export default ProductColorForm;
