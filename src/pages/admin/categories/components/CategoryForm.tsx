import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Category } from '@/dto/category.ts';

const formSchema = z.object({
  name: z.string().min(1),
  id: z.number().nullable()
})

function CategoryForm({initialData, mutate, isPending}: {initialData: Category, mutate: any, isPending: boolean} ) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData ? initialData.name : "",
      id: initialData? initialData.id : null,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  };

  return (
    <div>
      <div className={'mt-6 max-w-lg'}>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Category name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
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

              <Link to={'/admin/categories'}>
                <Button variant={'secondary'}>Cancel</Button>
              </Link>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default CategoryForm;