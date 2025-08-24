//@ts-nocheck
import { FC } from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "../ui/textarea";

export const TextareaField: FC<{
  name: string;
  label?: string;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}> = ({
  name,
  label,
  type,
  readOnly = false,
  disabled = false,
  placeholder,
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem {...rest}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Textarea
              readOnly={readOnly}
              disabled={disabled}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
