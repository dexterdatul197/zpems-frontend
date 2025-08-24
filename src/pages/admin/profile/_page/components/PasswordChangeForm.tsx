//@ts-nocheck

import React, { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { InputField } from "@/components/fields/InputField";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const formSchema = z
  .object({
    oldPassword: z.string().min(1, { message: "Required" }),
    newPassword: z.string().min(1, { message: "Required" }),
    confirmPasword: z.string().min(1, { message: "Required" }),
  })
  .refine((data) => data.newPassword === data.confirmPasword, {
    message: "Passwords don't match",
    path: ["confirmPasword"],
  });

interface PasswordChangeFormProps {
  onSubmit?: (data: any) => void;
}

export const PasswordChangeForm = forwardRef(
  ({ onSubmit }: PasswordChangeFormProps, ref) => {
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {},
    });

    useImperativeHandle(ref, () => ({
      submit: form.handleSubmit(onSubmit),
    }));

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2 ">
            <InputField name="id" label="ID" hidden readOnly />
            <InputField
              type="password"
              name="oldPassword"
              label="Old Password"
            />
            <InputField
              type="password"
              name="newPassword"
              label="New Password"
            />
            <InputField
              type="password"
              name="confirmPasword"
              label="Confirm Password"
            />
          </div>

          <Button>Change Password</Button>
        </form>
      </Form>
    );
  }
);
