import { z } from 'zod';
import { Product } from '@/dto/product/product.ts';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { QueryKey } from '@/constant/query-key.ts';
import CategoriesService from '@/services/categories.service.ts';
import Utils from '@/utils/utils.ts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Editor } from '@tinymce/tinymce-react';
import { KeyboardEvent, useRef, useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge.tsx';
import notification from '@/utils/notification.tsx';
import OldProductImageList from "@/pages/admin/products/form/OldProductImageList.tsx";
import NewProductImageList from "@/pages/admin/products/form/NewProductImageList.tsx";
import ProductColorForm, { colorFormSchema } from '@/pages/admin/products/form/product-colors/ProductColorForm.tsx';
import ProductsService from '@/services/products.service.ts';
import ProductSizeForm, { sizeFormSchema } from '@/pages/admin/products/form/product-sizes/ProductSizeForm.tsx';

const allowTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export const productFormSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string().min(1, {
    message: 'Please provide product name'
  }).max(255),
  oldImages: z.object({
    id: z.number(),
    assetId: z.number(),
    asset: z.object({
      id: z.number(),
      preSignUrl: z.string().optional()
    })
  }).array().optional(),
  newImages: z.instanceof(FileList, {message: 'Please provide some product images'})
    .refine((files) => Array.from(files).every(file => file instanceof File), {
      message: "Expect a file"
    }).refine((files) => Array.from(files).every(file => allowTypes.includes(file.type)), {
      message: `Only these file types are allowed: ${allowTypes.map(t => t.replace('image', '.'))}`
    }),
  description: z.string().max(10000).optional(),
  categoryId: z.string({message: 'Please provide category information'}),
  productSizes: z.object({
    name: z.string(),
    index: z.number().optional()
  }).array().optional(),
  productColors: z.object({
    name: z.string().min(1, {message: 'Product color required'}),
    code: z.string(),
    index: z.number().optional(),
    id: z.number().optional().nullable()
  }).array().optional()
});


interface ProductFormProps {
  initialData?: Product
}

