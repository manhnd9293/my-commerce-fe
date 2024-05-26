import {string, z} from 'zod';
import {Product} from '@/dto/product/product.ts';
import {FormProvider, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form.tsx';
import {Input} from '@/components/ui/input.tsx';
import {Button} from '@/components/ui/button.tsx';
import {Link} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {QueryKey} from '@/constant/query-key.ts';
import CategoriesService from '@/services/categories.service.ts';
import Utils from '@/utils/utils.ts';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select.tsx';
import {Editor} from '@tinymce/tinymce-react';
import {KeyboardEvent, useRef, useState} from 'react';
import {PlusIcon} from 'lucide-react';
import {Badge} from '@/components/ui/badge.tsx';
import notification from '@/utils/notification.tsx';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card.tsx';
import {HexColorPicker} from 'react-colorful';
import {cn} from '@/lib/utils.ts';
import OldProductImageList from "@/pages/admin/products/form/OldProductImageList.tsx";
import NewProductImageList from "@/pages/admin/products/form/NewProductImageList.tsx";

const allowTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

const formSchema = z.object({
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
    name: z.string()
  }).array().optional(),
  productColors: z.object({
    name: string().min(1, {message: 'Product color required'}),
    code: string()
  }).array().optional()
});

const colorFormSchema = z.object({
  name: z.string({message: 'Please provide color name'}).min(1, {message: 'Please provide color name'}),
  code: z.string({message: 'Please provide color'}).min(1, {message: 'Please select product color'})
})

interface ProductFormProps {
  mutate: any,
  isPending: boolean,
  initialData?: Product
}

