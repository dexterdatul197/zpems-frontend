// @ts-nocheck
import { FC } from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Switch } from "../ui/switch";

export const SwitchField: FC<{
  name: string;
  label: string;
  type?: string;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
}> = ({ name, label, type, readOnly = false, disabled = false, ...rest }) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <FormLabel>{label}</FormLabel>
            {/* <FormDescription>
              Receive emails about new products, features, and more.
            </FormDescription> */}
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
