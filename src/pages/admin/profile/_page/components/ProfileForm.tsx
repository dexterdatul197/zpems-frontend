//@ts-nocheck

import React, { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import { InputField } from "@/components/fields/InputField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DropzoneAvatar } from "./DropzoneAvatar";

const formSchema = z.object({
  id: z.any(),
  name: z.string().nonempty(),
  email: z.string().email(),
  picture: z.any(),
});

interface ProfileFormProps {
  onSubmit?: (data: any) => void;
  initialValues?: any;
}

export const ProfileForm = forwardRef(
  ({ initialValues, onSubmit }: ProfileFormProps, ref) => {
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        id: initialValues?.id || "",
        name: initialValues?.name || "",
        email: initialValues?.email || "",
        picture: initialValues?.picture || "",
      },
    });

    useImperativeHandle(ref, () => ({
      submit: form.handleSubmit(onSubmit),
    }));

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2 ">
            <InputField name="id" label="ID" hidden readOnly />
            <div className="flex flex-col gap-2 ">
              <Label>Picture</Label>
              <DropzoneAvatar name="picture" multiple={false} />
            </div>

            <InputField name="name" label="Name" />
            <InputField name="email" label="Email" readOnly />
          </div>

          <Button>Update</Button>
        </form>
      </Form>
    );
  }
);
