import { z } from "zod";
import { Product } from "@/dto/product/product.ts";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "@/common/constant/query-key.ts";
import CategoriesService from "@/services/categories.service.ts";
import Utils from "@/utils/utils.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Editor } from "@tinymce/tinymce-react";
import React, { useRef, useState } from "react";
import notification from "@/utils/notification.tsx";
import ProductImageList from "@/pages/admin/products/form/ProductImageList.tsx";
import ProductsService from "@/services/products.service.ts";
import ProductVariantForm from "@/pages/admin/products/form/product-variant/ProductVariantForm.tsx";
import { productFormSchema } from "@/pages/admin/products/form/product-form-schema.ts";
import { ProductOption } from "@/pages/admin/products/form/product-variant/product-option-form/product-options-form-types.ts";
import { ProductVariant } from "@/dto/product/product-variant.ts";

// const allowTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

interface ProductFormProps {
  initialData?: Product;
}

function ProductForm(props: ProductFormProps) {
  const navigate = useNavigate();
  const { initialData } = props;
  const isUpdate = !!initialData;
  const productId = initialData?.id;

  const [productVariants, setProductVariants] = useState<ProductVariant[]>(
    initialData?.productVariants || [],
  );
  const [productOptions, setProductOptions] = useState<ProductOption[]>(
    initialData?.productOptions || [],
  );

  const queryClient = useQueryClient();
  const editorRef = useRef(null);
  const productForm = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          categoryId: initialData.categoryId,
        }
      : {
          name: "",
          categoryId: undefined,
        },
  });

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [QueryKey.Categories],
    queryFn: CategoriesService.getAll,
  });

  const { isPending, mutateAsync: mutateUpdate } = useMutation({
    mutationFn: (variables: z.infer<typeof productFormSchema>) =>
      ProductsService.update(initialData!.id!, {
        ...variables,
        productVariants,
        productOptions,
      }),
    onSuccess: async () => {
      notification.success("Update product success");
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.Product, { id: initialData?.id }],
      });
      navigate("/admin/products");
    },
    onError: (error) => {
      Utils.handleError(error);
    },
  });

  const { mutateAsync: mutateCreate } = useMutation({
    mutationFn: ProductsService.create,
    onSuccess: () => {
      notification.success("Create product success");
      navigate("/admin/products");
    },
    onError: (error) => {
      Utils.handleError(error);
    },
  });

  const { mutateAsync: mutateProductMedia, isPending: updatingMedia } =
    useMutation({
      mutationFn: async (updateIds: string[]) => {
        if (productId) {
          await ProductsService.updateProductMedia(productId, updateIds);
        } else {
          console.log("Handle update new product");
        }
      },
      onSuccess: async () => {
        productId &&
          (await queryClient.invalidateQueries({
            queryKey: [QueryKey.Product, { id: productId }],
          }));
      },
    });

  const { mutateAsync: deleteMedia, isPending: deletingMedia } = useMutation({
    mutationFn: (assetIds: string[]) =>
      ProductsService.deleteProductMedia(productId!, assetIds),
  });

  async function onSubmit(values: z.infer<typeof productFormSchema>) {
    if (isUpdate) {
      await mutateUpdate(values);
    } else {
      await mutateCreate({ ...values, productOptions, productVariants });
    }
  }

  function handleChangePrice(e: React.ChangeEvent<HTMLInputElement>) {
    const targetValue = e.target.value;

    if (isNaN(parseInt(targetValue))) {
      const oldPrice = productForm.getValues("price");
      productForm.setValue("price", targetValue !== "" ? oldPrice : undefined);
      return;
    }
    productForm.setValue("price", parseInt(targetValue));
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    Utils.handleError(error);
    return <div>Fail to load categories</div>;
  }

  async function handleUpdateMedia(assetIds: string[]) {
    if (productId) {
      await mutateProductMedia(assetIds);
    } else {
      productForm.setValue("productMedia", assetIds);
    }
  }

  async function handleDeleteMedia(assetIds: string[]) {
    if (productId) {
      await deleteMedia(assetIds);
    } else {
      const oldValues = productForm.getValues("productMedia") || [];
      productForm.setValue(
        "productMedia",
        oldValues.filter((id) => !assetIds.includes(id)),
      );
    }
  }

  function handleUpdateOptions(options: ProductOption[]) {
    setProductOptions(options);
  }

  function handleUpdateProductVariants(updateVariants: ProductVariant[]) {
    setProductVariants(updateVariants);
  }

  return (
    <div className={"mt-4 max-w-3xl"}>
      <FormProvider {...productForm}>
        <form
          onSubmit={productForm.handleSubmit(onSubmit)}
          className={"space-y-8"}
        >
          <div className={"bg-white rounded-md py-2 px-4 shadow-md space-y-4"}>
            <FormField
              control={productForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={"font-semibold"}>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Product name"
                      {...field}
                      className={"max-w-lg mt-1"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={productForm.control}
              render={() => (
                <FormItem>
                  <FormLabel className={"font-semibold"}>Description</FormLabel>
                  <Editor
                    apiKey={import.meta.env.VITE_TINY_EDITOR_API_KEY}
                    onInit={(_evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    value={productForm.getValues("description")}
                    init={editorConfig}
                    onEditorChange={(newValue) => {
                      productForm.setValue("description", newValue, {
                        shouldValidate: true,
                      });
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={productForm.control}
              name="productMedia"
              render={() => (
                <FormItem>
                  <ProductImageList
                    productId={initialData?.id}
                    initialValues={initialData?.productImages || []}
                    onUpdateMedia={handleUpdateMedia}
                    onDeleteMedia={handleDeleteMedia}
                    isUpdating={updatingMedia}
                    isDeleting={deletingMedia}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={productForm.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className={"mt-4"}>
                  <FormLabel className={"font-semibold"}>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories &&
                        categories.map((category) => {
                          return (
                            <SelectItem
                              key={category.id}
                              value={String(category.id)}
                            >
                              {category.name}
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className={"bg-white rounded-md p-4 shadow-md"}>
            <div className={"font-semibold"}>Pricing</div>
            <FormField
              control={productForm.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={"font-light"}>Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Price"
                      {...field}
                      className={"w-64"}
                      value={productForm.getValues("price") ?? ""}
                      onChange={handleChangePrice}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className={"bg-white rounded-md px-4 py-4 space-y-6 shadow-md"}>
            <div className={"font-semibold"}>Variants</div>
            <ProductVariantForm
              productVariants={productVariants}
              options={productOptions}
              onUpdateOptions={handleUpdateOptions}
              onUpdateProductVariants={handleUpdateProductVariants}
              initialData={initialData}
            />
          </div>

          <div className={"flex gap-4"}>
            <Button type="submit" disabled={isPending} className={""}>
              {isPending && (
                <span className={"animate-spin mr-3"}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={"w-4 h-4"}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                </span>
              )}
              {initialData ? "Update" : "Create"}
            </Button>

            <Link to={"/admin/products"}>
              <Button variant={"secondary"}>Cancel</Button>
            </Link>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

const editorConfig = {
  height: 500,
  menubar: false,
  branding: false,
  plugins: [
    "advlist",
    "autolink",
    "lists",
    "link",
    "image",
    "charmap",
    "preview",
    "anchor",
    "searchreplace",
    "visualblocks",
    "code",
    "fullscreen",
    "insertdatetime",
    "media",
    "table",
    "code",
    "help",
    "wordcount",
  ],
  toolbar:
    "undo redo | blocks | " +
    "bold italic forecolor | alignleft aligncenter " +
    "alignright alignjustify | bullist numlist outdent indent | " +
    "removeformat | help",
  content_style:
    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
};

export default ProductForm;
