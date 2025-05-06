import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Rating } from "@smastrom/react-rating";
import { Button } from "@/components/ui/button.tsx";
import React from "react";
import { Product } from "@/dto/product/product.ts";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import Utils from "@/utils/utils.ts";
import { Input } from "@/components/ui/input.tsx";
import NewProductImageList from "@/pages/admin/products/form/NewProductImageList.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ProductRatingService from "@/services/product-rating.service.ts";
import { QueryKey } from "@/common/constant/query-key.ts";

const allowTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export interface RatingDialogProps {
  setShowRatingDialog: (v: boolean | ((p: boolean) => boolean)) => void;
  showRatingDialog: boolean;
  selectedProduct: Product;
}

export const productRatingSchema = z.object({
  rate: z.number().min(1, { message: "Rating is required" }),
  textContent: z
    .string()
    .min(1, { message: "Rating comment is required" })
    .max(10000, { message: "Max rating content is 10,000 characters" }),
  productRatingMedia: z
    .instanceof(FileList)
    .refine(
      (files) => Array.from(files).every((file) => file instanceof File),
      {
        message: "Expect a file",
      },
    )
    .refine(
      (files) =>
        Array.from(files).every((file) => allowTypes.includes(file.type)),
      {
        message: `Only these file types are allowed: ${allowTypes.map((t) => t.replace("image", "."))}`,
      },
    )
    .optional(),
});

function RatingDialog({
  setShowRatingDialog,
  showRatingDialog,
  selectedProduct,
}: RatingDialogProps) {
  const ratingForm = useForm<z.infer<typeof productRatingSchema>>({
    resolver: zodResolver(productRatingSchema),
    defaultValues: {
      rate: 0,
      textContent: "",
    },
  });
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationKey: ["create-rating-product"],
    mutationFn: (variables: z.infer<typeof productRatingSchema>) => {
      return ProductRatingService.rateProduct(selectedProduct.id, variables);
    },
  });

  async function onSubmit(values: z.infer<typeof productRatingSchema>) {
    console.log({ values });
    await mutateAsync(values);
    setShowRatingDialog(false);
    await queryClient.invalidateQueries({
      queryKey: [QueryKey.RatingPending],
    });
  }

  if (isError) {
    console.log(error);
  }

  return (
    <Dialog onOpenChange={setShowRatingDialog} open={showRatingDialog}>
      <DialogContent className="flex flex-col overflow-y-auto max-h-screen lg:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className={"overflow-ellipsis overflow-x-clip"}>
            Review {selectedProduct?.name}
          </DialogTitle>
          <DialogDescription>
            Let us know about your experience with the product !
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 flex-1">
          <div
            className={"size-32 aspect-[1/1] flex justify-center items-center"}
          >
            <img
              className={"text-center w-full aspect-[1/1] object-cover"}
              src={selectedProduct?.thumbnailUrl}
            />
          </div>
          <div className={"flex-1"}>
            <FormProvider {...ratingForm}>
              <FormField
                name={"rate"}
                control={ratingForm.control}
                render={() => (
                  <FormItem>
                    <FormLabel>Rate</FormLabel>
                    <FormControl>
                      <Rating
                        value={ratingForm.getValues("rate")}
                        onChange={(rateValue: number) => {
                          ratingForm.setValue("rate", rateValue);
                        }}
                        style={{ maxWidth: 200, margin: "auto" }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name={"textContent"}
                control={ratingForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name={"productRatingMedia"}
                control={ratingForm.control}
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Product Image / Videos</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        placeholder="Product Images"
                        className="w-64"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(event) => {
                          const addedFiles = event.target.files;
                          if (!addedFiles) {
                            return;
                          }
                          const imageFiles =
                            ratingForm.getValues("productRatingMedia");
                          ratingForm.setValue(
                            "productRatingMedia",
                            Utils.mergeFileLists(imageFiles, addedFiles),
                          );
                          console.log(
                            ratingForm.getValues("productRatingMedia"),
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <NewProductImageList
                      imageFiles={ratingForm.getValues("productRatingMedia")}
                      onDelete={(index) => {
                        const newImages =
                          ratingForm.getValues("productRatingMedia"); // for add image file to productForm
                        const newImagesArray = Array.from(newImages!).filter(
                          (_file, idx) => idx !== index,
                        );
                        ratingForm.setValue(
                          "productRatingMedia",
                          Utils.createFileList(newImagesArray),
                        );
                      }}
                    />
                  </FormItem>
                )}
              />
            </FormProvider>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant={"secondary"}
            onClick={() => setShowRatingDialog(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={ratingForm.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? "Rating" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RatingDialog;
