import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Category } from "@/dto/category/category.ts";
import { XIcon } from "lucide-react";

export const categoryFormSchema = z
  .object({
    name: z.string().min(1),
    updateImage: z.instanceof(File).optional(),
    currentImageUrl: z.string().nullable().optional(),
    id: z.number().or(z.string()).nullable().optional(),
  })
  .refine((val) => val.currentImageUrl || val.updateImage, {
    message: "Category image is required",
    path: ["updateImage"],
  });

function CategoryForm({
  initialData,
  onSubmit,
  isPending,
}: {
  initialData?: Category;
  onSubmit: (values: z.infer<typeof categoryFormSchema>) => void;
  isPending: boolean;
}) {
  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData ? initialData.name : "",
      currentImageUrl: initialData ? initialData.imageFileUrl : null,
      id: initialData ? initialData.id : null,
    },
  });

  return (
    <div>
      <div className={"mt-6 max-w-lg"}>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="updateImage"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      placeholder="Category Images"
                      className="w-64"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const files = event.target.files;

                        if (!files || files.length === 0) {
                          return;
                        }
                        form.setValue("updateImage", files[0]);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className={"mt-4 w-[250px]"}>
                    <CategoryImage
                      imageFile={form.getValues("updateImage")}
                      imageUrl={initialData?.imageFileUrl || ""}
                      onRemove={() => {
                        form.setValue("updateImage", undefined);
                      }}
                    />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
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

              <Link to={"/admin/categories"}>
                <Button variant={"secondary"}>Cancel</Button>
              </Link>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

function CategoryImage({
  imageFile,
  imageUrl,
  onRemove,
}: {
  imageFile?: File | null;
  imageUrl?: string | null;
  onRemove: () => void;
}) {
  const displayUrl = imageFile
    ? URL.createObjectURL(new Blob([imageFile!]))
    : imageUrl;

  if (!displayUrl) return null;

  return (
    <div className={"shadow-md relative"}>
      <XIcon
        className={"size-4 right-[-1px] top-1 absolute hover:cursor-pointer"}
        onClick={onRemove}
      />

      <img className={"h-52 w-full rounded-sm"} src={displayUrl} />
    </div>
  );
}

export default CategoryForm;
