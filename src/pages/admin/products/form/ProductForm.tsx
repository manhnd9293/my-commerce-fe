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
import React, { useRef } from "react";
import notification from "@/utils/notification.tsx";
import ProductImageList from "@/pages/admin/products/form/ProductImageList.tsx";
import ProductColorForm, {
  colorFormSchema,
} from "@/pages/admin/products/form/product-colors/ProductColorForm.tsx";
import ProductsService from "@/services/products.service.ts";
import ProductSizeForm, {
  sizeFormSchema,
} from "@/pages/admin/products/form/product-sizes/ProductSizeForm.tsx";

const allowTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Please provide product name",
    })
    .max(255),
  productMedia: z.string().array().optional(),
  price: z.number().optional(),
  description: z.string().max(50000).optional(),
  categoryId: z.string({ message: "Please provide category information" }),
  productSizes: z
    .object({
      name: z.string(),
      id: z.string().optional().nullable(),
    })
    .array()
    .optional(),
  productColors: z
    .object({
      name: z.string().min(1, { message: "Product color required" }),
      code: z.string(),
      id: z.string().optional().nullable(),
    })
    .array()
    .optional(),
});

interface ProductFormProps {
  initialData?: Product;
}

function ProductForm(props: ProductFormProps) {
  const navigate = useNavigate();
  const { initialData } = props;
  const isUpdate = !!initialData;
  const productId = initialData?.id;

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
      ProductsService.update(initialData!.id, variables),
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
      await mutateCreate(values);
    }
  }

  function handleAddSize(values: z.infer<typeof sizeFormSchema>) {
    const sizes = productForm.getValues("productSizes");
    productForm.setValue("productSizes", [
      ...(sizes || []),
      { name: values.name },
    ]);
  }

  function handleUpdateSize(values: z.infer<typeof sizeFormSchema>) {
    const sizes = productForm.getValues("productSizes");
    const updateSizes = sizes!.map((size, index) =>
      index === values.index
        ? {
            ...size,
            ...{
              name: values.name,
              id: values.id,
            },
          }
        : size,
    );
    productForm.setValue("productSizes", updateSizes);
  }

  function handleDeleteSize(removeIndex: number) {
    const updateProductSizes = (
      productForm.getValues("productSizes") || []
    ).filter((_color, index) => index !== removeIndex);
    productForm.setValue("productSizes", updateProductSizes);
  }

  function handleAddColor(values: z.infer<typeof colorFormSchema>) {
    const colors = productForm.getValues("productColors");
    productForm.setValue("productColors", [
      ...(colors || []),
      { name: values.name, code: values.code },
    ]);
  }

  function handleUpdateColor(values: z.infer<typeof colorFormSchema>) {
    const colors = productForm.getValues("productColors");
    const updateColors = colors!.map((color, index) =>
      index === values.index
        ? {
            ...color,
            ...{
              name: values.name,
              code: values.code,
              id: values.id,
            },
          }
        : color,
    );
    productForm.setValue("productColors", updateColors);
  }

  function handleDeleteColor(removeIndex: number) {
    const updateProductColors = (
      productForm.getValues("productColors") || []
    ).filter((_color, index) => index !== removeIndex);
    productForm.setValue("productColors", updateProductColors);
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
                    init={{
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
                    }}
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

          <div className={"bg-white rounded-md px-4 py-2 space-y-6 shadow-md"}>
            <div className={"font-bold"}>Variants</div>
            <FormField
              name={"productSizes"}
              control={productForm.control}
              render={() => (
                <FormItem className={"flex space-y-4 flex-col"}>
                  <FormLabel>Product Sizes</FormLabel>
                  <ProductSizeForm
                    onAddSize={handleAddSize}
                    onUpdateSize={handleUpdateSize}
                    onDeleteSize={handleDeleteSize}
                    initialSizes={productForm.getValues("productSizes")}
                  />
                </FormItem>
              )}
            />

            <FormField
              name={"productColors"}
              control={productForm.control}
              render={() => (
                <FormItem className={"flex space-y-4 flex-col"}>
                  <FormLabel>Product Color</FormLabel>
                  <ProductColorForm
                    onAddColor={handleAddColor}
                    onUpdateColor={handleUpdateColor}
                    onDeleteColor={handleDeleteColor}
                    initialColors={productForm.getValues("productColors")}
                  />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={productForm.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
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

export default ProductForm;
