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

import { Label } from "@/components/ui/label";
import { DropzoneField } from "@/components/fields/DropzoneField";

const formSchema = z.object({
  logo: z.any(),
  dateFormat: z.string().min(1),
  timeFormat: z.string().min(1),
});

interface GeneralSettingsFormProps {
  onSubmit?: (data: any) => void;
  initialValues?: any;
}

export const GeneralSettingsForm = forwardRef(
  ({ initialValues, onSubmit }: GeneralSettingsFormProps, ref) => {
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        logo: initialValues?.logo ?? "",
        dateFormat: initialValues?.dateFormat ?? "MM/DD/YYYY",
        timeFormat: initialValues?.timeFormat ?? "12",
      },
    });

    useImperativeHandle(ref, () => ({
      submit: form.handleSubmit(onSubmit),
    }));

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2 ">
            <Label>Logo</Label>
            <DropzoneField name="logo" multiple={false} />
          </div>

          <InputField name="dateFormat" label="Date Format" />
          <InputField name="timeFormat" label="Time Format" />

          <Button>Update</Button>
        </form>
      </Form>
    );
  }
);
