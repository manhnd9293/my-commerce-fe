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
import { ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  optionFormSchema,
  ProductOptionFormProps,
} from "@/pages/admin/products/form/product-variant/product-option-form/product-options-form-types.ts";
import { ProductOptionsCollapse } from "@/pages/admin/products/form/product-variant/product-option-form/ProductOptionsCollapse.tsx";
import { OptionValueInput } from "@/pages/admin/products/form/product-variant/product-option-form/OptionValueInput.tsx";
import { v4 as uuidV4 } from "uuid";

function ProductOptionForm({
  data,
  onDelete,
  onUpdate,
  index,
  collapse,
  updateCollapse,
}: ProductOptionFormProps) {
  const form = useForm<z.infer<typeof optionFormSchema>>({
    resolver: zodResolver(optionFormSchema),
    mode: "onChange",
    defaultValues: {
      name: data.name,
      optionValues: data.optionValues || [{ name: "", empty: true }],
    },
  });

  function handleDeleteForm() {
    form.reset();
    onDelete(data.id!);
  }

  function onSubmit(values: z.infer<typeof optionFormSchema>) {
    const updateValues = {
      ...values,
      optionValues: values.optionValues.filter((v) => v.name !== ""),
    };
    updateCollapse(data.id!, true);
    onUpdate({ index, updateValues });
  }

  const handleChangeOptionValue =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const updateName = e.target.value;
      const optionValues = form.getValues("optionValues");
      const cloneValues = structuredClone(optionValues);
      const newValues = cloneValues.map((optionValue, idx) => {
        if (idx !== index) return optionValue;
        return { ...optionValue, name: updateName, empty: false };
      });
      if (index === optionValues.length - 1 && updateName !== "") {
        newValues.push({
          name: "",
          empty: true,
          position: optionValues.length,
          isNew: true,
        });
      }
      form.setValue("optionValues", newValues);

      const duplicate = newValues.find((item, index) =>
        newValues.some(
          (v, idx) => item.name !== "" && v.name === item.name && idx !== index,
        ),
      );
      if (duplicate) {
        form.setError("optionValues", {
          message: `value ${duplicate.name} already exist`,
        });
        return;
      } else {
        form.clearErrors();
      }
    };

  function handleDeleteValue(index: number) {
    const optionValues = form.getValues("optionValues");
    if (index === optionValues.length - 1) {
      return;
    }
    const newVals = optionValues.filter((_v, idx) => idx !== index);
    newVals.forEach((value, index) => {
      value.position = index;
    });
    setTimeout(() => form.setValue("optionValues", newVals), 0);
  }

  const handleDeleteOptionValueByKeyboard =
    (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
      const optionValues = form.getValues("optionValues");
      if (optionValues[index].name !== "" || event.key !== "Backspace") {
        return;
      }
      if (index === optionValues.length - 1) {
        return;
      }
      const newVals = optionValues.filter((_v, idx) => idx !== index);
      setTimeout(() => form.setValue("optionValues", newVals), 0);
    };

  async function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const optionValues = form.getValues().optionValues;
    const filterValues: z.infer<typeof optionFormSchema>["optionValues"] =
      optionValues.filter(
        (value, index) =>
          !(index === optionValues.length - 1 && value.name === ""),
      );
    form.setValue("optionValues", filterValues);
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }
    onSubmit(form.getValues());
  }

  function handleUnCollapse() {
    updateCollapse(data.id!, false);
    const currentValues = form.getValues("optionValues");
    const emptyOptionValue = {
      name: "",
      empty: true,
      position: currentValues.length,
      isNew: true,
      id: uuidV4(),
    };
    form.setValue("optionValues", [...currentValues, emptyOptionValue]);
  }

  if (collapse) {
    return <ProductOptionsCollapse data={data} onClick={handleUnCollapse} />;
  }

  return (
    <div>
      <Form {...form}>
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option name</FormLabel>
                <FormControl>
                  <Input placeholder="Option name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="optionValues"
            render={() => (
              <FormItem>
                <FormLabel>Option values</FormLabel>
                {form.getValues("optionValues").map((optionValue, index) => {
                  return (
                    <OptionValueInput
                      key={index}
                      optionValue={optionValue}
                      onChange={handleChangeOptionValue(index)}
                      onKeyDown={handleDeleteOptionValueByKeyboard(index)}
                      onBlur={(v: { index: number; value: string }) => {
                        const clone = structuredClone(
                          form.getValues("optionValues"),
                        );
                        clone[v.index].name = v.value;
                        form.setValue("optionValues", clone);
                      }}
                      index={index}
                      onDelete={handleDeleteValue}
                    />
                  );
                })}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
      <div className={"flex items-center gap-2 mt-4 justify-between"}>
        <Button
          variant={"ghost"}
          type="submit"
          onClick={handleDeleteForm}
          size={"sm"}
          className={"text-red-500"}
        >
          Delete
        </Button>

        <Button type="submit" size={"sm"} onClick={handleSubmit}>
          Done
        </Button>
      </div>
    </div>
  );
}

export default ProductOptionForm;
