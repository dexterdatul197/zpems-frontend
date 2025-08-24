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
  email: z.string().email(),
  role: z.string().min(1),
  // password: z.string().min(8),
  // passwordConfirmation: z.string().min(8),
});

interface UserFormProps {
  onSubmit?: (data: any) => void;
  initialValues?: any;
}

export const UserForm = forwardRef(
  ({ initialValues, onSubmit }: UserFormProps, ref) => {
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: initialValues?.name ?? "",
        email: initialValues?.email ?? "",
        role: initialValues?.role ?? "user",
      },
    });

    useImperativeHandle(ref, () => ({
      submit: form.handleSubmit(onSubmit),
    }));

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <InputField name="name" label="Name" />
          <InputField name="email" label="Email" />
          <SelectField
            name="role"
            label="Role"
            options={[
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
            ]}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
          />
        </form>
      </Form>
    );
  }
);
