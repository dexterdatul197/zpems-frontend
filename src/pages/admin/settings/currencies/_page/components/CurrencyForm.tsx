//@ts-nocheck

import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import { InputField } from "@/components/fields/InputField";
import { SelectField } from "@/components/fields/SelectField";

const formSchema = z.object({
  name: z.string().min(1),
  internalId: z.string().min(1),
  symbol: z.string().min(1),
  status: z.string().min(1),
});

interface CurrencyFormProps {
  onSubmit?: (data: any) => void;
  initialValues?: any;
}

export const CurrencyForm = forwardRef(
  ({ initialValues, onSubmit }: CurrencyFormProps, ref) => {
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: initialValues?.name ?? "",
        internalId: initialValues?.internalId ?? "",
        symbol: initialValues?.symbol ?? "",
        status: initialValues?.status ?? "active",
      },
    });

    useImperativeHandle(ref, () => ({
      submit: form.handleSubmit(onSubmit),
    }));

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <InputField name="name" label="Name" />
          <InputField name="internalId" label="Internal ID" />
          <InputField name="symbol" label="Symbol" />
          <SelectField
            name="status"
            label="Status"
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
          />
        </form>
      </Form>
    );
  }
);
