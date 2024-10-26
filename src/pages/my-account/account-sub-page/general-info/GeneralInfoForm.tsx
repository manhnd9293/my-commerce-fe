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
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { cn } from "@/lib/utils.ts";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar.tsx";
import { useMutation } from "@tanstack/react-query";
import UsersService from "@/services/users.service.ts";
import { toast } from "sonner";
import { DateTime } from "luxon";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { updateGeneralInfo } from "@/store/user/userSlice.ts";

const formSchema = z.object({
  fullName: z
    .string()
    .max(500, { message: "This field is maximum 500 character" })
    .nullable(),
  dob: z.string().date().nullable(),
  phone: z
    .string()
    .regex(/\d+/, { message: "Invalid phone number" })
    .min(10, { message: "Minimum 10 digits" })
    .max(11, { message: "Maximum 11 digits" })
    .nullable(),
});

function GeneralInfoForm() {
  const user = useAppSelector((state) => state.user);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user.fullName,
      dob: user.dob,
      phone: user.phone,
    },
  });
  const dispatch = useAppDispatch();
  const { mutate, isPending } = useMutation({
    mutationFn: UsersService.updateGeneralInfo,
    onSuccess: (data) => {
      dispatch(updateGeneralInfo(data));
      toast("Update information success", {
        description: "Your information has been updated",
        closeButton: true,
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    className={"w-[500px]"}
                    placeholder="Your Fullname"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={DateTime.fromFormat(
                        field.value || "",
                        "YYYY-MM-DD",
                      ).toJSDate()}
                      onSelect={(value) => {
                        if (!value) return;
                        const isoDate = DateTime.fromJSDate(value).toISODate();
                        field.onChange(isoDate);
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input
                    className={"w-[300px]"}
                    placeholder="Phone number"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className={"mt-4"}>
        <Button
          className={"bg-amber-600 hover:bg-amber-500"}
          disabled={isPending}
          onClick={form.handleSubmit(onSubmit)}
        >
          Update Information
        </Button>
      </div>
    </div>
  );
}

export default GeneralInfoForm;
