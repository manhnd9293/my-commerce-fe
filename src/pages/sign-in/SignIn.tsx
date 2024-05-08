import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useMutation } from '@tanstack/react-query';
import AuthService from '@/services/auth.service.ts';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signIn } from '@/store/user/userSlice.ts';

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
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {mutate, isPending, isError, error, } = useMutation({
    mutationFn: AuthService.signIn,
    onSuccess: (data) => {
      console.log('Sign in success');
      console.log({data});
      // @ts-ignore
      const accessToken = data['accessToken'] as string;
      localStorage.setItem('accessToken', accessToken);
      dispatch(signIn(data));
      navigate('/');
    }
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    mutate(values);
  }

  if (isError) {
    console.log({error})
    return <div>Something went wrong - {error.message}</div>
  }

  return (
    <div>
      <Card className={'w-[480px] mx-auto mt-48'}>
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
              <div className={'text-center'}>
                <Button type="submit"
                        disabled={isPending}
                        className={'bg-amber-600 hover:bg-amber-500'}
                >
                  { isPending &&
                    <span className={'animate-spin mr-3'}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                           stroke="currentColor" className={'w-4 h-4'}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
                      </svg>
                    </span>
                  }
                  Sign In
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignIn;