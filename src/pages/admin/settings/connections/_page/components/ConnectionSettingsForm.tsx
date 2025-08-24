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

const formSchema = z.object({
  netsuiteConnectionInfo: z.any(),
});

interface ConnectionSettingsFormProps {
  onSubmit?: (data: any) => void;
  initialValues?: any;
}

export const ConnectionSettingsForm = forwardRef(
  ({ initialValues, onSubmit }: ConnectionSettingsFormProps, ref) => {
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        netsuiteConnectionInfo: initialValues?.netsuiteConnectionInfo ?? {
          accountId: "",
          consumerKey: "",
          consumerSecret: "",
          tokenId: "",
          tokenSecret: "",
        },
      },
    });

    useImperativeHandle(ref, () => ({
      submit: form.handleSubmit(onSubmit),
    }));

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2 ">
            <InputField
              name="netsuiteConnectionInfo.accountId"
              label="Account ID"
            />
            <InputField
              name="netsuiteConnectionInfo.consumerKey"
              label="Consumer Key"
            />
            <InputField
              name="netsuiteConnectionInfo.consumerSecret"
              label="Consumer Secret"
            />
            <InputField
              name="netsuiteConnectionInfo.tokenId"
              label="Token ID"
            />
            <InputField
              name="netsuiteConnectionInfo.tokenSecret"
              label="Token Secret"
            />
          </div>

          <Button>Update</Button>
        </form>
      </Form>
    );
  }
);