function ProductForm(props: ProductFormProps) {
  const [addingSizes, setAddingSizes] = useState(false);
  const [newSize, setNewSize] = useState('');
  const [addingColor, setAddingColor] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState<File []>([]);

  const {data: categories, isLoading, isError, error} = useQuery({
    queryKey: [QueryKey.Categories],
    queryFn: CategoriesService.getAll
  });
  const {mutate, isPending, initialData} = props;
  const editorRef = useRef(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      categoryId: String(initialData?.categoryId),
      oldImages: initialData.productImages || []
    } : {
      id: null,
      name: "",
      categoryId: undefined,
      images: undefined
    }
  });

  const colorForm = useForm<z.infer<typeof colorFormSchema>>({
    resolver: zodResolver(colorFormSchema),
    defaultValues: {
      name: '',
      code: '',
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      ...values,
      categoryId: Number(values.categoryId)
    });
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    Utils.handleError(error);
    return <div>Fail to load categories</div>;
  }

  function handleKeydownSizeInput(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') {
      return;
    }
    e.preventDefault();
    const sizes = form.getValues("productSizes");
    if (sizes && sizes.some(size => size.name.toLowerCase() === newSize)) {
      notification.error('Fail to add size. Size exists');
      return;
    }
    form.setValue("productSizes", [...(sizes || []), {name: newSize}]);
    setNewSize('');
  }

  function handleAddColor(values: z.infer<typeof colorFormSchema>) {
    const colors = form.getValues("productColors")
    form.setValue("productColors", [...(colors || []), {name: values.name, code: values.code}]);
    colorForm.reset();
  }

  return (
    <div className={'mt-4 max-w-3xl'}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-6'}>
          <FormField
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
                      const imageFiles = form.getValues("newImages");
                      setNewImageFiles([...newImageFiles, ...Array.from(addedFiles)]);
                      form.setValue('newImages', Utils.mergeFileLists(imageFiles, addedFiles))
                    }}
                  />
                </FormControl>
                <FormMessage/>
                <div className={'grid grid-cols-3 gap-2'}>
                  <OldProductImageList onDelete={(id) => {
                                         const oldImages = form.getValues('oldImages');
                                         form.setValue('oldImages', oldImages.filter(oldImage => oldImage.id !== id))
                  }}
                                       initialValues={form.getValues('oldImages')}
                  />
                  <NewProductImageList onDelete={(index)=> {
                                         setNewImageFiles(newImageFiles.filter((_img, idx) => idx !== index)); // for display product image
                                         const newImages = form.getValues('newImages'); // for add image file to form
                                         const newImagesArray = Array.from(newImages).filter((_file, idx)=> idx !== index);
                                         form.setValue('newImages', Utils.createFileList(newImagesArray))
                                       }}
                                       imageFiles={newImageFiles}
                  />

                </div>
              </FormItem>
            )}
          />

          <FormField
            name={"productSizes"}
            control={form.control}
            render={() => (
              <FormItem className={'flex space-y-4 flex-col'}>
                <FormLabel>Product Size</FormLabel>
                {
                  !addingSizes &&
                  <Button variant={'outline'}
                          className={'flex items-center w-48'}
                          type={'button'}
                          onClick={(event) => {
                            event.preventDefault();
                            setAddingSizes(true);
                          }}
                  >
                    <PlusIcon className={'size-4 mr-2 font-bold'}/>
                    Add size
                  </Button>
                }
                {
                  addingSizes &&
                  <div className={'flex items-center gap-4'}>
                    <Input placeholder={'New product size'}
                           className={'max-w-md'}
                           value={newSize}
                           onChange={(e) => setNewSize(e.target.value)}
                           onKeyDown={handleKeydownSizeInput}
                           onBlur={() => setAddingSizes(false)}
                           id={"asi"}
                    />
                    <Button
                      variant={'outline'}
                      onClick={(e) => {
                        e.preventDefault();
                        setAddingSizes(false);
                        setNewSize('');
                      }}>Cancel</Button>
                  </div>
                }
                <div className={'flex gap-2 max-w-lg flex-wrap'}>
                  {
                    form.getValues('productSizes')?.map((size, index) => {
                      return (
                        <Badge key={index}
                               className={'px-4 py-2 cursor-pointer '}
                               variant={'secondary'}
                               onClick={() => {
                                 const sizes = form.getValues('productSizes') || [];
                                 form.setValue("productSizes", sizes.filter(s => s.name !== size.name));
                               }}
                        >
                          {size.name}
                        </Badge>
                      )
                    })
                  }
                </div>
              </FormItem>
            )}
          />

          <FormField
            name={"productColors"}
            control={form.control}
            render={() => (
              <FormItem className={'flex space-y-4 flex-col'}>
                <FormLabel>Product Color</FormLabel>
                {
                  !addingColor &&
                  <Button variant={'outline'}
                          className={'flex items-center w-48'}
                          type={'button'}
                          onClick={(event) => {
                            event.preventDefault();
                            setAddingColor(true);
                          }}
                  >
                    <PlusIcon className={'size-4 mr-2 font-bold'}/>
                    Add color
                  </Button>
                }
                {
                  addingColor && (
                    <Card className={'max-w-xl'}>
                      <CardHeader>
                        <CardTitle className={'text-lg'}>Add color</CardTitle>
                      </CardHeader>
                      <CardContent className={'flex flex-col space-y-4'}>
                        <FormProvider {...colorForm}>
                          <FormField
                            control={colorForm.control}
                            name="name"
                            render={({field}) => (
                              <FormItem>
                                <FormLabel>Color</FormLabel>
                                <FormControl>
                                  <Input placeholder="Color name"
                                         {...field}
                                         className={'max-w-xs'}
                                         onKeyDown={(e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                           e.key === 'Enter' && e.preventDefault();
                                         }}
                                  />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={colorForm.control}
                            name="code"
                            render={() => (
                              <FormItem>
                                <FormLabel>Pick color</FormLabel>
                                <FormDescription>Pick color for your product</FormDescription>
                                <FormControl>
                                  <HexColorPicker color={colorForm.getValues("code")}
                                                  onChange={value => colorForm.setValue("code", value)}
                                  />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />
                        </FormProvider>
                      </CardContent>
                      <CardFooter>
                        <div className={'flex gap-2'}>
                          <Button type={'button'}
                                  className={'bg-amber-600'}
                                  onClick={colorForm.handleSubmit(handleAddColor)}
                          >
                            Add
                          </Button>
                          <Button type={'button'} variant={'outline'}
                                  onClick={() => {
                                    setAddingColor(false);
                                    colorForm.reset();
                                  }}
                          >Cancel</Button>
                        </div>
                      </CardFooter>
                    </Card>

                  )
                }

                <div className={'flex gap-2 max-w-sm'}>
                  {
                    form.getValues('productColors')?.map((color, index) => {
                      return (
                        <Badge key={index}
                               className={'px-4 py-2 flex items-center gap-2'}
                               variant={'secondary'}
                               onClick={() => {
                                 const colors = form.getValues('productColors') || [];
                                 form.setValue("productColors", colors.filter(s => s.name !== color.name));
                               }}
                        >
                          <div style={{backgroundColor: color.code}} className={cn('size-2 rounded')}></div>
                          <div>{color.name}</div>
                        </Badge>
                      )
                    })
                  }
                </div>
              </FormItem>
            )}
          />

          <FormField name="description"
                     control={form.control}
                     render={() => (
                       <FormItem>
                         <FormLabel>Description</FormLabel>
                         <Editor
                           apiKey='iloqhvyja1d64v0zfn5delyuec4rcmxlju53bq2etbpho9zb'
                           onInit={(_evt, editor) => {
                             // @ts-ignore
                             editorRef.current = editor
                           }}
                           value={form.getValues("description")}
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
                             form.setValue("description", newValue, {shouldValidate: true});
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