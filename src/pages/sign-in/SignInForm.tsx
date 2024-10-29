import { FormProvider, useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import Utils from "@/utils/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import AuthService from "@/services/auth.service.ts";
import { signIn } from "@/store/user/userSlice.ts";

const formSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

interface SignInFormProps {
  onSuccess?: () => void;
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const dispatch = useDispatch();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: AuthService.signIn,
    onSuccess: (data) => {
      // @ts-ignore
      const accessToken = data["accessToken"] as string;
      localStorage.setItem("accessToken", accessToken);
      dispatch(signIn(data));
      onSuccess && onSuccess();
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }
  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your email</FormLabel>
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
                  <Input placeholder="Password" {...field} type={"password"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isError && (
            <div className={"my-2 text-red-600 text-center"}>
              {Utils.getErrorMessage(error)}
            </div>
          )}

          <div className={"text-center"}>
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
              Sign In
            </Button>
          </div>
        </form>
      </FormProvider>
      <Separator className={"my-4"} />
      <div className={"text-center"}>
        <div>
          Do not have an account ?{" "}
          <Link to={"/sign-up"}>
            <span className={"text-blue-600 underline"}>Sign up</span>
          </Link>
        </div>
      </div>
    </>
  );
}
