import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useMutation } from '@tanstack/react-query';
import AuthService from '@/services/auth.service.ts';

const formSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1)
})

function SignIn() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const {mutate, isPending, isError, error} = useMutation({
    mutationFn: AuthService.signIn,
    onSuccess: (data) => {
      alert('Sign in success');
      console.log({data})
    }
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    mutate(values);
  }

  return (
    <div>
      <Card className={'w-[500px] mx-auto mt-48'}>
        <CardHeader>
          <CardTitle className={'text-center'}>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" {...field} type={'password'}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className={'text-center'}><Button type="submit">Sign In</Button></div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignIn;