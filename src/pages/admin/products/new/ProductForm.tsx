import {z} from 'zod';
import {Product} from '@/dto/product/product.ts';
import {FormProvider, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form.tsx';
import {Input} from '@/components/ui/input.tsx';
import {Button} from '@/components/ui/button.tsx';
import {Link} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {QueryKey} from '@/constant/query-key.ts';
import CategoriesService from '@/services/categories.service.ts';
import Utils from '@/utils/utils.ts';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import EditorComponent from '@/pages/test/editor/EditorComponent.tsx';

const formSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string().min(1, {
    message: 'Please provide product name'
  }).max(255),
  description: z.string().max(10000).optional(),
  categoryId: z.string({message: 'Please provide category information'})
})

interface ProductFormProps {
  mutate: any,
  isPending: boolean,
  initialData?: Product
}

function ProductForm(props: ProductFormProps) {
  const {data: categories, isLoading, isError, error} = useQuery({
    queryKey: [QueryKey.Categories],
    queryFn: CategoriesService.getAll
  });
  const {mutate, isPending, initialData} = props;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      categoryId: String(initialData?.categoryId),
    } : {
      id: null,
      name: "",
      categoryId: undefined,
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('submit form');
    console.log(values);
    // mutate({
    //   ...values,
    //   categoryId: Number(values.categoryId)
    // });
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    Utils.handleError(error);
    return <div>Fail to load categories</div>;
  }

  return (
    <div className={'mt-6 max-w-3xl'}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-4'}>
          <FormField
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem>
                <FormLabel>Product name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

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

          <FormField name="description"
                     control={form.control}
                     render={({field: {value, onChange, ...fieldProps}}) => (
                       <FormItem>
                         <FormLabel>Description</FormLabel>
                         <EditorComponent content={value}
                                          onChange={onChange}
                                          {...fieldProps}
                         />
                       </FormItem>

                     )
                     }
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