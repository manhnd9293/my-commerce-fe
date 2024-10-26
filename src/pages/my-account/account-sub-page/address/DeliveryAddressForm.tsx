import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";

export const deliveryFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "This field is required" })
    .max(500, { message: "This field is maximum 500 character" }),
  phone: z
    .string()
    .regex(/\d+/, { message: "Invalid phone number" })
    .min(10, { message: "Minimum 10 digits" })
    .max(11, { message: "Maximum 11 digits" }),
  province: z
    .string()
    .min(1, { message: "This field is required" })
    .max(500, { message: "This field is maximum 500 character" }),
  district: z
    .string()
    .min(1, { message: "This field is required" })
    .max(500, { message: "This field is maximum 500 character" }),
  commune: z
    .string()
    .min(1, { message: "This field is required" })
    .max(500, { message: "This field is maximum 500 character" }),
  noAndStreet: z
    .string()
    .min(1, { message: "This field is required" })
    .max(500, { message: "This field is maximum 500 character" }),
});

interface AddressFormProps {
  form: UseFormReturn<z.infer<typeof deliveryFormSchema>>;
}

export function DeliveryAddressForm({ form }: AddressFormProps) {
  function onSubmit(values: z.infer<typeof deliveryFormSchema>) {
    console.log("Form");
    return values;
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact</FormLabel>
                <FormControl>
                  <Input placeholder="Your Phone" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <FormControl>
                  <Input placeholder="Province" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District</FormLabel>
                <FormControl>
                  <Input placeholder="District" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="commune"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commune</FormLabel>
                <FormControl>
                  <Input placeholder="Commune" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="noAndStreet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No and Street</FormLabel>
                <FormControl>
                  <Input placeholder="No And Street" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
