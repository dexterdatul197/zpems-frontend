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
import { testOpenAIConnection } from "@/api/settings";

const formSchema = z.object({
  openAIAPIKey: z.string().optional(),
});

interface OpenAISettingsFormProps {
  onSubmit?: (data: any) => void;
  initialValues?: any;
}

export const OpenAISettingsForm = forwardRef(
  ({ initialValues, onSubmit }: OpenAISettingsFormProps, ref) => {
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        openAIAPIKey: initialValues?.openAIAPIKey ?? "",
      },
    });

    useImperativeHandle(ref, () => ({
      submit: form.handleSubmit(onSubmit),
    }));

    const handleTestConnection = async (values) => {
      try {
        const { ok } = await testOpenAIConnection(values);
        if (ok) {
          toast.success("Connection successful");
        } else {
          toast.error("Connection failed");
        }
      } catch (error) {
        console.error(error);
        toast.error("Connection failed");
      }
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <InputField name="openAIAPIKey" label="OpenAI API Key" />
          </div>

          <Button>Update</Button>
        </form>
      </Form>
    );
  }
);
