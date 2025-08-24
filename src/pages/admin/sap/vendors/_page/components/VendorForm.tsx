// @ts-nocheck
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import { InputField } from "@/components/fields/InputField";

interface VendorFormProps {
  onSubmit?: (data: any) => void;
  initialValues?: any;
}

const formSchema = z.object({
  contactName: z.string().min(1),
  companyName: z.string().min(1),
  email: z.string().optional(),
});

export const VendorForm = forwardRef(
  ({ initialValues, onSubmit }: VendorFormProps, ref) => {
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        contactName: initialValues?.contactName || "",
        companyName: initialValues?.companyName || "",
        email: initialValues?.email || "",
      },
    });

    useImperativeHandle(ref, () => ({
      submit: form.handleSubmit(onSubmit),
    }));

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-2">
            <InputField
              name="contactName"
              label="Contact Name"
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <InputField
              name="companyName"
              label="Company Name"
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <InputField name="email" label="Email" className="w-full" />
          </div>
        </form>
      </Form>
    );
  }
);
