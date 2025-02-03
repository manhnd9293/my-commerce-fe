import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Button } from "@/components/ui/button.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { useMutation } from "@tanstack/react-query";
import conversationsService from "@/services/conversations.service.ts";

interface InitConversationProps {
  onCreateConversation: () => void;
}
const formSchema = z.object({
  subject: z.string().min(1, "Please provide conversation subject"),
  message: z.string().min(1, "Please describe your issue shortly"),
});

function InitConversation({ onCreateConversation }: InitConversationProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["new_conversation"],
    mutationFn: (variables: z.infer<typeof formSchema>) =>
      conversationsService.createConversation(variables),
  });

  async function handleClick(data: z.infer<typeof formSchema>) {
    await mutateAsync({
      subject: data.subject,
      message: data.message,
    });
    onCreateConversation();
  }

  return (
    <div className={"flex flex-col gap-4 p-4"}>
      <div className={"font-semibold"}>How can we help you ?</div>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleClick)}>
          <FormField
            control={form.control}
            name={"subject"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={"Subject"}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name={"message"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Describe</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={"Message"}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <Button
            className={"bg-amber-600 hover:bg-amber-500 text-white mt-4 w-full"}
          >
            {isPending && "Create customer support chat"}
            {!isPending && "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default InitConversation;
