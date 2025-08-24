//@ts-nocheck
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import { InputField } from "@/components/fields/InputField";
import { SelectField } from "@/components/fields/SelectField";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { usePaymentDetailsStore } from "../zustand/usePaymentDetailsStore";

interface PaymentMethodFormProps {
  onSubmit?: (data: any) => void;
  initialValues?: any;
}

export const PaymentMethodForm = forwardRef(
  ({ initialValues, onSubmit }: PaymentMethodFormProps, ref) => {
    const { activeStepIndex, setStepOptions } = usePaymentDetailsStore();

    const formSchema = z.object({
      method: z.string().min(1), //1: Check , 2: other
      currency: z.string().min(1),
      nameOnCheck: z.string().min(1),
      addressToSend: z.string().min(1),
    });

    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        method: initialValues?.method?.method || "",
        currency: initialValues?.method?.currency || "",
        nameOnCheck: initialValues?.method?.nameOnCheck || "",
        addressToSend: initialValues?.method?.addressToSend || "",
      },
    });

    useImperativeHandle(ref, () => ({
      submit: form.handleSubmit(onSubmit),
    }));

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex">
            <Label className="w-40 pt-3">Payment Method: </Label>
            <SelectField
              name="method"
              label=""
              options={[
                { key: "1", label: "Check" },
                { key: "2", label: "Other" },
              ]}
              getOptionValue={(option) => option.key}
              getOptionLabel={(option) => option.label}
              className="w-1/2"
            />
          </div>
          <div>
            <Label className="py-4">
              Checks are sent by post to the address below. Please allow 15
              business days for the check to arrive. <br />
              Checks are for deposit only, and cannot be transferred. <br />
              The checks' currency will be as displayed above.
            </Label>
          </div>
          <div className="flex">
            <Label className="w-40 pt-3">Currency: </Label>
            <SelectField
              name="currency"
              label=""
              options={[
                { key: "usd", label: "USD" },
                { key: "eur", label: "EUR" },
              ]}
              getOptionValue={(option) => option.key}
              getOptionLabel={(option) => option.label}
              className="w-1/2"
            />
          </div>
          <div className="flex">
            <Label className="w-40 pt-3">Name on Check: </Label>
            <InputField name="nameOnCheck" label="" className="w-1/2" />
          </div>
          <div className="flex">
            <Label className="w-40 pt-3">Address to Send Check: </Label>
            <InputField name="addressToSend" label="" className="w-1/2" />
          </div>
          <div>
            <Label className="py-4">
              Payment method minimum threshold: USD 50.00. No transaction fees.
            </Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStepOptions(activeStepIndex, { isEditing: false });
              }}
            >
              Cancel
            </Button>
            <Button>Save</Button>
          </div>
        </form>
      </Form>
    );
  }
);
