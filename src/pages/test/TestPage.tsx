import PageTitle from '@/pages/common/PageTitle.tsx';
import { useState } from 'react';
import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useMutation } from '@tanstack/react-query';
import Utils from '@/utils/utils.ts';
import httpClient from '@/http-client/http-client.ts';

const allowTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

const formSchema = z.object({
  // images: z.any().refine((files) => Array.from(files).every(file => allowTypes.includes(file.type)), {
  //   message: `Only these file types are allowed: ${allowTypes.map(t => t.replace('image', '.'))}`
  // }),
  images: z.instanceof(FileList)
    .refine((files) => Array.from(files).every(file => file instanceof File), {
      message: "Expect a file"
    }).refine((files) => Array.from(files).every(file => allowTypes.includes(file.type)), {
      message: `Only these file types are allowed: ${allowTypes.map(t => t.replace('image', '.'))}`
    })

});

function uploadFiles(files: FileList) {
  console.log('uploadFiles');
  console.log({files});
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    console.log({i})
    formData.append('files', files.item(i) as File);
  }

  return httpClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

function TestPage() {
  const [textContent, setTextContent] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const {mutate} = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => uploadFiles(data.images),
    onSuccess: () => {
      console.log('upload file success');
    },
    onError: error => {
      Utils.handleError(error);
    }
  });

  function onSubmit(data) {
    console.log('Upload file');
    console.log(data);
    mutate(data);
  }

  return (
    <div>
      <PageTitle>Test Page</PageTitle>
      {/*<div className={'mt-8'}>*/}
      {/*  <EditorComponent content={textContent}*/}
      {/*                   onUpdateContent={setTextContent}/>*/}
      {/*</div>*/}
      {/*<div className={'mt-8'}>*/}
      {/*  <div className={'text-xl'}>Content render</div>*/}
      {/*  <div>*/}
      {/*    <div className={'prose prose-a:text-blue-600 max-w-none'} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(textContent)}}></div>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="images"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Picture</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      placeholder="Picture"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(event) =>
                        onChange(event.target.files)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type={'submit'} className={'mt-4'}>Upload</Button>
          </form>
        </FormProvider>
      </div>

    </div>

  );
}

export default TestPage;