function ProductForm(props: ProductFormProps) {
  const [addingSizes, setAddingSizes] = useState(false);
  const [newSize, setNewSize] = useState('');
  const navigate = useNavigate();
  const {initialData} = props;
  const isUpdate = !!initialData;

  const {data: categories, isLoading, isError, error} = useQuery({
    queryKey: [QueryKey.Categories],
    queryFn: CategoriesService.getAll
  });

  const {
    isPending,
    mutate,
  } = useMutation({
    mutationFn: isUpdate ? ProductsService.update : ProductsService.create,
    onSuccess: () => {
      notification.success(`${isUpdate ? 'Update' : 'Create'} product success`);
      navigate('/admin/products')
    },
    onError: (error) => {
      Utils.handleError(error)
    }
  });

  const editorRef = useRef(null);

  const productForm = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      categoryId: String(initialData?.categoryId || ''),
      oldImages: initialData?.productImages || []
    } : {
      id: null,
      name: "",
      categoryId: undefined,
      oldImages: undefined
    }
  });

  function onSubmit(values: z.infer<typeof productFormSchema>) {
    mutate(values,);
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    Utils.handleError(error);
    return <div>Fail to load categories</div>;
  }

  function handleAddSize(values: z.infer<typeof sizeFormSchema>) {
    const sizes = productForm.getValues("productSizes")
    productForm.setValue("productSizes", [...(sizes || []), {name: values.name, id: null}]);
  }

  function handleUpdateSize(values: z.infer<typeof sizeFormSchema>) {
    const sizes = productForm.getValues("productSizes");
    const updateSizes = sizes!.map((size, index) => index === values.index ? {
      ...size, ...{
        name: values.name,
        id: values.id
      }
    } : size);
    productForm.setValue('productSizes', updateSizes);
  }

  function handleDeleteSize(removeIndex: number) {
    const updateProductSizes = (productForm.getValues('productSizes') || []).filter((_color, index) => index !== removeIndex)
    productForm.setValue('productSizes', updateProductSizes);
  }

  function handleAddColor(values: z.infer<typeof colorFormSchema>) {
    const colors = productForm.getValues("productColors")
    productForm.setValue("productColors", [...(colors || []), {name: values.name, code: values.code, id: null}]);
  }

  function handleUpdateColor(values: z.infer<typeof colorFormSchema>) {
    const colors = productForm.getValues("productColors");
    const updateColors = colors!.map((color, index) => index === values.index ? {
      ...color, ...{
        name: values.name,
        code: values.code,
        id: values.id
      }
    } : color);
    productForm.setValue('productColors', updateColors);
  }

  function handleDeleteColor(removeIndex: number) {
    const updateProductColors = (productForm.getValues('productColors') || []).filter((_color, index) => index !== removeIndex)
    productForm.setValue('productColors', updateProductColors);
  }

  return (
    <div className={'mt-4 max-w-3xl'}>
      <FormProvider {...productForm}>
        <form onSubmit={productForm.handleSubmit(onSubmit)} className={'space-y-8'}>
          <FormField
            control={productForm.control}
            name="categoryId"
            render={({field}) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category"/>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {
                      categories && categories.map(category => {
                        return (
                          <SelectItem key={category.id}
                                      value={String(category.id)}>
                            {category.name}
                          </SelectItem>
                        )
                      })
                    }
                  </SelectContent>
                </Select>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            control={productForm.control}
            name="name"
            render={({field}) => (
              <FormItem>
                <FormLabel>Product name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} className={'max-w-lg'}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            control={productForm.control}
            name="newImages"
            render={({field: {value, onChange, ...fieldProps}}) => (
              <FormItem>
                <FormLabel>Product images</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    placeholder="Product"
                    className='w-64'
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(event) => {
                      const addedFiles = event.target.files;
                      if (!addedFiles) {
                        return;
                      }
                      const imageFiles = productForm.getValues("newImages");
                      productForm.setValue('newImages', Utils.mergeFileLists(imageFiles, addedFiles))
                    }}
                  />
                </FormControl>
                <FormMessage/>
                <div className={'grid grid-cols-3 gap-2'}>
                  <OldProductImageList onDelete={(id) => {
                                         const oldImages = productForm.getValues('oldImages');
                                         productForm.setValue('oldImages', oldImages?.filter(oldImage => oldImage.id !== id))
                                       }}
                                       initialValues={productForm.getValues('oldImages')}
                  />
                  <NewProductImageList
                    onDelete={(index) => {
                      const newImages = productForm.getValues('newImages'); // for add image file to productForm
                      const newImagesArray = Array.from(newImages).filter((_file, idx) => idx !== index);
                      productForm.setValue('newImages', Utils.createFileList(newImagesArray))
                    }}
                    imageFiles={productForm.getValues('newImages')}
                  />

                </div>
              </FormItem>
            )}
          />

          <FormField
            name={"productSizes"}
            control={productForm.control}
            render={() => (
              <FormItem className={'flex space-y-4 flex-col'}>
                <FormLabel>Product Sizes</FormLabel>
                <ProductSizeForm onAddSize={handleAddSize}
                                 onUpdateSize={handleUpdateSize}
                                 onDeleteSize={handleDeleteSize}
                                 initialSizes={productForm.getValues('productSizes')}
                />
              </FormItem>
            )}
          />

          <FormField
            name={"productColors"}
            control={productForm.control}
            render={() => (
              <FormItem className={'flex space-y-4 flex-col'}>
                <FormLabel>Product Color</FormLabel>
                <ProductColorForm onAddColor={handleAddColor}
                                  onUpdateColor={handleUpdateColor}
                                  onDeleteColor={handleDeleteColor}
                                  initialColors={productForm.getValues('productColors')}
                />
              </FormItem>
            )}
          />

          <FormField name="description"
                     control={productForm.control}
                     render={() => (
                       <FormItem>
                         <FormLabel>Description</FormLabel>
                         <Editor
                           apiKey={import.meta.env.VITE_TINY_EDITOR_API_KEY}
                           onInit={(_evt, editor) => {
                             // @ts-ignore
                             editorRef.current = editor
                           }}
                           value={productForm.getValues("description")}
                           init={{
                             height: 500,
                             menubar: false,
                             branding: false,
                             plugins: [
                               'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                               'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                               'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                             ],
                             toolbar: 'undo redo | blocks | ' +
                               'bold italic forecolor | alignleft aligncenter ' +
                               'alignright alignjustify | bullist numlist outdent indent | ' +
                               'removeformat | help',
                             content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                           }}
                           onEditorChange={(newValue) => {
                             productForm.setValue("description", newValue, {shouldValidate: true});
                           }}
                         />
                         <FormMessage/>
                       </FormItem>
                     )}
          />

          <div className={'flex gap-4'}>
            <Button type="submit"
                    disabled={isPending}
                    className={'bg-amber-600 hover:bg-amber-500'}
            >
              {isPending &&
                <span className={'animate-spin mr-3'}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                           stroke="currentColor" className={'w-4 h-4'}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
                      </svg>
                  </span>
              }
              {initialData ? 'Update' : 'Create'}
            </Button>

            <Link to={'/admin/products'}>
              <Button variant={'secondary'}>Cancel</Button>
            </Link>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default ProductForm;